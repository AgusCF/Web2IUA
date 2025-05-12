import React, { Fragment, useContext, useState, useEffect } from 'react';
import usuarioAxios from '../../config/axios.js';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { reposteriaContext } from '../../context/reposteriaContext.js';

const EditarUsuario = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [auth] = useContext(reposteriaContext);

  // user = state, saveUser = funcion para guardar el state
  const [user, saveUser] = useState({
    username: '',
    password: '',
    role: '',
    phoneNumber: '',
  });

  // Obtener el usuario a editar
  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const res = await usuarioAxios.get(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        saveUser(res.data);
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

  // Actualizar el state con los valores del formulario
  const updateState = e => {
    saveUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  // Enviar la petición para actualizar el usuario
  const actualizarUsuario = async e => {
    e.preventDefault();

    try {
      // Enviar peticion a la RestApi
      const res = await usuarioAxios.put(`/users/${id}`, user, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });

      Swal.fire({
        title: 'Usuario actualizado',
        text: res.data.message,
        icon: 'success'
      });

      // Redirigir al usuario a la lista de usuarios
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

  // Validación del formulario
  const validateForm = () => {
    const { username, password } = user;
    return !username || !password;
  };

  return (
    <Fragment>
      <h2>Editar Usuario</h2>

      <form onSubmit={actualizarUsuario}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Usuario:</label>
          <input type="text" placeholder="Nombre Usuario" name="username" value={user.username} onChange={updateState} />
        </div>

        <div className="campo">
          <label>Password:</label>
          <input type="password" placeholder="Password" name="password" value={user.password} onChange={updateState} />
        </div>

        <div className="campo">
          <label>Numero Telefono:</label>
          <input type="text" placeholder="Telefono Celular" name="phoneNumber" value={user.phoneNumber} onChange={updateState} />
        </div>

        <div className="enviar">
          <input type="submit" className="btn btn-azul" value="Actualizar Usuario" disabled={validateForm()} />
        </div>
      </form>
    </Fragment>
  );
};

export default EditarUsuario;