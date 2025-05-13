import React, { Fragment, useContext, useState } from 'react';
import usuarioAxios from '../../config/axio.js';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { reposteriaContext } from '../../context/reposteriaContext.js';

const NewUser = () => {
  const navigate = useNavigate();
  const [auth] = useContext(reposteriaContext);

  // user = state, saveUser = funcion para guardar el state
  const [user, saveUser] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    departmentLetter: '',
    phoneNumber: '',
    floorNumber: ''
  });

  // Agregando a la RestApi un nuevo usuario
  const addUser = async e => {
    e.preventDefault();

    try {
      // Enviar peticion a la RestApi
      const res = await usuarioAxios.post('/users', user, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });

      Swal.fire({
        title: "Se agregó el usuario",
        text: res.data.mensaje,
        icon: "success"
      });
      navigate('/users');

    } catch (error) {
      if (error.response && error.response.data.code === 11000) {
        Swal.fire({
          title: "Error de duplicado",
          text: "El usuario ya existe",
          icon: "error"
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al agregar el usuario",
          icon: "error"
        });
      }
    }
  };

  // Leer los datos del formulario
  const updateState = e => {
    saveUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  // Validación del formulario
  const validateForm = () => {
    const { username, email, password, role, departmentLetter, floorNumber, phoneNumber } = user;
    return !username || !email || !password || !role || !departmentLetter || !floorNumber || !phoneNumber;
  };

  return (
    <Fragment>
      <h2>Nuevo Usuario</h2>

      <form onSubmit={addUser}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Usuario:</label>
          <input type="text" placeholder="Nombre Usuario" name="username" onChange={updateState} />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input type="email" placeholder="Email de Usuario" name="email" onChange={updateState} />
        </div>

        <div className="campo">
          <label>Password:</label>
          <input type="password" placeholder="Password" name="password" onChange={updateState} />
        </div>

        <div className="campo">
          <label>Role:</label>
          <select name="role" onChange={updateState}>
            <option value="">Seleccione un rol</option>
            <option value="client">client</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="campo">
          <label>Departamento Letra:</label>
          <input type="text" placeholder="Departamento" name="departmentLetter" onChange={updateState} />
        </div>

        <div className="campo">
          <label>Piso Número:</label>
          <input type="number" placeholder="Piso Número" name="floorNumber" onChange={updateState} />
        </div>

        <div className="campo">
          <label>Numero Telefono:</label>
          <input type="text" placeholder="Telefono Celular (incluya el código de país, ej. +54)" name="phoneNumber" onChange={updateState} />
        </div>

        <div className="enviar">
          <input type="submit" className="btn btn-azul" value="Agregar Usuario" disabled={validateForm()} />
        </div>
      </form>
    </Fragment>
  );
};

export default NewUser;