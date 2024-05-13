let {Router} = require(`express`);
let pSession = require(`../middleware/session`);
let Chats = require(`../models/chats`);
let Users = require(`../models/user`);

let router = Router();

//! Удаления чата
router.get(`/:id`, pSession, async (req,res)=>{
  
  let thisChat = await Chats.findOne({_id: req.params.id});
  let User = await Users.findOne({_id: req.session.user._id});

  // Проверяю являеться ли запрашиваемый на удаления чат созданным этим пользователем
  function check(){
    return thisChat.whocreate == req.session.user._id.toString();
  }
  
  if(check()){
    await Chats.deleteOne({_id: req.params.id});
    User.NumChat--;
    await User.save();

    req.session.user = User;
    await req.session.save();

    res.redirect(`/`);

  } else {
    res.redirect(`/`);
  }

})

module.exports = router;