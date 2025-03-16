import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { fetchIssues } from "../../redux/createAsyncThunkFuncs";

const CustomInput = () => {
  const [repoUrl, setRepo] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  return (
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
  );
};

export default CustomInput;