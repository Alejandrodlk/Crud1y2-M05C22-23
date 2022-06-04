
   module.exports = (req, res, next) => {
    console.log(req.session.userLogin);
  
    res.locals.userLogin = req.session.userLogin && req.session.userLogin; // Estoy creando res.locals.userLogin y le guardo lo que tenga en req.session.userLogin siempre y cuando exista
  
    next();
  };