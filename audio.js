/* IvaStyl · audio by supplied user MP3s. Sound plays only after visitor click. */
(()=>{
 'use strict';
 const B='assets/audio/';
 const tracks={
   background:new Audio(B+'background.mp3'),
   draw:new Audio(B+'draw.mp3'),
   fanfare:new Audio(B+'fanfare.mp3')
 };
 tracks.background.loop=true;tracks.background.volume=0.16;tracks.background.preload='auto';
 tracks.draw.loop=true;tracks.draw.volume=0.64;tracks.draw.preload='auto';
 tracks.fanfare.volume=0.75;tracks.fanfare.preload='auto';
 let enabled=false,lastPhase='';
 const play=a=>a.play().catch(()=>{});
 const stop=a=>{a.pause();a.currentTime=0};
 const phaseSpin=p=>p==='girlSpin'||p==='boySpin';
 const phaseFanfare=p=>p==='girlWin'||p==='boyWin';
 function setSound(value){
   enabled=value;
   const button=document.getElementById('sound-button');if(!button)return;
   button.setAttribute('aria-pressed',String(enabled));
   button.title=enabled?'Vypnout hudbu a zvuky':'Zapnout hudbu a zvuky';
   document.getElementById('sound-label').textContent=enabled?'Vypnout zvuk':'Zapnout zvuk';
   document.getElementById('sound-icon').textContent=enabled?'♫':'♪';
   if(!enabled){Object.values(tracks).forEach(stop);return}
   play(tracks.background);
   if(phaseSpin(lastPhase))play(tracks.draw);
 }
 window.ivaSoundPhase=p=>{
   if(p===lastPhase)return;lastPhase=p;
   if(!enabled)return;
   if(phaseSpin(p)){
     stop(tracks.fanfare);
     tracks.background.volume=0.085;
     tracks.draw.currentTime=0;play(tracks.draw);
   }else{
     stop(tracks.draw);tracks.background.volume=0.16;
   }
   if(phaseFanfare(p)){
     tracks.fanfare.currentTime=0;
     play(tracks.fanfare);
   }
   if(p==='final'){stop(tracks.draw);tracks.background.volume=0.12}
 };
 document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('sound-button')?.addEventListener('click',()=>setSound(!enabled));
  document.addEventListener('visibilitychange',()=>{
   if(document.hidden){for(const a of Object.values(tracks))a.pause()}
   else if(enabled){play(tracks.background);if(phaseSpin(lastPhase))play(tracks.draw)}
  });
 });
})();
