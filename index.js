'use strict';


//dedication varriables



const buttons = document.querySelector('.buttons');
buttons.addEventListener('click', ()=> {
  if (event.target.nodeName !== 'BUTTON') return;
  event.audio = new Audio(`./sounds/${event.target.getAttribute('file-name')}.mp3`).play();
});















// button js

const wrapperMenu = document.querySelector('.wrapper-menu');

wrapperMenu.addEventListener('click', function(){
  wrapperMenu.classList.toggle('open');  
});


const whiteBtnsArray = document.querySelectorAll('.white');
console.log(whiteBtnsArray);