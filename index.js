'use strict';



//export
import {anime} from './scripts/anime.js';


//dedication variables


//variables 4 MUSIC
const buttons = document.querySelector('.buttons');
const mainMenu = document.querySelector('.main-menu');
const wrapperMenu = document.querySelector('.wrapper-menu');




// variables ANIMATION

const headerShowAnimation = anime({
  targets: '.site-header',
  height: 100 + 'vh',
  loop: true,
  direction: 'alternate',
  easing: 'easeInOutCirc',
  autoplay: false,
  changeComplete: function(anim) {
    anim.pause();
  }
});








//playing sounds


buttons.addEventListener('click', ()=> {
  if (event.target.nodeName !== 'BUTTON') return;
  event.audio = new Audio(`./sounds/${event.target.getAttribute('file-name')}.mp3`).play();
});









// button js


  wrapperMenu.addEventListener('click', function(){
  wrapperMenu.classList.toggle('open'); 
  headerShowAnimation.play(); 
  wrapperMenu.classList.contains('open') ? mainMenu.classList.replace('main-menu__close', 'main-menu__open') :
  mainMenu.classList.replace('main-menu__open', 'main-menu__close'); 
});

