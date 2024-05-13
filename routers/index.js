let {Router} = require(`express`);
let pSession = require(`../middleware/session`);
let Chats = require(`../models/chats`);


let router = Router();

router.get(`/`,pSession, async (req,res)=>{
  let chat = await Chats.find({});
  let seeChat = []; // Новые чаты
  let topFive = []; // Топ 5 чатов
  


  // 10 чатов загружаються в блок
  for(let i = chat.length; i > chat.length - 11; i--){
    seeChat.push(chat[i]);
  }






    topChat();

    // Функция ищущая самый большой по сообщениям первый чат и добавляет в массив его
    function topChat(){

      

      let newChat = [...chat];
      let numMus = [];
      let countTop = 0;


        // Из всех чатов засовываю текущие количество сообщений в массив
        // чтоб удобно было использовать для Math.max
        for(let elem of newChat){
          numMus.push(elem.mesSum);
        }

        
   
        countTop = Math.max(...numMus);
        // Удаляем елемент самый большый из массива
        // чтоб потом опять спомощю Math.max найти самый большый елемент новый
        numMus.splice(numMus.indexOf(countTop), 1);

        addElem(newChat, countTop);

        countTop = Math.max(...numMus);
        numMus.splice(numMus.indexOf(countTop), 1);

        addElem(newChat, countTop);

        countTop = Math.max(...numMus);
        numMus.splice(numMus.indexOf(countTop), 1);

        addElem(newChat, countTop);

        countTop = Math.max(...numMus);
        numMus.splice(numMus.indexOf(countTop), 1);

        addElem(newChat, countTop);  
        
        countTop = Math.max(...numMus);
        numMus.splice(numMus.indexOf(countTop), 1);

        addElem(newChat, countTop);         

    }

    // Функция для уже добавления определенного елемента в массив ТОП-5 елементов.
    // А именно добавляет текущий самый большой елемент из массива numMus
    function addElem(newChat, countTop){
      for(let elem of newChat){
  
        if(elem.mesSum == countTop){
          topFive.push(elem);
          return;
        }
        
      }
    }
 


  res.render(`index`, {
    title: `Главная страница`,
    name: req.session.user.login,
    numChat: req.session.user.NumChat,
    seeChat: seeChat,
    userId: req.session.accept ? req.session.user._id.toString() : null,
    topFive: topFive
  })
})

module.exports = router;