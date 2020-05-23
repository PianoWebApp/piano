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
const buttonsArray = [...buttons.querySelectorAll('button')];
const mainMenuList = document.querySelector('.main-menu__list')
let volume = localStorage.getItem('volume') ? localStorage.getItem('volume') : 0.8;
const notesBox = document.querySelector('.notes');




//preload audio

const audioArray = new Array();
buttonsArray.forEach(el => {
  const audio = new Audio();
  audio.src = `./sounds/${el.getAttribute('file-name')}.mp3`;
  audioArray.push(audio);
})
console.log(audioArray);


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
console.log(buttonsArray)
buttonsArray.forEach(el => {
  el.isPlaying = false
  keysObj[el.getAttribute('key')] = el;

})

window.addEventListener('keydown', ()=> {
  const button = keysObj[event.code];
  if (!button || button.isPlaying) return;
  button.isPlaying = true;
  //change style
  button.classList.contains('white') ? button.classList.toggle('white-click') : button.classList.toggle("black-click");


  event.audio = new Audio(`./sounds/${button.getAttribute('file-name')}.mp3`)
  event.audio.volume = volume;
  event.audio.play();
});

window.addEventListener('keyup', ()=>{
  const button = keysObj[event.code];
  if(!button) return;
  //change style
  button.classList.contains('white') ? button.classList.toggle('white-click') : button.classList.toggle("black-click");



  button.isPlaying = false;
});




//LET THIS PLAY


let playMode = false;


const createNoteObject = function () {
  const noteContainers = new Object();
  [...notesBox.querySelectorAll('.notes-column')].forEach(el => {
  noteContainers[el.getAttribute('container-name')] = el;
  })
  console.log(noteContainers);
  return noteContainers;
}




//GENERATE NOTES ON CONTAINER ############################################################
let nowPlaying = false;


const startPlayingAnim = function(bottomValue) {
  const movingBox = document.querySelector('.notes');
  let axisY = 0;
  const move = setInterval(()=> {
    movingBox.style.transform = `translateY(${axisY += 1}px)`;
    console.log(bottomValue, axisY)
    if(bottomValue < axisY)  clearInterval(move);
  },40);
}




const notesGenerator = function(notesArray) {
  const noteContainersObj = createNoteObject();
  console.log(noteContainersObj);
  
  let bottomInterval = 100;
  notesArray.forEach(el => {
    let elHeight = 100;
    if (el[2]) elHeight = +el[2];
    const div = document.createElement('div');
    noteContainersObj[el[0]].append(div);
    div.style.height = elHeight + 'px';
    div.style.bottom = `${bottomInterval}px`;
    div.classList.add('note-block');
    const keyText = document.createElement('p');
    keyText.textContent = noteContainersObj[el[0]].getAttribute('keyboard-key');
    div.append(keyText);
    if(el[2] !== 'tgth') bottomInterval+= elHeight;
  });
  document.querySelector('.notes').style.height = bottomInterval + 'px';
  startPlayingAnim (bottomInterval);
};

const songsObjs = {
  '1':'w1,100|w2|w3|w4|w5|w6|w7|w8|w9|w10|w11|w12|w13|w14|w15',
}
const parseNotes = function(string) {
  const notes = string.split('|');
  return notes.map(el => el.split(','))
}
const startNotes = function(noteString) {
  console.log(1);
  // const notes
  const notes = parseNotes(noteString);
  console.log(notes);
      wrapperMenu.classList.remove('open');
      headerShowAnimation.play();
  if (header.offsetWidth < 1200) {
    console.log(12)
  }
  else {
      buttons.classList.add('buttons-playing');
      document.querySelector('.note-box').classList.remove('note-box__hiden');
      notesGenerator(notes);
   }
  }

mainMenuList.addEventListener('click', ()=> {
  if(event.target.nodeName !== 'LI') return;
  const songName = event.target.getAttribute('music-name');
  const notes = songsObjs[songName];
  if(notes) startNotes(notes);
});
