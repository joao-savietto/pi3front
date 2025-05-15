import { Outlet, Link } from "react-router-dom";
import logo from "../assets/logo_ytn.png"
import { Person, Home } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { clearTokens } from "../services/slices/authSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Root() {

  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.auth.accessToken);
  const userProfile = useSelector(state => state.profile);
  const navigate = useNavigate();

  function logout() {
    dispatch(clearTokens());
    localStorage.clear();
    navigate('/login'); // Fixed: Redirect to /login instead of /
  }

  useEffect(() => {
    if (!accessToken) {
      logout()
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <div className="d-flex flex-row w-100 h-100">
      <div
        className=" d-flex flex-column align-items-center h-100"
        style={{ width: "222px", backgroundColor: "#5d9cb2" }}
      >
        <img src={logo} alt="Youtan Logo" style={{ width: '60%' }} className="mb-5" />
        <div className="d-flex flex-column align-baseline w-100 ms-4">
          {/* EXAMPLE OF NAVIGATION LINKS */}
          <Link to={'/'} className="text-white fs-6 fw-bold mb-2 text-decoration-none">
            <Home className="me-1" />
            Processos Seletivos
          </Link>
          <Link to={'/talents'} className="text-white fs-6 fw-bold mb-2 text-decoration-none">
            <Person className="me-1" />
            Candidatos
          </Link>
        </div>
        <div className="d-flex align-bottom w-100 h-100 flex-column-reverse ms-3">
          <div
            className="text-white fs-6 fw-bold mb-2 text-decoration-none"
            role="button"
            onClick={() => {
              logout()
            }}
          >
            <Person className="me-1" />
            {userProfile.profile?.nome || "[Sem Nome]"}
          </div>
        </div>
      </div>
      <div
        className="w-100 position-relative ms-0 me-3"
        style={{ overflowX: 'hidden' }}
      >
        <div
          className="d-flex flex-column align-content-center w-100 bg-dark-subtle mb-2 bottom-shaddow "
          style={{ maxHeight: "80px" }}
        >
          <p className="fs-5 mb-1 ms-3 mt-2" >RH Youtan</p>
          <p className="fs-7 fw-light ms-3 pb-2">
            Módulos
          </p>
        </div>
        <div className="position-relative w-auto ms-4 me-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
