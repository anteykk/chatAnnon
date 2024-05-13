// Скрипт скрола окна чата в самый низ при загрузке
window.addEventListener(`load`, ()=>{
  let block = document.querySelector(".chat__scroll");
  block.scrollTop = block.scrollHeight;
})


