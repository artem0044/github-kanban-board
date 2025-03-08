import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchIssues } from "./createAsyncThunkFuncs";

export type Issue = {
  id: number;
  title: string | null;
  number: number;
  state: "open" | "closed";
  assignee: { login: string } | null;
  html_url: string;
  position: number;
  body: string | null;
  column: ColumnKey;
};

export enum ColumnKey {
  todo = "todo",
  inProgress = "inProgress",
  done = "done",
}

export interface IssueOptions { column: ColumnKey, position: number };

export interface IssuesState {
  issues: Record<ColumnKey, Issue[]>;
  currentRepo: string;
}

const initialState: IssuesState = {
  issues: {
    todo: [],
    inProgress: [],
    done: [],
  },
  currentRepo: "",
};

const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    setIssues: (
      state,
      action: PayloadAction<{
        issues: Record<ColumnKey, Issue[]>;
      }>,
    ) => {
      const { issues } = action.payload;
      state.issues = issues;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(
      fetchIssues.fulfilled,
      (state, action: PayloadAction<{ repo: string; issues: Issue[] }>) => {
        const { issues, repo } = action.payload;
        state.currentRepo = repo;

        state.issues.done = issues
          .filter((issue) => issue.column === "done")
          .sort((a, b) => a.position - b.position)
          .map((issue, index) => ({ ...issue, position: index + 1 }));

        state.issues.inProgress = issues
          .filter((issue) => issue.column === "inProgress")
          .sort((a, b) => a.position - b.position)
          .map((issue, index) => ({ ...issue, position: index + 1 }));

        state.issues.todo = issues
          .filter((issue) => issue.column === "todo")
          .sort((a, b) => a.position - b.position)
          .map((issue, index) => ({ ...issue, position: index + 1 }));
      },
    );
  },
});

export const { setIssues } = issuesSlice.actions;
export default issuesSlice.reducer;
