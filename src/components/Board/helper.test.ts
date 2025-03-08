import { ColumnKey, Issue } from "../../redux/issuesSlice";
import { getReorderedCards, getUpdatedIssuesMap } from "./helpers";

describe("Board helpers", () => {
  const issue1: Issue = {
    id: 1,
    title: null,
    number: 1,
    state: "open",
    assignee: { login: "user" },
    html_url: "example",
    position: 1,
    body: null,
    column: ColumnKey.todo,
  };
  const issue2: Issue = {
    id: 2,
    title: null,
    number: 2,
    state: "open",
    assignee: { login: "user" },
    html_url: "example",
    position: 2,
    body: null,
    column: ColumnKey.todo,
  };

  it("getReorderedCards", () => {
    const mockedIssuesMap: Record<ColumnKey, Issue[]> = {
      done: [],
      todo: [issue1, issue2],
      inProgress: [],
    };
    const reorderedCards = getReorderedCards(issue2.id, issue1.id, mockedIssuesMap.todo);

    expect(reorderedCards[0].id).toBe(issue2.id);
    expect(reorderedCards[1].id).toBe(issue1.id);
  });

  it("getUpdatedIssuesMap", () => {
    const mockedIssuesMap: Record<ColumnKey, Issue[]> = {
      done: [],
      todo: [issue1],
      inProgress: [issue2],
    };

    const updatedIssueMap = getUpdatedIssuesMap(
      issue2.id,
      issue1.id,
      ColumnKey.inProgress,
      ColumnKey.todo,
      mockedIssuesMap,
    );

    expect(updatedIssueMap.inProgress).toHaveLength(2);
    expect(updatedIssueMap.todo).toHaveLength(0);
  });
});