import React, { Fragment, useContext } from "react";
import { HelmetProvider } from "react-helmet-async"; // Importa HelmetProvider

//? LAYOUT
import Header from "./components/layout/Header.js";
import Main from "./components/layout/Main.js";
import Nav from "./components/layout/Nav.js";

//? Components
import Users from "./components/users/Users.js";
import NewUser from "./components/users/NewUser.js";
import EditarUsuario from "./components/users/EditarUsuario.js";
import Login from "./components/auth/Login.js";

//? Contexto
import { reposteriaContext, ReposteriaProvider } from "./context/reposteriaContext.js";

//? Routing
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.js";

const App = () => {
  const [auth, setAuth] = useContext(reposteriaContext);

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
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/newUser" element={<NewUser />} />
                    <Route path="/users/editarUsuario/:id" element={<EditarUsuario />} />
{/*                     <Route path="/products/newCategory" element={<NewCategory />} />
                    <Route path="/products/editCategory/:id" element={<EditCategory />} />
                    <Route path="/products/newProduct" element={<NewProduct />} />
                    <Route path="/products/editProduct/:id" element={<EditProduct />} />
                    <Route path="/orders/editOrder/:id" element={<EditOrder />} /> */}
                  </Route>
                  <Route element={<ProtectedRoute allowedRoles={["client", 'admin']} />}>
                    <Route path="/users/newUser" element={<NewUser />} />
{/*                     <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/newOrder" element={<NewOrder />} />
                    <Route path="/orders/viewOrder/:id" element={<ViewOrder />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/viewProduct/:id" element={<ViewProduct />} />
                    <Route path="/products/viewCategory/:id" element={<ViewCategory />} /> 
*/}
                  </Route>
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