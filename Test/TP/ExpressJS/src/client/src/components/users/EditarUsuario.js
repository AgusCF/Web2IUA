import React, { Fragment, useContext, useState, useEffect } from 'react';
import usuarioAxios from '../../config/axio.js';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { reposteriaContext } from '../../context/reposteriaContext.js';

const EditarUsuario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [auth] = useContext(reposteriaContext);

  const [user, saveUser] = useState({
    username: "",
    email: "",
    role: "",
    department_letter: "",
    phone_number: "",
    floor_number: ""
  });

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const res = await usuarioAxios.get(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        saveUser({
          username: res.data.username || "Usuario por defecto",
          email: res.data.email || "",
          role: res.data.role || "",
          department_letter: res.data.department_letter || "",
          phone_number: res.data.phone_number || "",
          floor_number: res.data.floor_number || ""
        });
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un error al obtener el usuario',
          icon: 'error'
        });
      }
    };
    obtenerUsuario();
  }, [id, auth.token]);

  const updateState = e => {
    const { name, value } = e.target;
    saveUser({
      ...user,
      [name]: name === "floor_number" ? Number(value) || "" : value
    });
  };

  const validateForm = () => {
    const { username, email, role, department_letter, phone_number, floor_number } = user;
    // Verificar que todos los campos estén completos
    return (
      !username.trim() ||
      !email.trim() ||
      !role.trim() ||
      !department_letter.trim() ||
      !phone_number.trim() ||
      !floor_number
    );
  };

  const actualizarUsuario = async e => {
    e.preventDefault();
    try {
      const updatedUser = { ...user };
      const res = await usuarioAxios.put(`/users/${id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });

      Swal.fire({
        title: 'Usuario actualizado',
        text: res.data.message,
        icon: 'success'
      });

      navigate('/users');
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al actualizar el usuario',
        icon: 'error'
      });
    }
  };

  const cancelarEdicion = () => {
    navigate('/users'); // Redirige a la lista de usuarios
  };

  return (
    <Fragment>
      <h2>Editar Usuario</h2>
      <form onSubmit={actualizarUsuario}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Usuario:</label>
          <input
            type="text"
            placeholder="Nombre Usuario"
            name="username"
            value={user.username}
            onChange={updateState}
          />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email de Usuario"
            name="email"
            value={user.email}
            onChange={updateState}
          />
        </div>

        {auth?.user?.role === "admin" && (
          <>
            <div className="campo">
              <label>Role:</label>
              <select name="role" value={user.role} onChange={updateState}>
                <option value="">Seleccione un rol</option>
                <option value="client">client</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="campo">
              <label>Piso Número:</label>
              <input
                type="number"
                placeholder="Piso Número"
                name="floor_number"
                value={user.floor_number || ""}
                onChange={updateState}
              />
            </div>

            <div className="campo">
              <label>Departamento Letra:</label>
              <input
                type="text"
                placeholder="Letra de Departamento"
                name="department_letter"
                value={user.department_letter}
                onChange={updateState}
              />
            </div>
          </>
        )}

        <div className="campo">
          <label>Numero Telefono:</label>
          <input
            type="text"
            placeholder="Telefono Celular"
            name="phone_number"
            value={user.phone_number}
            onChange={updateState}
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Actualizar Usuario"
            disabled={validateForm()} // Deshabilitar si faltan campos
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
    </Fragment>
  );
};

export default EditarUsuario;