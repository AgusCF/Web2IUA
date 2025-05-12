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
        <h2>Bienvenido {auth.user.name}</h2>
      )}

      <nav className="navegacion">
        {auth.user.role === 'admin' ? (
          <Link to={"/users"} className="clientes">
            Usuario
          </Link>
        ) : null}
        <Link to={"/productos"} className="productos">
          Productos
        </Link>
        <Link to={"/pedidos"} className="pedidos">
          Pedidos
        </Link>
      </nav>
    </aside>
  );
};

export default Nav;
