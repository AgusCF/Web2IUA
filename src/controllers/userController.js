import { pool }  from '../databases/db.js'; // Asegúrate de que pool esté configurado para PostgreSQL
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Crear un nuevo usuario
export const newUser = async (req, res) => {
  //console.log('req.body:', req.body);
  const { username, phoneNumber, password, role, priority_level } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      `INSERT INTO Users (username, password, role, phone_number, priority_level) 
        VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [username, hashedPassword, role, phoneNumber, priority_level]
    );
    return res.json({ message: "Usuario creado correctamente", userId: result.rows[0].id });
  } catch (error) {
    console.error('error:', error);
    return res.status(500).json({ message: "Error al crear usuario" });
  }
};

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const { id } = req.user;
    //console.log('req.user:', req.user);
    const result = await pool.query(`SELECT priority_level FROM Users WHERE id = $1`, [id]);

    // Acceder directamente al priority_level
    const priority_level = result.rows[0]?.priority_level;

    let users;
    if (priority_level == 4) {
      // Usuarios con nivel de prioridad mayor a 1 ven a los de nivel inferior
      users = await pool.query(`SELECT * FROM Users WHERE priority_level <= $1`, [priority_level]);
    } else if (priority_level > 1) {
      // Usuarios con nivel de prioridad mayor a 1 ven a los de nivel inferior
      users = await pool.query(`SELECT * FROM Users WHERE id = $1 or priority_level < $2`, [ id, priority_level ]);
    } else {
      // Usuarios con nivel de prioridad 1 solo se ven a sí mismos
      users = await pool.query(`SELECT * FROM Users WHERE id = $1`, [id]);
    }

    return res.json(users.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id: userId, priority_level } = req.user;
    const { id } = req.params;

    if (priority_level === 1 && userId !== id) {
      return res.status(403).json({ message: "No tienes permisos para ver este usuario" });
    }

    const result = await pool.query(`SELECT * FROM Users WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener usuario" });
  }
};

// Obtener un usuario por número de departamento
export const getUserByNumDept = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM Users WHERE department_letter = $1`, [req.params.departmentLetter]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener usuario" });
  }
};

// Actualizar un usuario por ID
export const updateUser = async (req, res) => {
  const { username, phoneNumber, password, role, priority_level } = req.body;
  const { id: userId, priority_level: userPriorityLevel } = req.user;
  const userIdParam = parseInt(req.params.id, 10); // Convertir req.params.id a número
  /* console.log('req.body:', req.body);
  console.log('req.user:', req.user);
  console.log('userId:', userId);
  console.log('req.params.id:', userIdParam); */

  try {
    const result = await pool.query(`SELECT * FROM Users WHERE id = $1`, [req.params.id]);
    const userToUpdate = result.rows[0];

    if (!userToUpdate) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (userId === userIdParam) {
      // Permitir que los usuarios se actualicen a sí mismos
      /* console.log('req.body.passwordN1', req.body.passwordN1);
      console.log('req.body.password', req.body.password); */
      let hashedPassword = userToUpdate.password;
      if (password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      await pool.query(
        `UPDATE Users 
          SET username = $1, phoneNumber = $2, role = $3, password = $4
          WHERE id = $8`,
        [username, phoneNumber, role,  hashedPassword, req.params.id]
      );
      return res.json({ message: "Usuario actualizado correctamente" });
    }

    if (userPriorityLevel <= userToUpdate.priority_level) {
      return res.status(403).json({ message: "No tienes permisos para actualizar este usuario" });
    }

    // Solo permitir que las prioridades 3 y 4 se modifiquen en el backend
    let newPriorityLevel = userToUpdate.priority_level;
    if (priority_level && priority_level <= 2) {
      newPriorityLevel = priority_level;
    }

    await pool.query(
      `UPDATE Users 
        SET username = $1, phoneNumber = $2, role = $3, priority_level = $4
        WHERE id = $8`,
      [username, phoneNumber, role, newPriorityLevel, req.params.id]
    );
    return res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// Autenticar un usuario y generar un token JWT
export const autenticarUsuario = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    //console.log('req.body:', req.body);
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
        nombre: user.username,
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

// Cambiar la contraseña de un usuario
export const updatedPassword = async (req, res) => {
  const { id } = req.params; // ID del usuario desde la URL
  const { password } = req.body; // Nueva contraseña desde el cuerpo de la solicitud

  try {
    // Validar la nueva contraseña
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Al menos 8 caracteres, una letra y un número
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número" });
    }

    // Verificar si el usuario existe
    const result = await pool.query(`SELECT * FROM Users WHERE id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar la contraseña en la base de datos
    await pool.query(`UPDATE Users SET password = $1 WHERE id = $2`, [hashedPassword, id]);

    return res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    return res.status(500).json({ message: "Error al cambiar la contraseña" });
  }
};