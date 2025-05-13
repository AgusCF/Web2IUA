import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import usuarioAxios from "../../config/axio.js";
import { reposteriaContext } from "../../context/reposteriaContext.js";

// Se encierra entre llaves para poder extraer directamente el objeto y no tener que poner props.user.username
const Use = ({ user }) => {
  // Extraer Valores
  const { id, username, email, role } = user;
  const [auth] = useContext(reposteriaContext);

  // Eliminar Usuario
  const deleteUser = async idUsuario => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "Un usuario eliminado no se puede recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Llamado axios
          const res = await usuarioAxios.delete(`/users/${idUsuario}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          });

          Swal.fire({
            title: "Eliminado!",
            text: res.data.message,
            icon: "success"
          });
        } catch (error) {
          const errorMessage = error.response?.data?.message || "No se pudo eliminar el usuario";
          Swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error"
          });
          console.error("Error al eliminar usuario:", error);
        }
      }
    });
  };

  return (
    <li className="cliente">
      <div className="info-cliente">
        <p className="nombre">{username}</p>
        <p className="empresa">{role}</p>
        <p>{email}</p>
      </div>
      <div className="acciones">
        <Link to={`/users/editarUsuario/${id}`} className="btn btn-azul">
          <i className="fas fa-pen-alt"></i>
          Editar Usuario
        </Link>

        <Link to={`/users/cambiarPassword/${id}`} className="btn btn-verde">
          <i className="fas fa-key"></i>
          Cambiar Contraseña
        </Link>

        <button 
          type="button" 
          className="btn btn-rojo btn-eliminar"
          onClick={() => deleteUser(id)}
        >
          <i className="fas fa-times"></i>
          Eliminar Usuario
        </button>
      </div>
    </li>
  );
};

export default Use;
