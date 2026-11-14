'use strict';
// Ostré losování: středa 18.11.2026 18:00 Europe/Prague (CET = UTC+1)
const DRAW_AT=Date.parse('2026-11-18T17:00:00Z');
const DEMO=new URLSearchParams(location.search).get('demo')==='1';
const $=id=>document.getElementById(id);
const root=$('site-frame');
const TWO=n=>String(n).padStart(2,'0');
let roster={girls:[],boys:[],drawSeed:'IVASTYL-18-11-2026-ZAMKNOUT-PRED-SOUTEZI'};
let winners={girls:null,boys:null};
let settings={};
let loaded=false,valid=false,phase='',currentGroup='girls';
let demoStart=null;
let balls=[],lastFrame=0,rafId=0;
const DEMO_ROSTER={girls:[{number:'1',name:'Jana'},{number:'2',name:'Terezka'},{number:'3',name:'Markéta'},{number:'4',name:'Aneta'},{number:'5',name:'Petra'},{number:'6',name:'Anna'},{number:'7',name:'Klára'},{number:'8',name:'Magda'},{number:'9',name:'Eva'}],boys:[{number:'10',name:'Tomáš'},{number:'11',name:'Filip'},{number:'12',name:'Adámek'},{number:'13',name:'Matěj'},{number:'14',name:'Martin'},{number:'15',name:'Pavel'},{number:'16',name:'Vojta'},{number:'17',name:'Daniel'}],drawSeed:'POUZE-DEMO-IVASTYL'};

const safeText=(x,max=120)=>String(x??'').trim().slice(0,max);
function normalizeEntries(list){
  if(!Array.isArray(list))return [];
  const seen=new Set();
  return list.map(item=>typeof item==='string'||typeof item==='number'?{number:safeText(item),name:''}:{number:safeText(item?.number??item?.id),name:safeText(item?.name??item?.nickname)}).filter(e=>/^\d{1,10}$/.test(e.number)).filter(e=>{if(seen.has(e.number))return false;seen.add(e.number);return true}).sort((a,b)=>Number(a.number)-Number(b.number));
}
async function getJSON(path){const r=await fetch(path+'?v='+Date.now(),{cache:'no-store'});if(!r.ok)throw Error('Soubor '+path+' není dostupný');return r.json()}
async function loadData(){
  try{
    const raw=DEMO?(function(){try{if(new URLSearchParams(location.search).get('source')==='admin')return JSON.parse(localStorage.getItem('ivastyl-preview-data'))||DEMO_ROSTER}catch{}return DEMO_ROSTER})():await getJSON('data/participants.json');
    roster={girls:normalizeEntries(raw.girls),boys:normalizeEntries(raw.boys),drawSeed:safeText(raw.drawSeed,180)||'IVASTYL-2026'};
    const allNumbers=[...roster.girls,...roster.boys].map(e=>e.number);
    valid=roster.girls.length>0&&roster.boys.length>0&&new Set(allNumbers).size===allNumbers.length;
    if(!valid){$('data-alert').hidden=false;$('data-alert').textContent='Čekáme na doplnění soutěžních čísel a jmen. Přidávají se přes správu soutěže.'}
    else{$('data-alert').hidden=true;await computeWinners()}
    loaded=true;
    $('participants-line').textContent=roster.girls.length+roster.boys.length?`V losování: ${roster.girls.length} čísel pro holčičku · ${roster.boys.length} čísel pro kluka`:'Losování ze všech platných soutěžních čísel';
    buildBalls('girls');
  }catch(err){loaded=true;valid=false;console.error(err);$('data-alert').hidden=false;$('data-alert').textContent='Nepodařilo se načíst soutěžní čísla. Zkontroluj soubor data/participants.json.'}
}
async function digestIndex(text,total){
  if(crypto?.subtle){
    const hash=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)));
    const num=hash.slice(0,8).reduce((acc,b)=>(acc*256n+BigInt(b)),0n);
    return Number(num%BigInt(total));
  }
  // older browsers: consistent fallback; not secure random
  let h=2166136261;for(const ch of text){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
  return (h>>>0)%total;
}
async function computeWinners(){
  for(const group of ['girls','boys']){
    const items=roster[group];
    const fingerprint=items.map(e=>e.number+'|'+e.name).join(';;');
    const idx=await digestIndex(roster.drawSeed+'::'+group+'::'+fingerprint,items.length);
    winners[group]=items[idx];
  }
}
function buildBalls(group){
  currentGroup=group;
  const container=$('balls-chamber');container.replaceChildren();balls=[];
  const all=roster[group];
  const maxVisible=35;
  const visible=all.length<=maxVisible?all:[...all].sort((a,b)=>a.number.localeCompare(b.number,'cs',{numeric:true})).filter((_,i)=>i%Math.ceil(all.length/maxVisible)===0).slice(0,maxVisible);
  // The displayed balls are a visual subset when needed, but the actual selection is from all entries.
  if(valid&&winners[group]&&!visible.some(x=>x.number===winners[group].number))visible[visible.length-1]=winners[group];
  const entries=visible.length?visible:Array.from({length:11},(_,i)=>({number:String(i+1)}));
  for(let i=0;i<entries.length;i++){
    const el=document.createElement('span');el.className='ball';el.textContent=entries[i].number;el.title='Číslo '+entries[i].number;
    container.appendChild(el);
    const angle=i*2.399963;const radius=Math.sqrt((i+.5)/entries.length)*.73;
    balls.push({el,x:Math.cos(angle)*radius,y:Math.sin(angle)*radius,vx:(Math.random()-.5)*.15,vy:(Math.random()-.5)*.15,seed:Math.random()*100});
  }
}
function animateBalls(ts){
  if(!lastFrame)lastFrame=ts;
  const dt=Math.min((ts-lastFrame)/1000,.05);lastFrame=ts;
  const spinning=root.classList.contains('phase-spinning');
  const chamber=$('balls-chamber');const w=chamber.clientWidth,h=chamber.clientHeight;
  if(w>0&&h>0){
    const ballSize=balls[0]?.el.offsetWidth||31;
    const radius=Math.min(w,h)/2-ballSize/2-5;
    const intensity=spinning?1:.20;
    balls.forEach((b,i)=>{
      const ax=(-b.y*.8+(Math.sin(ts*.002+i*.87)*.4))*intensity;
      const ay=(b.x*.8+(Math.cos(ts*.0024+i*1.3)*.4))*intensity;
      b.vx+=ax*dt;b.vy+=ay*dt;
      const limit=spinning?1.45:.32;
      const v=Math.hypot(b.vx,b.vy)||1;if(v>limit){b.vx=b.vx/v*limit;b.vy=b.vy/v*limit}
      b.x+=b.vx*dt;b.y+=b.vy*dt;
      let r=Math.hypot(b.x,b.y);
      if(r>.88){const nx=b.x/r,ny=b.y/r;b.x=nx*.87;b.y=ny*.87;const dot=b.vx*nx+b.vy*ny;b.vx-=1.8*dot*nx;b.vy-=1.8*dot*ny}
      const xp=w/2-ballSize/2+b.x*radius;const yp=h/2-ballSize/2+b.y*radius;
      b.el.style.transform=`translate3d(${xp.toFixed(1)}px,${yp.toFixed(1)}px,0) rotate(${(ts*.02*(spinning?1:.14)+i*31)%360}deg)`;
    });
  }
  rafId=requestAnimationFrame(animateBalls);
}
function currentElapsed(){if(DEMO){return demoStart===null ? -Math.max(60000,DRAW_AT-Date.now()) : Date.now()-demoStart;}return Date.now()-DRAW_AT}
function phaseFromElapsed(ms){if(ms<0)return 'waiting';if(ms<1600)return 'girlIntro';if(ms<8500)return 'girlSpin';if(ms<10200)return 'girlDrop';if(ms<15200)return 'girlWin';if(ms<17200)return 'boyIntro';if(ms<23900)return 'boySpin';if(ms<25600)return 'boyDrop';if(ms<30800)return 'boyWin';return 'final'}
function announcement(str){$('announcement-text').textContent=str}
function phaseChange(p){
  if(window.ivaSoundPhase) window.ivaSoundPhase(p);
  phase=p;
  root.classList.remove('phase-girl','phase-boy','phase-spinning','phase-ball-out','phase-winner','phase-final');
  $('winner-panel').hidden=true;$('final-panel').hidden=true;$('picked-ball').style.opacity='';
  const group=p.startsWith('boy')?'boys':'girls';
  root.classList.add(group==='boys'?'phase-boy':'phase-girl');
  if(group!==currentGroup)buildBalls(group);
  if(p==='waiting'){
    $('countdown').hidden=false;
    $('stage-subline').hidden=false;
    announcement('Losování začne 18. 11. 2026 v 18:00');
    $('stage-subline').textContent='✳  LOSOVÁNÍ SE SPUSTÍ AUTOMATICKY 18. 11. V 18:00  ✳';
  }else{
    $('countdown').hidden=true;
    switch(p){
    case 'girlIntro':announcement('Právě začíná losování setu pro holčičku!');break;
    case 'girlSpin':announcement('Losujeme výherní číslo pro holčičku…');root.classList.add('phase-spinning');break;
    case 'girlDrop':announcement('A výherní číslo pro holčičku je…');root.classList.add('phase-ball-out');$('picked-number').textContent=winners.girls?.number||'—';break;
    case 'girlWin':displayWinner('girls');break;
    case 'boyIntro':announcement('Za okamžik losujeme set pro kluka!');break;
    case 'boySpin':announcement('Losujeme výherní číslo pro kluka…');root.classList.add('phase-spinning');break;
    case 'boyDrop':announcement('A výherní číslo pro kluka je…');root.classList.add('phase-ball-out');$('picked-number').textContent=winners.boys?.number||'—';break;
    case 'boyWin':displayWinner('boys');break;
    case 'final':displayFinal();break;
    }
  }
}
function displayWinner(group){
  const e=winners[group];if(!e)return;
  root.classList.add('phase-winner');
  const girl=group==='girls';
  announcement(girl?'Máme výherkyni setu pro holčičku!':'Máme výherce setu pro kluka!');
  $('winner-panel').hidden=false;
  $('winner-kicker').textContent=girl?'VÝHERNÍ ČÍSLO PRO HOLČIČKU':'VÝHERNÍ ČÍSLO PRO KLUKA';
  $('winner-num').textContent=e.number;
  $('winner-name').textContent=e.name||'Výherní číslo '+e.number;
  $('winner-message').textContent=girl?'Srdečně gratulujeme výherkyni!':'Srdečně gratulujeme výherci!';
}
function displayFinal(){
  root.classList.add('phase-final');announcement('Losování je u konce. Děkujeme vám!');
  $('final-panel').hidden=false;
  for(const [g,slug] of [['girls','girl'],['boys','boy']]){
    $('final-'+slug+'-name').textContent=winners[g]?.name||'Výherní číslo '+winners[g]?.number;
    $('final-'+slug+'-num').textContent=winners[g]?.number||'—';
  }
  $('stage-subline').hidden=true;
}
let finalCountdownShown='';
function syncFinalCountdown(remainingMs){
  const overlay=$('final-count-overlay'),num=$('final-count-num');
  if(!overlay||!num)return;
  const sec=Math.ceil(remainingMs/1000);
  // Never obscure the sound prompt. Last three seconds before automatic draw only.
  const show=remainingMs>0&&remainingMs<=3000&&!DEMO&&valid;
  overlay.hidden=!show;
  if(show&&String(sec)!==finalCountdownShown){
    finalCountdownShown=String(sec);num.textContent=String(sec);
    num.style.animation='none';void num.offsetWidth;num.style.animation='';
  }
  if(!show)finalCountdownShown='';
}
function updateClock(){
  // Always update the full days/hours/minutes/seconds countdown, even while roster data loads.
  const ms=currentElapsed();
  syncFinalCountdown(-ms);
  if(ms<0){$('countdown').hidden=false;updateCountdown(-ms);}
  if(!loaded)return;
  const newPhase=phaseFromElapsed(ms);
  if(!valid){
    $('data-alert').hidden=false;
    if(newPhase==='waiting')phase='';
    if(ms>=0){announcement('Losování čeká na doplnění soutěžících');$('countdown').hidden=true;}
    else{$('countdown').hidden=false;updateCountdown(-ms);}
    return;
  }
  if(newPhase!==phase)phaseChange(newPhase);
  if(newPhase==='waiting')updateCountdown(-ms);
}
function updateCountdown(ms){
  const n=Math.max(0,Math.ceil(ms/1000));
  $('dd').textContent=TWO(Math.floor(n/86400));
  $('hh').textContent=TWO(Math.floor(n%86400/3600));
  $('mm').textContent=TWO(Math.floor(n%3600/60));
  $('ss').textContent=TWO(n%60);
}
function validLink(url,sites){
  try{const u=new URL(url);return u.protocol==='https:'&&sites.some(s=>u.hostname===s||u.hostname.endsWith('.'+s))?u.href:null}catch{return null}
}
async function loadSettings(){
  try{settings=await getJSON('data/settings.json')}catch(err){console.warn(err);settings={}}
  if(settings.discountCode)$('discount-code').textContent=safeText(settings.discountCode,35);
  const shop=validLink(settings.shopUrl,['ivastyl.cz']);if(shop){$('final-shop').href=shop;document.querySelector('.brand').href=shop}
  for(const [field,id,domains] of [
    ['facebookPostUrl','facebook-post-link',['facebook.com','fb.com']],
    ['instagramPostUrl','instagram-post-link',['instagram.com']],
    ['madlaartInstagram','madla-instagram',['instagram.com']],
    ['madlaartFacebook','madla-facebook',['facebook.com','fb.com']]
  ]){
    const u=validLink(settings[field],domains);if(u){$(id).href=u;$(id).hidden=false}
  }
  
}
async function copyValue(text,button,done){
  try{await navigator.clipboard.writeText(text);button.dataset.prev=button.textContent;button.textContent=done;setTimeout(()=>button.textContent=button.dataset.prev||'Kopírovat',1800)}
  catch{window.prompt('Zkopíruj text:',text)}
}
function setupInteractions(){
  $('copy-code').addEventListener('click',()=>copyValue($('discount-code').textContent,$('copy-code'),'✓'));
  if(DEMO){
    $('demo-controls').hidden=false;
    $('demo-play').addEventListener('click',()=>{demoStart=Date.now();phase='';updateClock()});
    $('demo-restart').addEventListener('click',()=>{demoStart=Date.now();phase='';updateClock()});
    $('stage-subline').textContent='UKÁZKOVÝ REŽIM – výherci jsou pouze testovací';
  }
}
async function init(){
  // Show all four countdown units from the very first render, not only just before the drawing.
  $('countdown').hidden=false;
  updateCountdown(Math.max(0,DRAW_AT-Date.now()));
  setupInteractions();
  await Promise.all([loadData(),loadSettings()]);
  if(DEMO)announcement('Ukázkový režim: pro opakování klikni na Přehrát losování.');
  updateClock();
  setInterval(updateClock,200);
  // A frozen roster is required before draw. Reload it once shortly before start.
  if(!DEMO){setInterval(async()=>{
    const remaining=DRAW_AT-Date.now();
    if(remaining>1000&&remaining<120000&&remaining>0){await loadData();phase='';updateClock()}
  },45000)}
  rafId=requestAnimationFrame(animateBalls);
}
init();
