import jwt from 'jsonwebtoken';

export function verificarAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }
}
export function verificarUsuario(req, res, next) {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de usuario.' });
  }
}
