import React, { Fragment, useContext } from "react";
import { reposteriaContext } from "../../context/reposteriaContext.js";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [auth, setAuth] = useContext(reposteriaContext);
  const navigation = useNavigate();
  const location = useLocation();

  // Cerrar sesión
  const cerrarSesion = () => {
    setAuth({
      token: '',
      auth: false,
      user: {
        role: '',
        name: null,
        phoneNumber: null,
      }
    });
    localStorage.removeItem('token');
    navigation('/login');
  };

  const iniciarSesion = () => {
    navigation("/login");
  };

  const isLoginPage = location.pathname === "/login";

  return (
    <header className="barra">
      <div className="contenedor">
        <div className="contenido-barra">
          {auth.auth ? (
            <Fragment>
              <h1>Administrador de Productos</h1>
              <button
                type="button"
                className="btn btn-rojo"
                onClick={cerrarSesion}
              >
                <i className="far fa-times-circle"></i>
                Cerrar Sesión
              </button>
            </Fragment>
          ) : (
            !isLoginPage && (
              <Fragment>
                <h1>Departamentos</h1>
                <button
                  type="button"
                  className="btn btn-verde"
                  onClick={iniciarSesion}
                >
                  <i className="far fa-times-circle"></i>
                  Iniciar Sesión
                </button>
              </Fragment>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
