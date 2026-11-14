(()=>{
 'use strict';
 function setup(){
  const modal=document.getElementById('sound-onboarding');
  const enable=document.getElementById('sound-onboarding-enable');
  const skip=document.getElementById('sound-onboarding-skip');
  if(!modal||!enable||!skip)return;
  const close=()=>{modal.hidden=true;document.body.classList.remove('has-sound-modal')};
  document.body.classList.add('has-sound-modal');
  enable.focus();
  enable.addEventListener('click',()=>{window.ivaEnableSound?.();close()});
  skip.addEventListener('click',close);
  modal.addEventListener('keydown',event=>{
   if(event.key==='Escape'){event.preventDefault();close()}
   if(event.key==='Tab'){
    if(event.shiftKey&&document.activeElement===enable){event.preventDefault();skip.focus()}
    else if(!event.shiftKey&&document.activeElement===skip){event.preventDefault();enable.focus()}
   }
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
