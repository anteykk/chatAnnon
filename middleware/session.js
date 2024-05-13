module.exports = function (req,res,next){
  if(!req.session.accept){
    req.flash(`error`, `Нужно авторизоваться в аккаунте`);
    res.redirect(`/auth`);
    return;
  }

  next();
}