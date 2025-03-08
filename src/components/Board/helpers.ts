import { UniqueIdentifier } from "@dnd-kit/core";
import { ColumnKey, Issue } from "../../redux/issuesSlice";
import { arrayMove } from "@dnd-kit/sortable";

const updateCards = (issues: Issue[], column?: ColumnKey) =>
  issues.map(
    (issue, index) => ({ ...issue, position: index + 1, column: column || issue.column }),
  );

export const getReorderedCards = (targetId: UniqueIdentifier, sourceId: UniqueIdentifier, issues: Issue[]) => {
  const oldIndex = issues.findIndex((issue) => issue.id === sourceId);
  const newIndex = issues.findIndex((issue) => issue.id === targetId);

  return updateCards(arrayMove(
    issues,
    oldIndex,
    newIndex,
  ));
};

export const getUpdatedIssuesMap = (
  targetId: UniqueIdentifier,
   sourceId: UniqueIdentifier,
    targetContainer: ColumnKey, 
    initialContainer: ColumnKey, 
    issuesMap: Record<ColumnKey, Issue[]>,
  ) => {
  const updatedIssuesMap = { ...issuesMap };
  const movedIssue = issuesMap[initialContainer].find((issue) => issue.id === sourceId)!;
  const newIndex = issuesMap[targetContainer].findIndex((issue) => issue.id === targetId);
  const targetIssues = [...issuesMap[targetContainer]];
  targetIssues.splice(newIndex, 0, movedIssue);
  updatedIssuesMap[targetContainer] = updateCards(targetIssues, targetContainer);
  updatedIssuesMap[initialContainer] = updateCards(issuesMap[initialContainer].filter(issue => issue.id !== sourceId));

  return updatedIssuesMap;
};