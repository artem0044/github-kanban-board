import { ColumnKey, Issue } from "../../redux/issuesSlice";
import IssueCard from "../IssueCard/IssueCard";
import SortableIssueCard from "../SortableIssueCard";
import { useDroppable } from "@dnd-kit/core";

interface Props {
  columnKey: ColumnKey;
  issues: Issue[];
}

const columnTitles = {
  [ColumnKey.done]: "Done",
  [ColumnKey.inProgress]: "In progress",
  [ColumnKey.todo]: "To do",
};

const Column: React.FC<Props> = ({ columnKey, issues }) => {
  const { setNodeRef } = useDroppable({
    id: columnKey,
    data: {

      type: "container",
    },
  });

  return (
    <div>
      <h2>{columnTitles[columnKey]}</h2>
      <div
        data-testid={`column.${columnKey}`}
        ref={setNodeRef}
        className="shadow-md p-4 bg-[#e7e7e7] rounded-lg flex flex-col gap-3"
      >
        {issues.map((issue) => (
          <SortableIssueCard key={issue.id} id={issue.id}>
            <IssueCard issue={issue} />
          </SortableIssueCard>
        ))}
      </div>
    </div>
  );
};

export default Column;
