'use strict';



//export
import {anime} from './scripts/anime.js';


//dedication variables


//variables 4 MUSIC
const buttons = document.querySelector('.buttons');
const mainMenu = document.querySelector('.main-menu');
const wrapperMenu = document.querySelector('.wrapper-menu');
const searchInput = document.querySelector('.search-input');
const modalWindow = document.querySelector('.modal-window');
const body = document.querySelector('body');
const header = document.querySelector('header');
const volumeInput = document.querySelector('.volume-input');
let volume = localStorage.getItem('volume') ? localStorage.getItem('volume') : 0.8;




// variables ANIMATION

const headerShowAnimation = anime({
  targets: '.site-header',
  height: 100 + 'vh',
  loop: true,
  direction: 'alternate',
  easing: 'easeInOutCirc',
  autoplay: false,
  changeBegin: function(anim) {
    wrapperMenu.style.pointerEvents = 'none';
    if (wrapperMenu.classList.contains('open')) {
       setTimeout(()=> {mainMenu.classList.replace('main-menu__close', 'main-menu__open')}, 1000);
       if (document.querySelector('header').offsetWidth < 1200) buttons.style.display = 'none'
       else buttons.style.display = 'flex'
    }
    else {
      mainMenu.classList.replace('main-menu__open', 'main-menu__close');
      if (document.querySelector('header').offsetWidth < 1200) setTimeout(()=>
      {
        buttons.style.display = 'flex';
      },1000)
      else buttons.style.display = 'flex';
    }
  },
  changeComplete: function(anim) {
    wrapperMenu.style.pointerEvents = 'unset';
    anim.pause();
  }
});


//volume-change
volumeInput.value = volume * 100
volumeInput.addEventListener('change', ()=> {
  volume = volumeInput.value / 100;
  localStorage.setItem('volume', volume);
})



//playing sounds


buttons.addEventListener('mousedown', ()=> {
  if (event.target.nodeName !== 'BUTTON') return;
  event.audio = new Audio(`./sounds/${event.target.getAttribute('file-name')}.mp3`)
  event.audio.volume = volume;
  event.audio.play();
});









// button js


  wrapperMenu.addEventListener('click', function(){
  wrapperMenu.classList.toggle('open'); 
  headerShowAnimation.play(); 
});




//music list builder
const liArray = document.querySelectorAll('.main-menu__item')
searchInput.addEventListener('input', ()=> {
  let value = searchInput.value.trim().toLowerCase();
    [...liArray].forEach(element => {
      if(element.textContent.toLowerCase().search(value) !== -1) {
           element.style.display = 'block';
      }
      else element.style.display = 'none';
    });

});

//modal window
document.querySelector('.bg-change-btn').addEventListener('click', () => modalWindow.style.display = 'flex');
const changeBg = function(imgUrl) {
  if (!imgUrl) return
  header.style.setProperty('--bg-img', `url(${imgUrl})`);
  body.style.backgroundImage = `url(${imgUrl})`;
}
modalWindow.addEventListener('click', ()=> {
  if(event.target === modalWindow) modalWindow.style.display = 'none';
  if(event.target.nodeName !== 'LI') return;
  const imgPath = event.target.getAttribute('full-size');
  localStorage.setItem('bgImage', imgPath);
  changeBg(imgPath);
  modalWindow.style.display = 'none';
});
changeBg(localStorage.getItem('bgImage'));



const keysObj = new Object();
const buttonsArray = [...buttons.querySelectorAll('button')];
console.log(buttonsArray)
buttonsArray.forEach(el => {
  el.isPlaying = false
  keysObj[el.getAttribute('key')] = el;

})

window.addEventListener('keypress', ()=> {
  const button = keysObj[event.key]
  if (button.isPlaying) return
  button.isPlaying = true
  //change style
  event.audio = new Audio(`./sounds/${button.getAttribute('file-name')}.mp3`)
  event.audio.volume = volume;
  event.audio.play();
}) 

window.addEventListener('keyup', ()=>{
  const button = keysObj[event.key]
  //change style
  button.isPlaying = false
})

