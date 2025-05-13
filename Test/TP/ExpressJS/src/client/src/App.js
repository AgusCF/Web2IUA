import React, { Fragment, useContext, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async"; // Importa HelmetProvider

//? LAYOUT
import Header from "./components/layout/Header.js";
import Nav from "./components/layout/Nav.js";
import Main from "./components/layout/Main.js";

//? Components
import Users from "./components/users/Users.js";
import NewUser from "./components/users/NewUser.js";
import EditarUsuario from "./components/users/EditarUsuario.js";
import ChangePassword from "./components/users/ChangePasswords.js";
import Login from "./components/auth/Login.js";
import Products from './components/Products.js';
import Orders from './components/Orders.js';

//? Contexto
import { reposteriaContext, ReposteriaProvider } from "./context/reposteriaContext.js";

//? Routing
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.js";

//? Ping
import { pingBackend } from "./utils/pingBackend.js";

const App = () => {
  const [auth, setAuth] = useContext(reposteriaContext);

  useEffect(() => {
    const interval = setInterval(pingBackend, 60 * 1000); // Enviar ping cada 5 minutos

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, []);

  return (
    <ReposteriaProvider value={[auth, setAuth]}>
      <HelmetProvider>
        <Router>
          <Fragment>
            <Header />
            <div className="grid contenedor contenido-principal">
              <Nav />
              <main className="caja-contenido col-9">
                <Routes>
                  <Route path="/" element={<Main />} />
                  <Route path="/login" element={<Login />} />
                  <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                    <Route path="/users/newUser" element={<NewUser />} />
                  </Route>
                  <Route element={<ProtectedRoute allowedRoles={["client", 'admin']} />}>
                    <Route path="/users/editarUsuario/:id" element={<EditarUsuario />} />
                    <Route path="/users/cambiarPassword/:id" element={<ChangePassword />} />
                    <Route path="/users" element={<Users />} />
                  </Route>
                  <Route path="/products" element={<Products />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="*" element={<div>404 Not Found</div>} /> {/* Ruta para manejar 404 */}
                </Routes>
              </main>
            </div>
          </Fragment>
        </Router>
      </HelmetProvider>
    </ReposteriaProvider>
  );
};

export default App;