import React, { Fragment, useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async"; // Importa HelmetProvider
import usuarioAxios from "../../config/axio.js";
import { reposteriaContext } from "../../context/reposteriaContext.js";
import Use from "./Use.js";

function Users() {
  const [user, saveUser] = useState([]);
  const navigate = useNavigate();
  const [auth] = useContext(reposteriaContext);

  useEffect(() => {
    if (auth.token) {
      const consultarAPI = async () => {
        try {
          const usuariosConsulta = await usuarioAxios.get("/users", {
            headers: {
              Authorization: `Bearer ${auth.token}`
            },
          });
          saveUser(usuariosConsulta.data);
        } catch (error) {
          if (error.response && error.response.status === 401) {
            navigate("/login");
          } else {
            console.error("Error al obtener usuarios:", error);
          }
        }
      };
      consultarAPI();
    } else {
      navigate("/login");
    }
  }, [auth.token, navigate]);

  if (!auth.auth) {
    navigate("/login");
  }

  return (
    <HelmetProvider>
      <Fragment>
        <Helmet>
          {auth.user.role === "admin" ? <title>Usuarios</title> : <title>Usuario</title>}
        </Helmet>
        <h2>Usuarios</h2>
        {auth.user.role === "admin" && (
          <Link to={"/users/newUser"} className="btn btn-verde nvo-cliente">
            <i className="fas fa-plus-circle"></i> Nuevo Usuario
          </Link>
        )}
        <ul className="listado-clientes">
          {user.map((usuario) => (
            <Use key={usuario.id} user={usuario} />
          ))}
        </ul>
      </Fragment>
    </HelmetProvider>
  );
}

export default Users;