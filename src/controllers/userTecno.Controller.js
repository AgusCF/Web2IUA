import { pool } from '../databases/dbTecno.js';
import jwt from 'jsonwebtoken';

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Obtener usuario por teléfono
export const getUserByTel = async (req, res) => {
  const { tel } = req.query;
  if (!tel) return res.status(400).json({ message: "Falta el teléfono" });
  try {
    const result = await pool.query('SELECT * FROM users WHERE tel = $1', [tel]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar usuario" });
  }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).send('Usuario no encontrado');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

// Crear usuario (Registro)
export const createUser = async (req, res) => {
  const { username, telefono = '', password, email, role = 'client' } = req.body;

  // Validaciones básicas
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, email y password son requeridos' });
  }

  // Validar formato de contraseña
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      message: "La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número" 
    });
  }

  try {
    // Verificar si el usuario ya existe por email
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'El usuario ya existe con este email' });
    }

    // Crear nuevo usuario
    const result = await pool.query(
      'INSERT INTO users (username, password, tel, email, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, tel, email, role',
      [username, password, telefonoFinal, email, role]
    );
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
  const { username, telefono, password, role } = req.body;
  try {
    // No encriptar la contraseña
    const result = await pool.query(
      `UPDATE users SET 
        username = COALESCE($1, username), 
        tel = COALESCE($2, tel), 
        password = COALESCE($3, password), 
        role = COALESCE($4, role)
      WHERE id = $5 RETURNING *`,
      [username, telefono, password, role, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).send('Usuario no encontrado');
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

// Cambiar la contraseña de un usuario
export const updatedPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número" });
  }
  try {
    // Guarda la contraseña en texto plano
    const result = await pool.query('UPDATE users SET password = $1 WHERE id = $2 RETURNING *', [password, id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    return res.status(500).json({ message: "Error al cambiar la contraseña" });
  }
};

// Autenticar un usuario y generar un token JWT
export const autenticarUsuario = async (req, res) => {
  const { tel, telefono, password } = req.body;
  const telefonoFinal = tel || telefono;
  try {
    const result = await pool.query('SELECT * FROM users WHERE tel = $1', [telefonoFinal]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "El usuario no existe" });
    }
    const user = result.rows[0];
    // Comparación directa de contraseñas
    if (password !== user.password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, tel: user.telefonoFinal, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );
    return res.json({
        token,
        usuario: {
            username: user.username,
            tel: user.tel,
            role: user.role
        }
    });
  } catch (error) {
    console.error('Error al autenticar usuario:', error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};
/* 
import users from '../models/usersDb.js'; // Simulando una base de datos de usuarios

export const getAllUsers = (req, res) => {
  res.json(users);
};

export const getUserById = (req, res) => {
  const tel = users.find(u => u.id === parseInt(req.params.id));
  if (!tel) return res.status(404).send('User not found');
  res.json(tel);
};

export const createUser = (req, res) => {
  const { tel } = req.body;
  const newUser = {
    id: users.length + 1,
    username : 'User'+ users.id,
    password: tel,
    tel
  };
  users.push(newUser);
  res.status(201).json(newUser);
};

export const updateUser = (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('User not found');

  const { username, tel } = req.body;
  user.username = username ?? user.username;
  user.tel = tel ?? user.tel;

  res.json(user);
};

// Cambiar la contraseña de un usuario
export const updatedPassword = (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  // Validar la nueva contraseña
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Al menos 8 caracteres, una letra y un número
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres, incluyendo una letra y un número" });
  }

  // Buscar el usuario en el array
  const user = users.find(u => u.id === parseInt(id));
  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  // Actualizar la contraseña
  user.password = password;

  return res.json({ message: "Contraseña actualizada correctamente" });
};

// Autenticar un usuario y generar un token JWT
export const autenticarUsuario = (req, res) => {
  const { phoneNumber, password } = req.body;
  const user = users.find(u => u.tel === phoneNumber);

  if (!user) {
    return res.status(404).json({ message: "El usuario no existe" });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Contraseña incorrecta" });
  }

  // Si quieres devolver un "token" simulado, puedes hacerlo así:
  // const token = "fake-jwt-token";
  // return res.json({ token });

  // O simplemente devolver el usuario autenticado:
  return res.json({ message: "Autenticación exitosa", user });
}; */