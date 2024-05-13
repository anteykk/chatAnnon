
let go = true; // Защита от сбоев
let chat = 10; // Количество запрашываемых чатов
let space = document.querySelector(`.mini-block`); // Родительский блок всех чатов


document.querySelector(`.loading__more`).addEventListener(`click`, ()=>{
  let csrf = document.querySelector(`#data`);
  csrf = csrf.dataset.csrf; // csrf токен без которого сообщения на сервер не передасться
  
  
  
  if(go){
    go = false;
    fetch(`/load`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({chat: chat}),
      headers: {
          'X-XSRF-TOKEN': csrf,
          'content-type': 'application/json'
      }
      }).then((response)=>{
        // Разпарсиваем полученную JSON строку и передаем в следующий then
        return response.json()
      }).then((infa)=>{
        // Проверяю остались ли еще елементы в базе данных для подгрузки.
        if(infa.end){
          go = false;
          document.querySelector(`.loading__more`).style.display = `none`;
        } else {
          go = true;
          chat+=10;
        }

        console.log( infa.getUser);

        // Проверка чата на созданным текущем пользователем или нет
        function checkDEL(elem, user){
          if(elem.whocreate == user){
            return ` 
            <a href="/delete/${elem._id}" class="bottom__chat__close">
            <img src="/image/cancel.png" alt="close">
            </a>  
            `
          } else {
            return false;
          }
        }


        
        for(let elem of infa.goChats){
          space.innerHTML += `
          <div class="bottom__chat">

            
            
            ${checkDEL(elem, infa.getUser)}
 

            <a href="/chat/${elem._id}" class="bottom__chat_img">
              <img src="/image/010-ghost.png" alt="привидения">
            </a>
            <div class="bottom__chat__name">${elem.name}</div>
            <span class="bottom__chat__counter">${elem.mesSum}</span>
          </div>         
          `
        }
        
        
      })
  }


})