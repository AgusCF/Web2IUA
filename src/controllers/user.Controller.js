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
};