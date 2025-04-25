import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Board from "./components/Board/Board";
import CustomInput from "./components/CustomInput/CustomInput";

function App() {
  return (
    <div>
      <CustomInput />
      <Board />
    </div>
  );
}

export default App;
