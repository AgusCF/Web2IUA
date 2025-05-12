import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import usuarioAxios from "../../config/axios.js";
import { reposteriaContext } from "../../context/reposteriaContext.js";

// Se encierra entre llaves para poder extraer directamente el objeto y no tener que poner props.user.username
const Use = ({ user }) => {
  // Extraer Valores
  const { _id, username, email, role } = user;
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
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el usuario",
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
        <Link to={`/users/editarUsuario/${_id}`} className="btn btn-azul">
          <i className="fas fa-pen-alt"></i>
          Editar Usuario
        </Link>
        
        <button 
          type="button" 
          className="btn btn-rojo btn-eliminar"
          onClick={() => deleteUser(_id)}
        >
          <i className="fas fa-times"></i>
          Eliminar Usuario
        </button>
      </div>
    </li>
  );
};

export default Use;
