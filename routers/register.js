let {Router} = require(`express`);
let {validationResult} = require(`express-validator`);
let {regUser} = require(`../utils/validator`);
let bcrypt = require(`bcrypt`); // Модуль для шифрования пароля
let NodeRSA = require(`node-rsa`); // Модуль для шифрования данных
let User = require(`../models/user`);
let Time = require(`../public/time`);

let router = Router();

//! Страница регистрации
router.get(`/`, function (req,res){
  res.render(`register`, {
    title: `Страница регистрации`,
    error: req.flash(`error`),
    success: req.flash(`success`)
  })
})

//! POST запрос на регистрацию аккаунта
router.post(`/`, regUser, async (req,res)=>{

  let key = new NodeRSA({b: 512}); // Генерация 512 битного приватной и публичного ключя


  let errors = validationResult(req); 

  if(!errors.isEmpty()){
    req.flash(`error`, errors.array()[0].msg)
    res.redirect(`/register`);
    return;
  }

  let check = await User.findOne({login: req.body.login});

  if(!check){
    req.body.password = await bcrypt.hash(req.body.password, 10); // Шифрую пароль

    await new User({
      login: req.body.login,
      password: req.body.password,
      key: key.exportKey(),
      created: Time(),
      NumChat: 0
    })
    .save()
    .then((s)=>{
      console.log(s);
    })

    req.flash(`success`, `Успешная регистрация аккаунта`);
    res.redirect(`/auth`);
  } else {
    req.flash(`error`, `Аккаунт с таким логином уже существует`);
    res.redirect(`/register`);
  }




  
})

module.exports = router;