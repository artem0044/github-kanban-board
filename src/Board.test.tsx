import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Board from "./components/Board/Board";
import "@testing-library/jest-dom";
import axios from "axios";
import mockedGitHubIssuesResponse from "./test/mockedGitHubIssuesResponse.json";
import { ColumnKey } from "./redux/issuesSlice";

jest.spyOn(axios, "get").mockResolvedValue({ data: mockedGitHubIssuesResponse });

const mockedIssues = {
  "2898335249": { column: "todo", position: 1 },
  "2889120670": { column: "todo", position: 2 },
  "2885069874": { column: "todo", position: 3 },
  "2885035131": { column: "inProgress", position: 1 },
  "2884726726": { column: "inProgress", position: 2 },
  "2882789872": { column: "done", position: 1 },
};

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(() => "mockedCollection"),
  doc: jest.fn(() => "mockedDoc"),
  getDoc: jest.fn(async () => ({ exists: () => true, data: () => ({ issues: mockedIssues }) })),
  setDoc: jest.fn(),
}));

describe("Board Component", () => {
  it("should render page without loaded data", () => {
    render(
      <Provider store={store}>
        <Board />
      </Provider>,
    );

    expect(screen.getByPlaceholderText("Enter repo URL")).toBeInTheDocument();
    expect(screen.getByText("Load issues")).toBeInTheDocument();
    expect(screen.getByText("Nothing found")).toBeInTheDocument();
  });

  it("should fetch data from github and sort it in accordance with saved position", async () => {
    render(
      <Provider store={store}>
        <Board />
      </Provider>,
    );

    const input = screen.getByPlaceholderText("Enter repo URL");
    const button = screen.getByText("Load issues");

    fireEvent.change(input, {
      target: { value: "https://github.com/user/repo" },
    });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getAllByTestId(`issue-card.${ColumnKey.done}`)).toHaveLength(1);
      expect(screen.getAllByTestId(`issue-card.${ColumnKey.inProgress}`)).toHaveLength(2);
      expect(screen.getAllByTestId(`issue-card.${ColumnKey.todo}`)).toHaveLength(3);
    });
  });
});
