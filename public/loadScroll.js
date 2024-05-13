let Space = document.querySelector(`.chat__scroll`); // Общий чатовый блок в котором блоки сообщений




let staty = document.querySelectorAll(`.chat__bottom__message`).length;
let end = false;
let chat = 10; // Количество запрашываемых чатов

Space.addEventListener("scroll", function(){ 
  let Space = document.querySelector(`.chat__scroll`); // Общий новостной блок в котором блоки статтей
  let csrf = document.querySelector(`#data`);
  csrf = csrf.dataset.csrf; // csrf токен без которого сообщения на сервер не передасться

 
  if(Space.scrollTop == 0){
    if(!end){

      end = true; // Чтоб когдаа запрос не придет то не отправлялись остальные


      fetch(`/loadM/${room}`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({staty: chat}),
        headers: {
            'X-XSRF-TOKEN': csrf,
            'content-type': 'application/json'
        }
        }).then((response)=>{
          // Разпарсиваем полученную JSON строку и передаем в следующий then
          return response.json()
        }).then((infa)=>{
         
          console.log(`Пришол ответ с сервера`)

            if(infa.end){
              end = true;
            } else {
              end = false;
              chat+=10;
            }

            for(let elem of infa.goChats){

              if(elem.name == user){ // Сообщения текущего пользователя
                Space.innerHTML = `
                  <div class="chat__bottom__message me">
                    <div class="chat__bottom__message__right">
                      <div class="chat__bottom__message__right__date">
                        ${elem.create}
                      </div>
                      <span class="chat__bottom__message__right__text">
                        ${elem.message}
                      </span>
                    </div>
                    <div class="chat__bottom__message__left">
                      <div class="chat__bottom__message__left__img-top">
                        <img src="/image/039-bandit.png" alt="">
                      </div>
                      <div class="chat__bottom__message__left__name">
                        ${elem.name}
                      </div>
                    </div>      
                  </div>                 
                ` + Space.innerHTML;
              } else { // Сообщения других пользователей
                Space.innerHTML = `
                  <div class="chat__bottom__message">
                    <div class="chat__bottom__message__left">
                      <div class="chat__bottom__message__left__img-top">
                        <img src="/image/039-bandit.png" alt="">
                      </div>
                      <div class="chat__bottom__message__left__name">
                       ${elem.name}
                      </div>
                    </div>

                    <div class="chat__bottom__message__right">
                      <div class="chat__bottom__message__right__date">
                        ${elem.create}
                      </div>
                      <span class="chat__bottom__message__right__text">
                        ${elem.message}
                      </span>
                    </div>
                  </div>                  
                ` + Space.innerHTML;
              }

            }


            let block = document.querySelector(".chat__scroll");
            block.scrollTop = 700;
        })
    }
  }

});