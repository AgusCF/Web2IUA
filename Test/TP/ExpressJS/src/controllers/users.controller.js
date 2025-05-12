/*
router.route("/usuarios/:id")
  .get(auth(['admin', 'clientt']), getProductById)
  .put(auth(['admin']), updateProduct)
  .delete(auth(['admin']), deleteProduct);
*/
import { pool }  from '../databases/db.js'; // Asegúrate de que pool esté configurado para PostgreSQL

// Obtener un usuario por ID
export const getProductById = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM Products WHERE id = $1`, [req.params.id]);
        if (result.rows.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
        }
        return res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener usuario" });
    }
}
// Actualizar un Producto por ID
export const updateProduct = async (req, res) => {
    const { name, img, description, price, stock } = req.body;

    try {
        await pool.query(
            `UPDATE Products
            SET name = $1, img = $2, description = $3, price = $4, stock = $5, 
            WHERE id = $6`,
            [ name, img, description, price, stock, req.params.id ]
        );
        return res.json({ message: "Producto actualizado correctamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al actualizar Producto" });
    }
};
// Eliminar un Producto por ID
export const deleteProduct = async (req, res) => {
    try {
        await pool.query(`DELETE FROM Products WHERE id = $1`, [req.params.id]);
        return res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al eliminar Producto" });
    }
};

// Autenticar un usuario y generar un token JWT
export const autenticarUsuario = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        const result = await pool.query(`SELECT * FROM Users WHERE phoneNumber = $1`, [phoneNumber]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "El usuario no existe" });
        }

        const user = result.rows[0];
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
        {
            phoneNumber: user.phoneNumber,
            id: user.id,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
        );

        return res.json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
};