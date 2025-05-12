import React, { useState, useContext, Fragment } from "react";
import Swal from "sweetalert2";
import usuarioAxios from "../../config/axios.js";
import { useNavigate } from "react-router-dom";
import { reposteriaContext } from "../../context/reposteriaContext.js";
import {jwtDecode} from "jwt-decode";

const Login = () => {
  const [, setAuth] = useContext(reposteriaContext);
  const [credenciales, setCredenciales] = useState({});
  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();
    console.log("Iniciando sesión con credenciales:", credenciales);
  
    try {
      
      const res = await usuarioAxios.post("/login", credenciales);
      console.log("Respuesta del servidor:", res.data);
  
      const { token } = res.data;
      const decodedToken = jwtDecode(token);
      console.log("Token decodificado:", decodedToken);
  
      const { role, departmentNumber, name, email, floorNumber } = decodedToken;
  
      localStorage.setItem("token", token);
      console.log('token', token);
      console.log('role', role);
      console.log('departmentNumber', departmentNumber);
  
      setAuth({
        token,
        auth: true,
        user: {
          departmentNumber,
          role,
          name,
          email,
          floorNumber,
        }
      });
  
      console.log('Auth', setAuth);
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
      <div className="login">
        <h2>Iniciar Sesion</h2>

        <div className="contenedor-formulario">
          <form onSubmit={iniciarSesion}>
            <div className="campo">
              <label>Email</label>
              <input
                type="text"
                name="email"
                placeholder="Correo electrónico"
                required
                onChange={leerDatos}
              />
            </div>
            <div className="campo">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                required
                onChange={leerDatos}
              />
            </div>
            <input
              type="submit"
              className="btn btn-verde btn-block"
              value="Iniciar Sesion"
            />
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;