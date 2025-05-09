// Este middleware se encarga de verificar el token JWT y los roles del usuario
const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para acceder a este recurso.' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
  };
};

module.exports = auth;
