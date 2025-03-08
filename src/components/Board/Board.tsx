import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { IssueOptions, setIssues } from "../../redux/issuesSlice";
import { fetchIssues } from "../../redux/createAsyncThunkFuncs";
import Column from "../Column/Column";
import { ColumnKey } from "../../redux/issuesSlice";
import { database } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import Nav from "react-bootstrap/Nav";
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
import { NavItem } from "react-bootstrap";
import { getUpdatedIssuesMap, getReorderedCards } from "./helpers";

const Board = () => {
  const [repoUrl, setRepo] = useState<string>("");
  const { issues, currentRepo } = useSelector(
    (state: RootState) => state.issues,
  );

  const dispatch = useDispatch<AppDispatch>();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragMove = (event: DragMoveEvent) => {
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
  };

  const handleDragEnd = async (event: DragEndEvent) => {
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
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      sensors={sensors}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <div>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Enter repo URL"
            aria-label="Enter repo URL"
            aria-describedby="basic-addon2"
            value={repoUrl}
            onChange={({
              target: { value },
            }: React.ChangeEvent<HTMLInputElement>) => setRepo(value)}
          />
          <Button
            onClick={async () => dispatch(fetchIssues(repoUrl))}
            variant="outline-secondary"
            id="button-addon2"
          >
            Load issues
          </Button>
        </InputGroup>
        <Nav className="mb-3">
          {currentRepo && (
            <>
              <NavItem>
                <Nav.Link
                  href={`https://github.com/${currentRepo.split("/")[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Owner Profile
                </Nav.Link>
              </NavItem>
              <NavItem>
                <Nav.Link
                  href={`https://github.com/${currentRepo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Repository
                </Nav.Link>
              </NavItem>
            </>
          )}
        </Nav>
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
