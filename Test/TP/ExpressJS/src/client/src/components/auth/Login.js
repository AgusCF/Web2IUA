import React, { useState, useContext, Fragment } from "react";
import Swal from "sweetalert2";
import usuarioAxios from "../../config/axio.js";
import { useNavigate } from "react-router-dom";
import { reposteriaContext } from "../../context/reposteriaContext.js";
import { jwtDecode } from "jwt-decode";
import "./Logins.css"; // Importa el archivo CSS

const Login = () => {
  const [, setAuth] = useContext(reposteriaContext);
  const [credenciales, setCredenciales] = useState({});
  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();
    //console.log("Iniciando sesión con credenciales:", credenciales);
  
    try {
      const res = await usuarioAxios.post("/login", credenciales);
      //console.log("Respuesta del servidor:", res.data);
  
      const { token } = res.data;
      const decodedToken = jwtDecode(token);
      //console.log("Token decodificado:", decodedToken);
  
      const { role, departmentLetter, name, email, floorNumber } = decodedToken;
  
      localStorage.setItem("token", token);
      //console.log('token', token);
      //console.log('role', role);
      //console.log('departmentLetter', departmentLetter);
  
      setAuth({
        token,
        auth: true,
        user: {
          departmentLetter,
          role,
          name,
          email,
          floorNumber,
        }
      });
  
      //console.log('Auth', setAuth);
      Swal.fire({
        icon: "success",
        title: "Login Correcto",
        text: "Has Iniciado Sesión",
      });
  
      navigate("/users");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo iniciar sesión, intente nuevamente.",
      });
    }
  };

  const leerDatos = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <div className="login-card">
        <div className="card-header">
          <div className="log">Iniciar Sesión</div>
        </div>
        <form onSubmit={iniciarSesion}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              name="email"
              placeholder="Correo electrónico"
              required
              onChange={leerDatos}
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              required
              onChange={leerDatos}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              className="btn btn-verde btn-block"
              value="Iniciar Sesion"
            />
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Login;