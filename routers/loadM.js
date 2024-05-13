let {Router} = require(`express`);
let pSession = require(`../middleware/session`);
let Chats = require(`../models/chats`);

let router = Router();




//! Подгрузка чатов на главную страницу
router.post(`/:id`, pSession, async(req,res)=>{

  

  let num = req.body.staty;
  let searchChat = await Chats.findById(req.params.id);
  let mesChat = searchChat.messages;
  let goChats = [];






  // Если число четное
  if(mesChat.length == num + 10 || mesChat.length > num + 10){
    let remainer = mesChat.length - (num + 10) - 1; 

    for(let i = mesChat.length - ((num + 10)-9); i > remainer; i--){
      goChats.push(mesChat[i])
    }

    
    res.send(JSON.stringify({goChats, getUser: req.session.user._id.toString()}));
  } else { // Число нечетное
    // Переменная показивает количество подгружаемых елементов
    let remainder = 10 - ((num + 10) - mesChat.length); 
    
    for(let i = mesChat.length - (mesChat.length - remainder) - 1; i >= 0; i--){
      goChats.push(mesChat[i]);
    }

    res.send(JSON.stringify({goChats, end: true, getUser: req.session.user._id.toString()}));
  }




 
})

module.exports = router;