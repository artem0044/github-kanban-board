import React from "react";
import Card from "react-bootstrap/Card";
import { Issue } from "../../redux/issuesSlice";

interface Props {
  issue: Issue;
}

const IssueCard: React.FC<Props> = ({ issue }) => {

  return (
    <div data-testid={`issue-card.${issue.column}`}>
      <Card className="p-3 bg-white shadow-md rounded-md mb-2 min-h-[100px]">
        <Card.Body>
          <Card.Text className="text-left text-[20px]">
            <a
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              #{issue.number}
            </a>
          </Card.Text>
          <Card.Text className="text-left text-base">{issue.title}</Card.Text>
          {issue.assignee && (
            <Card.Text className="text-sm text-gray-500">
              Assigned to: {issue.assignee.login}
            </Card.Text>
          )}
          <Card.Text className="text-sm text-gray-700">
            {issue?.body && issue?.body?.length > 100
              ? issue.body.slice(0, 100) + "..."
              : issue.body}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default IssueCard;
