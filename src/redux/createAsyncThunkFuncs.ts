import { createAsyncThunk } from "@reduxjs/toolkit";
import { database } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import axios from "axios";
import { ColumnKey, Issue, IssueOptions } from "./issuesSlice";

const getIssueColumn = (issue: Issue) => {
  if (issue.state === "closed") return ColumnKey.done;
  return issue.assignee
    ? ColumnKey.inProgress
    : ColumnKey.todo;
};

export const fetchIssues = createAsyncThunk(
  "issues/fetchIssues",
  async (repoUrl: string, { rejectWithValue }) => {
    try {
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);

      if (!match) {
        throw new Error("Invalid GitHub repository URL");
      }

      const repo = `${match[1]}/${match[2]}`;
      const { data: githubIssues } = await axios.get<Issue[]>(
        `https://api.github.com/repos/${repo}/issues?state=all`,
      );

      const repoDocRef = doc(database, "repos", `${match[1]}.${match[2]}`);

      const repoDocSnapshot = await getDoc(repoDocRef);
      const existingRepoData = repoDocSnapshot.exists()
        ? repoDocSnapshot.data()
        : null;

      const mergedIssues: Issue[] = githubIssues.map<Issue>((issue) => {
        const issueOptions: IssueOptions = existingRepoData?.issues[issue.id];

        return {
          ...issue,
          column:
            issueOptions?.column ||
            getIssueColumn(issue),
          position: issueOptions?.position || 0,
        };
      });

      return { repo, issues: mergedIssues };
    } catch (error) {
      console.error("Error fetching or saving issues:", error);
      return rejectWithValue(error || "An error occurred");
    }
  },
);
