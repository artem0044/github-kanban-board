import Nav from "react-bootstrap/Nav";
import { NavItem } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const RepoNav = () => {
  const { currentRepo } = useSelector(
    (state: RootState) => state.issues,
  );
  return (
    <Nav className="mb-3">
      {currentRepo && (
        <>
          <NavItem>
            <Nav.Link
              href={`https://github.com/${currentRepo.split("/")[0]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Owner Profile
            </Nav.Link>
          </NavItem>
          <NavItem>
            <Nav.Link
              href={`https://github.com/${currentRepo}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Repository
            </Nav.Link>
          </NavItem>
        </>
      )}
    </Nav>
  );
};

export default RepoNav;