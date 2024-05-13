let {Router} = require(`express`);
let pSession = require(`../middleware/session`);
let Chats = require(`../models/chats`);


let router = Router();

router.get(`/:id`, pSession, async (req,res)=>{


  
  let thisChat = await Chats.findOne({_id: req.params.id});
  let thirtyMessage = [];


  // Подгружает при загрузке страницы последние 15 страниц или меньше 15 страниц
  if(thisChat.messages.length >= 15){
    for(let i = thisChat.messages.length-15; i < thisChat.messages.length; i++){
      thirtyMessage.push(thisChat.messages[i]);
    }
  } else if(thisChat.messages.length < 15){
    for(let i = 0; i < thisChat.messages.length; i++){
      thirtyMessage.push(thisChat.messages[i]);
    }
  }

 
  

  res.render(`chat`, {
    title: `Анонимный чат`,
    name: thisChat.name,
    created: thisChat.create,
    room: thisChat._id,
    user: req.session.user.login,
    messages: thirtyMessage
  })
})

module.exports = router;