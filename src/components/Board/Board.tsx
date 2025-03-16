import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { IssueOptions, setIssues } from "../../redux/issuesSlice";
import Column from "../Column/Column";
import { ColumnKey } from "../../redux/issuesSlice";
import { database } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { getUpdatedIssuesMap, getReorderedCards } from "./helpers";
import RepoNav from "../RepoNav/RepoNav";
import { useCallback } from "react";

const Board = () => {
  const { issues, currentRepo } = useSelector(
    (state: RootState) => state.issues,
  );

  const dispatch = useDispatch<AppDispatch>();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragMove = useCallback((event: DragMoveEvent) => {
    const { active, over } = event;

    if (!over?.id) return;

    const initialContainer: ColumnKey =
      active.data.current?.sortable?.containerId;

    if (!initialContainer) return;

    const targetContainer: ColumnKey = over.data.current?.sortable?.containerId ?? over.id;

    if (initialContainer === targetContainer) {
      dispatch(setIssues({
        issues: {
          ...issues, [initialContainer]: getReorderedCards(over.id, active.id, issues[initialContainer]),
        },
      }));
    } else {
      dispatch(
        setIssues({
          issues: getUpdatedIssuesMap(over.id, active.id, targetContainer, initialContainer, issues),
        }),
      );
    }
  }, [dispatch, issues]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    if (!event.over?.id) return;

    const [owner, repository] = currentRepo.split("/");

    const repoDocRef = doc(database, "repos", `${owner}.${repository}`);

    const updatedIssuesMap: Record<number, IssueOptions> = {};

    Object.values(issues).forEach((columnIssues) => {
      columnIssues.forEach((issue) => {
        updatedIssuesMap[issue.id] = { column: issue.column, position: issue.position };
      });
    });

    await setDoc(repoDocRef, { issues: updatedIssuesMap }, { merge: true });
  }, [currentRepo, issues]);

  return (
    <DndContext
      collisionDetection={closestCorners}
      sensors={sensors}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <div>
        <RepoNav />
        {Object.values(issues).every((arr) => arr.length === 0) ? (
          <p>Nothing found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(issues).map(([key, issues]) => (
              <SortableContext
                strategy={verticalListSortingStrategy}
                key={key}
                id={key}
                items={issues}
              >
                <Column issues={issues} columnKey={key as ColumnKey} />
              </SortableContext>
            ))}
          </div>
        )}
      </div>
    </DndContext>
  );
};

export default Board;
