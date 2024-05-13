let {Router} = require(`express`);
let {validationResult} = require(`express-validator`);
let {authUser} = require(`../utils/validator`);
let User = require(`../models/user`);
let bcrypt = require(`bcrypt`);

let router = Router();

//! Страница Авторизации
router.get(`/`, function (req,res){
  res.render(`auth`, {
    title: `Страница авторизации`,
    error: req.flash(`error`),
    success: req.flash(`success`)    
  })
})

//! POST запрос на авторизацию аккаунта
router.post(`/`, authUser, async (req,res)=>{
  
  let errors = validationResult(req);

  if(!errors.isEmpty()){
    req.flash(`error`, errors.array()[0].msg);
    res.redirect(`/auth`);
    return;
  }

  let pass = await User.findOne({login: req.body.login});
  let check = await bcrypt.compare(req.body.password, pass.password);

  if(check){
    req.session.accept = true;
    req.session.user = pass;
    await req.session.save();

    res.redirect(`/`);
  } else {
    req.flash(`error`, `Неправильный логин или пароль`);
    res.redirect(`/auth`);
  }
  

})

module.exports = router;