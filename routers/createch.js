let {Router} = require(`express`);
let pSession = require(`../middleware/session`);
let {validationResult} = require(`express-validator`);
let {create} = require(`../utils/validator`);
let User = require(`../models/user`);
let Chat = require(`../models/chats`);
let Time = require(`../public/time`);


let router = Router();

//! Создания зашифрованного чата
router.post(`/`, pSession, create, async (req,res)=>{
  
  let errors = validationResult(req);

  if(!errors.isEmpty()){
    req.flash(`errors`, errors.array()[0].msg);
    res.redirect(`/adminka`);
    return;
  }

  let check = await User.findOne({_id: req.session.user._id});

  if(check.NumChat < 5){
    
    // Создаем чат
    await new Chat({
      name: req.body.chat,
      mesSum: 0,
      create: Time(),
      whocreate: req.session.user._id
    })
    .save()
    .then((s)=>{
      console.log(s);
    })

    // Регистрируем создания чата в базе пользователя
    check.NumChat++;
    await check.save();
    req.session.user.NumChat++;
    await req.session.save();


    req.flash(`success`, `Успешное создания чата ${req.body.chat}`)
    res.redirect(`/adminka`);
  } else {
    req.flash(`errors`, `Вы создали максимальное количество чатов`);
    res.redirect(`/adminka`);
  }




})

module.exports = router;