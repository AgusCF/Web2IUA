import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import { reposteriaContext } from '../../context/reposteriaContext.js';

const Nav = () => {
  const [auth] = useContext(reposteriaContext);

  if (!auth.auth || auth.user.role === 'client') return null;

  return (
    <aside className="sidebar col-3">
      {auth.user.role === 'admin' ? (
        <h2>Administración</h2>
      ) : (
        <h2>Departamento {auth.user.departmentLetter}, Piso {auth.user.floorNumber}</h2>
      )}

      <nav className="navegacion">
        {/* {auth.user.role === 'admin' ? ( */}
          <Link to={"/users"} className="clientes">Mis Datos</Link>
          <Link to={"/orders"} className="productos">Mis Órdenes</Link>
          <Link to={"/products"} className="pedidos">Productos</Link>
      </nav>
    </aside>
  );
};

export default Nav;
