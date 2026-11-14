/* Original, lightweight synthesized draw/win effects.
   Add Pixabay downloads as assets/audio/background.mp3, assets/audio/draw.mp3,
   assets/audio/fanfare.mp3 to use real sound files. Audio needs user gesture. */
(()=>{
'use strict';
let enabled=false,context=null,noiseTimer=null,lastPhase='',music=null;
const base='assets/audio/';
const soundButton=()=>document.getElementById('sound-button');
const soundLabel=()=>document.getElementById('sound-label');
function ctx(){if(!context){const C=window.AudioContext||window.webkitAudioContext;if(C)context=new C()}return context}
function tone(freq,duration=.13,when=0,type='sine',volume=.045){
 const c=ctx();if(!c)return;
 const s=c.currentTime+when,o=c.createOscillator(),gain=c.createGain();
 o.type=type;o.frequency.setValueAtTime(freq,s);
 gain.gain.setValueAtTime(.001,s);gain.gain.exponentialRampToValueAtTime(Math.max(.002,volume),s+.018);
 gain.gain.exponentialRampToValueAtTime(.001,s+duration);o.connect(gain);gain.connect(c.destination);o.start(s);o.stop(s+duration+.03)
}
function bounce(){if(!enabled)return;tone(145+Math.random()*240,.07,0,'triangle',.015);}
function fanfare(){if(!enabled)return;
 // Original quiet success chime (not a third-party melody)
 [[523,0],[659,.14],[784,.30],[1047,.48]].forEach(([f,w],i)=>tone(f,i===3?.65:.22,w,'sine',i===3?.035:.025));
}
function stopRattle(){if(noiseTimer!==null){clearInterval(noiseTimer);noiseTimer=null}}
function startRattle(){stopRattle();if(!enabled)return;bounce();noiseTimer=setInterval(bounce,140)}
function optionalEffect(file,fallback){if(!enabled)return;
 const a=new Audio(base+file);a.volume=file==='draw.mp3'?.30:.52;
 const error=()=>{a.pause();fallback?.()};
 a.addEventListener('error',error,{once:true});a.play().catch(()=>fallback?.());
}
function tryMusic(){if(!enabled)return;
 if(!music){music=new Audio(base+'background.mp3');music.loop=true;music.volume=.16;music.preload='none';music.addEventListener('error',()=>{music.pause()},{once:true})}
 music.play().catch(()=>{});
}
function toggle(){enabled=!enabled;
 const btn=soundButton();btn.setAttribute('aria-pressed',String(enabled));btn.title=enabled?'Vypnout zvuky losování':'Zapnout zvuky losování';
 soundLabel().textContent=enabled?'Vypnout zvuk':'Zapnout zvuk';
 document.getElementById('sound-icon').textContent=enabled?'♫':'♪';
 if(enabled){ctx()?.resume();tryMusic();if(document.getElementById('site-frame').classList.contains('phase-spinning'))startRattle();else tone(690,.14,0,'sine',.03)}
 else{stopRattle();music?.pause()}
}
window.ivaSoundPhase=p=>{
 if(p===lastPhase)return;lastPhase=p;
 if(p==='girlSpin'||p==='boySpin'){ if(enabled)optionalEffect('draw.mp3',startRattle); }
 else stopRattle();
 if(enabled&&(p==='girlDrop'||p==='boyDrop'))tone(760,.16,0,'triangle',.025);
 if(p==='girlWin'||p==='boyWin')optionalEffect('fanfare.mp3',fanfare);
 if(p==='final'&&enabled){tone(880,.16,0,'sine',.015);tone(1174,.42,.19,'sine',.023)}
};
window.addEventListener('DOMContentLoaded',()=>{soundButton()?.addEventListener('click',toggle)})
})();