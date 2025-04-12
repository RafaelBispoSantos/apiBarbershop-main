exports.adminMiddleware = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'Acesso negado. Permissão de administrador necessária.'
      });
    }
    next();
  };