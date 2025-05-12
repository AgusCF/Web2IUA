import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import usuarioAxios from '../../config/axios.js';
import { reposteriaContext } from '../../context/reposteriaContext.js';
import { format } from 'date-fns';

const Registro = () => {
  const [auth] = useContext(reposteriaContext);
  const navigate = useNavigate();
  const [callRecords, setCallRecords] = useState([]);

  useEffect(() => {
    if (!auth.auth) {
      navigate("/login");
    } else {
      const obtenerRegistros = async () => {
        try {
          const response = await usuarioAxios.get('/calls', {
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          });
          let records = response.data;
          if (auth.user.role !== 'admin') {
            records = records.filter(record => record.depto === `Depto ${auth.user.departmentNumber}`);
          }
          setCallRecords(records);
        } catch (error) {
          console.error('Error al obtener registros de llamadas:', error);
        }
      };
      obtenerRegistros();
    }
  }, [auth, navigate]);

  return (
    <div>
      <h1>Registro de Llamadas {auth.user.role === 'admin' ? ' (Admin)' : `para Depto ${auth.user.departmentNumber}`}</h1>
      <table>
        <thead>
          <tr>
            <th>Departamento</th>
            <th>Nombre client</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {callRecords.map(record => (
            <tr key={record._id}>
              <td>{record.depto}</td>
              <td>{record.userName}</td>
              <td>{format(new Date(record.timestamp), 'dd/MM/yyyy HH:mm:ss')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Registro;
