export function verificarAdmin(req, res, next) {
  if (req.user && req.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }
}
