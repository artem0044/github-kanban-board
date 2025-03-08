// import { getFirestore, collection, doc, getDoc } from "firebase/firestore";

// const mockedIssues = {
//   "2882789872": { column: "todo", position: 1 },
//   "2884726726": { column: "todo", position: 2 },
//   "2885035131": { column: "todo", position: 3 },
//   "2885069874": { column: "inProgress", position: 4 },
//   "2889120678": { column: "inProgress", position: 5 },
//   "2898335249": { column: "todo", position: 6 },
// };

// // Mock Firestore functions
// jest.mock("firebase/firestore", () => ({
//   getFirestore: jest.fn(),
//   collection: jest.fn(() => "mockedCollection"),
//   doc: jest.fn(() => "mockedDoc"),
//   getDoc: jest.fn(async () => ({ exists: true, data: () => ({ issues: mockedIssues }) })),
// }));

// export {};
