import React, { useState, useContext } from "react";
import usuarioAxios from "../../config/axio.js";
import Swal from "sweetalert2";
import { useNavigate, useParams } from 'react-router-dom';
import { reposteriaContext } from '../../context/reposteriaContext.js';

const ChangePassword = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtener el ID del usuario desde la URL
  const [auth] = useContext(reposteriaContext);
  const [error, setError] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false); // Estado para verificar si las contraseñas coinciden

  const [user, saveUser] = useState({
    passwordN1: "",
    passwordN2: "",
    password: ""
  });

  const cancelarEdicion = () => {
    navigate('/users'); // Redirige a la lista de usuarios
  };

  const verificarPasswords = () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Al menos 8 caracteres, una letra y un número
    if (!passwordRegex.test(user.passwordN1)) {
      setError("La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número");
      setPasswordsMatch(false);
      return;
    }
    if (user.passwordN1 === user.password) {
      setError("La nueva contraseña no puede ser la misma que la actual");
      setPasswordsMatch(false);
      return;
    }
    if (user.passwordN1 === user.passwordN2) {
      setPasswordsMatch(true);
      setError(""); // Limpiar el error si coinciden
    } else {
      setError("Las contraseñas no coinciden");
      setPasswordsMatch(false);
    }
  };

  const updateState = e => {
    const { name, value } = e.target;
    saveUser({
      ...user,
      [name]: value
    });

    // Llamar a verificarPasswords cada vez que se actualice un campo relacionado con las contraseñas
    if (name === "passwordN1" || name === "passwordN2") {
      verificarPasswords();
    }
  };

  const handleChangePassword = async e => {
    /* 
    e.preventDefault();
    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      const updatedPassword = { password: user.passwordN1 };
      const res = await usuarioAxios.put(`/users/${id}/password`, updatedPassword, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      }); */
      e.preventDefault();
      if (user.passwordN1 === user.passwordN2) {
        setError("");
      } else {
        setError("Las contraseñas no coinciden");
        return;
      }
      try {
        const updatedPassword = {
          ...user,
          password: user.passwordN2 // Enviar la nueva contraseña como 'password'
        };
        const res = await usuarioAxios.put(`/users/${id}/password`, updatedPassword, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });

      Swal.fire({
        title: "Contraseña actualizada",
        text: res.data.message,
        icon: "success"
      });

      navigate('/users');
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      const errorMessage = error.response?.data?.message || "No se pudo cambiar la contraseña";
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error"
      });
    }
  };

  return (
    <form onSubmit={handleChangePassword}>
      <legend>Cambiar Contraseña</legend>
      
      <div className="campo">
        <label>Contraseña Actual:</label>
        <input
          type="password"
          placeholder="Password Actual"
          name="password"
          value={user.password}
          onChange={updateState}
        />
      </div>
      <div className="campo">
        <label>Contraseña Nueva:</label>
        <input
          type="password"
          placeholder="Password"
          name="passwordN1"
          value={user.passwordN1}
          onChange={updateState}
        />
      </div>
      <div className="campo">
        <label>Repita la Contraseña Nueva:</label>
        <input
          type="password"
          placeholder="Password"
          name="passwordN2"
          value={user.passwordN2}
          onChange={updateState}
        />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="enviar">
        <input
          type="submit"
          className="btn btn-azul"
          value="Actualizar Contraseña"
          disabled={!passwordsMatch} // Deshabilitar si las contraseñas no coinciden
        />
        <button
          type="button"
          className="btn btn-rojo"
          onClick={cancelarEdicion} // Botón para cancelar
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;