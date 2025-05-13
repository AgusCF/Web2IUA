import { pool }  from '../databases/db.js'; // Asegúrate de que pool esté configurado para PostgreSQL
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Crear un nuevo usuario
export const newUser = async (req, res) => {
  //console.log('req.body:', req.body);
  const { username, email, password, role, departmentLetter, floorNumber, phoneNumber } = req.body;

  // Asegúrate de que phoneNumber sea una cadena
  const formattedPhoneNumber = String(phoneNumber);
  //console.log('departmentLetter:', departmentLetter);
  const hashedPassword = await bcrypt.hash(password, 10);

  let priority_level = 1; // Prioridad por defecto para clientes
  if (role === 'admin') {
    priority_level = 2; // Prioridad 2 para administradores
  }

  try {
    const result = await pool.query(
      `INSERT INTO Users (username, email, password, role, department_letter, phone_number, floor_number, priority_level) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [username, email, hashedPassword, role, departmentLetter.toUpperCase() , formattedPhoneNumber, floorNumber, priority_level]
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
  const { username, email, password, role, department_letter, phone_number, floor_number, priority_level } = req.body;
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
          SET username = $1, email = $2, role = $3, department_letter = $4, phone_number = $5, floor_number = $6, password = $7 
          WHERE id = $8`,
        [username, email, role, department_letter.toUpperCase() , phone_number, floor_number, hashedPassword, req.params.id]
      );
      return res.json({ message: "Usuario actualizado correctamente" });
    }
    if (userId !== req.params.id) {
      //console.log('puta madre');
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
        SET username = $1, email = $2, role = $3, department_letter = $4, phone_number = $5, floor_number = $6, priority_level = $7 
        WHERE id = $8`,
      [username, email, role, department_letter, phone_number, floor_number, newPriorityLevel, req.params.id]
    );
    return res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // id es una cadena
    const { id: userId, priority_level } = req.user; // userId es el ID del usuario autenticado
    //console.log('req.user', req.user);

    // Consultar solo los campos necesarios
    const result = await pool.query(`SELECT id, priority_level FROM Users WHERE id = $1`, [id]);
    const userToDelete = result.rows[0];

    if (!userToDelete) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

  //    console.log('userToDelete.id:', userToDelete.id);

    // Convertir id a número para la comparación
    if (parseInt(id, 10) === userId) {
      return res.status(403).json({ message: "No puedes eliminar tu propio usuario" });
    }

    if (priority_level <= userToDelete.priority_level) {
      return res.status(403).json({ message: "No tienes permisos para eliminar este usuario" });
    }

    // Eliminar usuario
    await pool.query(`DELETE FROM Users WHERE id = $1`, [id]);
    return res.json({ message: "Usuario eliminado correctamente" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar usuario" });
  }
};


// Autenticar un usuario y generar un token JWT
export const autenticarUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;
    //console.log('req.body:', req.body);
    const result = await pool.query(`SELECT * FROM Users WHERE email = $1`, [email]);
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
        email: user.email,
        nombre: user.username,
        id: user.id,
        role: user.role,
        departmentLetter: user.department_letter,
        phoneNumber: user.phone_number,
        floorNumber: user.floor_number,
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

// Crear un usuario temporal
export const loginTemporal = async (req, res) => {
  try {
    const temporalUser = {
      username: "client_" + new Date().getTime(),
      role: "client",
    };

    const token = jwt.sign(
      {
        username: temporalUser.username,
        role: temporalUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    return res.json({ token });
  } catch (error) {
    console.error("Error al generar usuario temporal:", error);
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