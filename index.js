'use strict';



//export
import {anime} from './scripts/anime.js';
// import { SoundManager, soundManager } from './scripts/soundmanager2.js';



//dedication variables


//variables 4 MUSIC
window.n = 'n';
window.s = 's';
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
const svgBox = document.querySelector('.svg-ready-box');
const loadingScreen = document.querySelector('.loading-screen')
let nowPlaying = false;
let movingSpeed = 11;
let noteContainersObj;
let globalNotes;
let curentNoteIndex = 0;
let previousNote;
let soundsIsLoaded = false;
let dynamicMode = true;
let audioMode = 'Stable';
audioMode = localStorage.getItem('mode');
if(header.offsetWidth < 1000) {
  audioMode = 'Not stable';
}
console.log(header.offsetWidth)
window.CaMd = function(mode) {
  if(mode.toLowerCase() === 'n') {
    audioMode = 'Not stable';
  }
  else {
    audioMode = 'Stable';
  }
  localStorage.setItem('mode', audioMode);
  console.log('%c' + 'Режим успешно изменён', 'font-site: 30px; color: white; padding: 20px; background: rgba(20, 139, 36, 0.726);')
};


//load sound-manager

//preload audio

const buzzAudioFiles = new Object()
const loadAudio = function () {
  if(soundsIsLoaded) return
  soundsIsLoaded = true;
  pianoTextAnimation.play();
  hideLoadingScreen.play()
  buttonsArray.forEach(el => {
    buzzAudioFiles[el.getAttribute('file-name')] = new buzz.sound(`./sounds/optimised/${el.getAttribute('file-name')}.mp3`,
     {webAudioApi: true, preload: true});
  });
  console.log(buzzAudioFiles);
  
}


  const audioArray = new Array();
buttonsArray.forEach(el => {
  const audio = new Audio();
  audio.src = `./sounds/${el.getAttribute('file-name')}.mp3`;
  audioArray.push(audio);
});





  // const audio = new Audio();
  // audio.src = `./sounds/${el.getAttribute('file-name')}.mp3`;
//  new buzz.sound(`./sounds/${el.getAttribute('file-name')}.mp3`);

// soundManager.setup({
//   useFastPolling: true,
//   useHighPerformance: true,
//   onready: function() {
//     buttonsArray.forEach(el => {
//       soundManager.createSound({
//         id: el.getAttribute('file-name'),
//         url: `./sounds/${el.getAttribute('file-name')}.mp3`
//       })
//     });
//     }});
// buttonsArray.forEach(el => {
//   soundManager.createSound({
//     id: el.getAttribute('file-name'),
//     url: `./sounds/${el.getAttribute('file-name')}.mp3`
//   })
// });

// console.log(audioArray);


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

const readyTextDrawingAnimation = anime({
  targets: '.svg-ready-box path',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutSine',
  duration: 1500,
  delay: 500,
  direction: 'alternate',
  autoplay: false,
  changeComplete: function (anim) {
    setTimeout(()=> svgBox.style.display = 'none', 1500)
    
  }
});

const pianoTextAnimation = anime({
  targets: '.piano-text-svg-box svg path',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutSine',
  duration: 1500,
  delay: 1000,
  direction: 'alternate',
  changeComplete: function(anim) {
    pianoTextAnimation.pause()
    setTimeout(() => {
    const pathArray = document.querySelector('.piano-text-svg-box').querySelectorAll('path')
    pathArray.forEach(el => {
      el.style.fillOpacity = 1
    })
  }, 500);
  }
});

const hideLoadingScreen = anime({
  targets: '.loading-screen',
  easing: 'linear',
  opacity: 0,
  duration: 1000,
  autoplay: false,
  changeComplete: function(anim) {
    setTimeout(()=> loadingScreen.style.display = 'none', 500);
  }
})

loadingScreen.addEventListener('click', loadAudio);



//volume-change
volumeInput.value = volume * 100
volumeInput.addEventListener('change', ()=> {
  volume = +volumeInput.value;
  localStorage.setItem('volume', volume);
})

//mobile playing
const keysObj = new Object();
const fileNamesObj = new Object();
console.log(buttonsArray)
buttonsArray.forEach(el => {
  el.isPlaying = false
  keysObj[el.getAttribute('key')] = el;
  fileNamesObj[el.getAttribute('file-name')] = el;
});

const mobilePlaying = function (button) {
  console.log(button.getAttribute('file-name'));
  console.log(globalNotes)
  console.log(globalNotes[curentNoteIndex][0]);
  if(button.getAttribute('file-name') !== globalNotes[curentNoteIndex][0]) return;
  const curentNote = globalNotes[++curentNoteIndex];
  previousNote.classList.remove('playing-note');
  if(curentNote) {
  const nextPlayingNote = fileNamesObj[curentNote[0]];
  nextPlayingNote.classList.add('playing-note');
  previousNote = nextPlayingNote;
  }
  else {nowPlaying = false; return};
  
  
  
}

//playing sounds


buttons.addEventListener('mousedown', ()=> {
  if (event.target.nodeName !== 'BUTTON') return;
  // soundManager.play(event.target.getAttribute('file-name', {volume: volume}));
  
  if (audioMode === 'Not stable') {
  if (dynamicMode) {
    event.audio = new buzz.sound(`./sounds/optimised/${event.target.getAttribute('file-name')}.mp3` , {webAudioApi: true}).setVolume(volume).play()
  }
  else {
  const audio = buzzAudioFiles[event.target.getAttribute('file-name')].setVolume(volume);
  if(!audio.isPaused()) {
    audio.stop()
    audio.play()
  }
  else {
    audio.play()
  }
  }
  }
  else {
    event.audio = new Audio(`./sounds/${event.target.getAttribute('file-name')}.mp3`)
    event.audio.volume = volume/100;
    event.audio.play();
  }
  // console.log(event.target.getAttribute('file-name'));
  
  // const sound = buzzAudioFiles[event.target.getAttribute('file-name')];
  // sound.setVolume(volume)
  // sound.audio.play();


  if (nowPlaying && header.offsetWidth < 1200) {
    mobilePlaying(event.target)
  }
});









// button js


  wrapperMenu.addEventListener('click', function(){
    if (wrapperMenu.classList.contains('open')) volume = +localStorage.getItem('volume')
    else volume = 0;
  wrapperMenu.classList.toggle('open'); 
  headerShowAnimation.play(); 
});




//music list builder
const liArray = document.querySelectorAll('.main-menu__item')
searchInput.addEventListener('input', ()=> {
  if(searchInput.value === 'CaMd(n)') {
    window.CaMd('n');
  }
  if(searchInput.value === 'CaMd(n)') {
    window.CaMd('s');
  }
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





window.addEventListener('keydown', ()=> {
  if(!soundsIsLoaded) return loadAudio();
  const button = keysObj[event.code];
  if (!button || button.isPlaying) return;
  button.isPlaying = true;
  //change style
  button.classList.contains('white') ? button.classList.toggle('white-click') : button.classList.toggle("black-click");

  if (audioMode === 'Not stable') {


  

  // const sound = buzzAudioFiles[button.getAttribute('file-name')];
  // sound.setVolume(volume)
  // sound.audio.play();
  if (dynamicMode) {
    event.audio = new buzz.sound(`./sounds/optimised/${button.getAttribute('file-name')}.mp3` , {webAudioApi: true}).setVolume(volume).play()
  }
  else {
  const audio = buzzAudioFiles[event.target.getAttribute('file-name')].setVolume(volume);
  if(!audio.isPaused()) {
    audio.stop()
    audio.play()
  }
  else {
    audio.play() 
  }
  }
  // soundManager.play(button.getAttribute('file-name', {volume: volume}));


  }
  else {
    event.audio = new Audio(`./sounds/${button.getAttribute('file-name')}.mp3`)
  event.audio.volume = volume/100;
  event.audio.play();
  }

  if(nowPlaying && header.offsetWidth < 1200) {
    mobilePlaying(button)
  }
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



const startPlayingAnim = function(bottomValue) {
  const slideNotesAnimation = anime({
    targets: '.notes',
    autoplay: false,
    translateY: bottomValue + 20 + 'px',
    duration: bottomValue*movingSpeed,
    easing: 'linear',
    changeComplete: function(anim) {
      nowPlaying = false;
      document.querySelector('.buttons').classList.remove('buttons-playing');
      const notesContainer = document.querySelector('.notes');
      console.log(notesContainer)
      document.querySelector('.note-box').classList.add('note-box__hiden')
      notesContainer.style.transform = 'unset';
      [...notesContainer.querySelectorAll('.notes-column')].forEach(el => {el.textContent = ' ';});
    }
  });
  wrapperMenu.addEventListener('click', ()=> {
    if(wrapperMenu.classList.contains('open')) slideNotesAnimation.pause();
    else setTimeout(() => {
      slideNotesAnimation.play();
    }, 3200);
  });
  svgBox.style.display = 'block';
  readyTextDrawingAnimation.play();
  //##############################################################
  //##############################################################

  //##############################################################

  //##############################################################

  //##############################################################

  //##############################################################

  //##############################################################

  setTimeout(() => {
    slideNotesAnimation.play();
  }, 3200);

  // const move = setInterval(()=> {
  //   movingBox.style.transform = `translateY(${axisY += 1}px)`;
  //   console.log(bottomValue, axisY)
  //   if(bottomValue < axisY)  clearInterval(move);
  // },40);
};




const notesGenerator = function(notesArray) {
  const noteContainersObj = createNoteObject();
  console.log(noteContainersObj);
  
  let bottomInterval = 100;
  notesArray.forEach(el => {
    let elHeight = 85;
    if (el[1]) elHeight = +el[1];
    const div = document.createElement('div');
    if(el[0] !== 'empty') noteContainersObj[el[0]].append(div);
    div.style.height = elHeight + 'px';
    div.style.bottom = `${bottomInterval}px`;
    if(el[2] !== 'empty') { div.classList.add('note-block');
    const keyText = document.createElement('p');
    keyText.textContent = noteContainersObj[el[0]].getAttribute('keyboard-key');
    keyText.classList.add('key-text');
    div.append(keyText);
  }
    if(el[2] !== 'tgth') bottomInterval+= elHeight;
  });
  document.querySelector('.notes').style.height = bottomInterval + 'px';
  startPlayingAnim (bottomInterval);
};

const songsObjs = {
  '1':'w1,100|w2|w3|w4|w5|w6|w7|w8|w9|w10|w11|w12|w13|w14|w15|b1',
  '2':'w1|w1|w2|w2|w3|w5|w3|w1|w1|w1|w2|w4|w3|w1|w1|w1|w2|w2|w3|w5|w3|w1|w6|w2|w4|w3|w1|w5|w6|w7|w7|w5|w5|w6|w7|w5|w4|w3|w4|w5|w6|w7|w6|w2|w4|w3|w1',
  '3':'b3,90|b5,90|b4,90|b2,90|w1,40,empty|b3,90|b5,90|b4,90|b2,90|b1,70|b5,70|b4,50|b2,50|b3,50|w1,80,empty|b5,80|b4,50|b2,50|b1,50|w1,80,empty|b5,80|b4,50|b2,50|b3,50|w1,80,empty|b5,80|b4,50|b2,50|b1,50|w1,80,empty|b5,80|b1,50|b2,50|b3,50|b5,70|b4,60|b2,90|b3,60|b1,60',
  '4':'w4|w5|w6|w1|w4|w6|w6|w5|w4|w5|w4|w3|w4|w4|w4|w4|w4|w3|w2|w3|w4|w3|w2|w1|w1|w1|w2|w2|w2|w2|w2|w1|w1|w1|w5|w4|w4|w6|w6|w6|b5|w4|w4|w6|w5|w1|w1|w1|w1|w1|w2|w1|w1|w4|w4|w4|w6|w6|w6|w6|w4|w4|w6|w6|w5|w4|w4|w4|w4|w4|w4|w4|w4|w1|w1|w6|w4|w4|b5|b5|b5|b5|w4|w4|w5|w1|w1|w1|w1|w1|w2|w1|w1|w1|w1|w1|w4|w4|w4|w4|w2|w1|w1|w1|w1|w2|w2|w2|w2|w1|w1|w5|w4|w6|w6|b5|w4|w4|w6|w5|w4|w5|w6|w1|w4|w6|w6|w5|w4|w5|w4|w3|w4|w4|w4|w2|w2|w2|w2|w2|w1|w1|w1|w5|w4|w1|w6|w6|w6|b5|w4|w4|w6|w5|w4|w5|w6|w1|w4|w6|w6|w5|w4|w5|w4|w3|w4|w4|w4|w4|w4|w3|w4|w3|w4|w3|w2|w1|w1|w1|w2',
  '5':'w7,80|w6,80|b4,80|w3,80|b3,80|b3,80|w7,80|w6,80|b4,50|b4,50|b4,50|w7,80|w6,80|b4,80w6,50|b4,50|w6,50|b4,50|w6,50|w7,80|w6,80|b4,80|b4,80|b4,80|w7,80|w6,50|b4,50|w6,50|b4,50|w6,50|b4,50|w6,50|w6,50|b4,50',
  '6':'w9|w9|w9|b8|w10|w9|w10|b8|w9|w9|b8|w13|w14|w14|w13|b8|b8|w9|w10|w9|w10|b8|w9|w1,70,empty|w9|w14|w13|b8|b8|w9|w10|w9|w10|w14|w13|b8|b8|w13|w14|w1,70,empty|w14|w13|b8|b8|w9|w10|w9|w10|b8|w9|w1,70,empty|w9',
  '7':'w1|w1|w2|w1|w4|w3|w1,50|w1,50|w2|w1|w5|w4|w1,50|w1,50|w6|w4|w3|w2|b5|b5|w6|w4|w5|w4|w1,70,empty|w1,50|w1,50|w2|w1|w4|w3|w1,70,empty|w1|w1|w2|w1|w5|w4|w1,50|w1,50|w6|w4|w3|w2|b5|b5|w6|w4|w5|w4|w1,70,empty',
  '8':'w1,70,70,empty|w4,70|w4,70|b1,70|w1,70|w1,70|w1,70|w1,70|w4,70|b1,70|w4,70|b1,70|w1,70|w1,70|w1,70|b1,70|w1,70|w4,70|w4,70|b1,70|w1,70|w1,70|w1,70|w1,70|w1,70,empty|w4,70|b1,70|w4,70|b1,70|w1,70|w1,70|w1,70|b1,70|w1,70',
  '9':'w5,60|w1,60|b2,60|w4,60|w5,60|w1,60|b2,60|w4,60|w2,60|w4,60|b2,60|w2,60|w4,60|w1,70,empty|b2,60|w2,60|w1,60|w1,70,empty|w5,60|w1,60|b2,60|w4,60|w5,60|w1,60|b2,60|w4,60|w2,60|w1,70,empty|w4,60|w1,70,empty|w2,60|b2,60|w2,60',
  '10':'w6|b5|b5|w6|w6|w5|w6|b5|b5|w6|w6|w5|w1|w4|w4|w3|w4|w1|w2|w4|w4|w6|w5|w4|w5|w3|w5|w6|w5|w4|w5|w6|w2|w1|w2|w4|w5|w1|w4|w4|w3|w4|w2|w4|w4|w6|w5|w4|w5|w3|w5|w6|w5|w4|w5|w6|w2|b5|w6|w5|w4|w1|w1|w4|w4|w5|w6|b5|b5|w6|w6|w4|w4|w4|w6|w5|w4|w5|w1|w4|w4|w3|w4|w1|w2|w4|w4|w6|w5|w4|w5|w6|b5|w4|w6|w5|w4|w1|w1|w1|w1|w4|w3|w4|w6|w5|w6|b5|w5|w6|w5|w6|w5|w3|w4|w5|w2|w5|w6|w5|w3|w4|b5|b5|w5|b4|b5|w4|w4|b4|b5|w6|w1|w4|w4|w3|w4|w1|w2|w4|w4|w6|w5|w4|w5|w5|w3|w5|w6|w5|w4|w6|w6|w2|w1|w2|w4|w5|w6|b5|w4|w4|w5|w6',
  '11':'w3|w4|w6|w5|w5|w5|w5|w6|w6|w6|b5|b5|b5|w6|b5|w6|w5|w6|w4|w6|w4|w2|w4|w3|w2|w3|w2|b1|w2|w5|w5|w5|w5|w4|w3|w4|w4|w4|w4|w3|w2|w3|w3|w3|w3|w4|w5|w6|w5|w5|w5|w5|w4|w3|w4|w4|w4|w4|w3|w2|w3|w3|w3|w4|w4|w4|w3|w2|w2|w2|w2|w3|w4|w6|w5|w5|w5|w5|w6|w6|w6|b5|b5|b5|w6|b5|w6|w5|w6|w4|w6|w4|w2|w4|w3|w2|w3|w2|b1|w2|w2'
}
const parseNotes = function(string) {
  const notes = string.split('|');
  return notes.map(el => el.split(','))
}
const startNotes = function(noteString) {
  volume = localStorage.getItem('volume');
  console.log('VOLUME ' + volume)
  console.log(1);
  const notes = parseNotes(noteString);
  console.log(notes);
      wrapperMenu.classList.remove('open');
      headerShowAnimation.play();
  if (header.offsetWidth < 1200) {
    noteContainersObj = null;
    globalNotes = null;
    curentNoteIndex = 0;
    noteContainersObj = createNoteObject();
    nowPlaying = true;
    globalNotes = notes;
    for (let i = 0; i < globalNotes.length; i++) {
      if(globalNotes[i][2] === 'empty') {
        console.log('splice')
        globalNotes.splice(i,1)
      }
      
    }
    const curentNote = globalNotes[curentNoteIndex];
    const nextPlayingNote = fileNamesObj[curentNote[0]];
    nextPlayingNote.classList.add('playing-note');
    previousNote = nextPlayingNote;
  }
  else {
      nowPlaying = true;
      buttons.classList.add('buttons-playing');
      document.querySelector('.note-box').classList.remove('note-box__hiden');
      notesGenerator(notes);
   }
  }

mainMenuList.addEventListener('click', ()=> {
  if(event.target.nodeName !== 'LI' || nowPlaying) return;
  const songName = event.target.getAttribute('music-name');
  const notes = songsObjs[songName];
  if(notes) startNotes(notes);
});


