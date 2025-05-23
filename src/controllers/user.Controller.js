import users from '../usersDb.js'; // Simulando una base de datos de usuarios

export const getAllUsers = (req, res) => {
  res.json(users);
};

export const getUserById = (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('User not found');
  res.json(user);
};

export const createUser = (req, res) => {
  const { username, password, name } = req.body;
  const newUser = {
    id: users.length + 1,
    username,
    password,
    name
  };
  users.push(newUser);
  res.status(201).json(newUser);
};

export const updateUser = (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('User not found');

  const { username, password, name } = req.body;
  user.username = username ?? user.username;
  user.password = password ?? user.password;
  user.name = name ?? user.name;

  res.json(user);
};

export const deleteUser = (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('User not found');
  users.splice(index, 1);
  res.status(204).send();
};