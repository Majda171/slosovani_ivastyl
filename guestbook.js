/* IvaStyl – public congratulations via Supabase REST (requires user project).
   In ?demo=1 mode, local draft testing only in this browser. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const form=$('guestbook-form'), status=$('guestbook-status'), posts=$('guestbook-posts');
 if(!form)return;
 const demo=new URLSearchParams(location.search).get('demo')==='1';
 const demoKey='ivastyl-test-guestbook-v1';
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 let endpoint='',apiKey='',busy=false,lastSubmit=0;
 const note=(s,type='')=>{status.textContent=s;status.dataset.type=type};
 function render(rows){
   posts.replaceChildren();$('guestbook-count').textContent=rows.length+' KOMENTÁŘŮ';
   if(!rows.length){const p=document.createElement('p');p.className='guestbook-empty';p.textContent='Zatím žádná gratulace. Buď první!';posts.appendChild(p);return}
   for(const row of rows){
     const article=document.createElement('article');article.className='guestbook-entry';
     const head=document.createElement('div');head.className='guestbook-entry-head';
     const name=document.createElement('strong');name.textContent=String(row.nickname||'Návštěvník').slice(0,55);
     const date=document.createElement('time');const dt=new Date(row.created_at);
     date.textContent=Number.isFinite(+dt)?new Intl.DateTimeFormat('cs-CZ',{day:'numeric',month:'numeric',hour:'2-digit',minute:'2-digit'}).format(dt):'';
     const message=document.createElement('p');message.textContent=String(row.message||'').slice(0,500);
     head.append(name,date);article.append(head,message);posts.append(article);
   }
 }
 function demoList(){try{return JSON.parse(localStorage.getItem(demoKey)||'[]')}catch{return []}}
 function urlOk(raw){try{const url=new URL(raw);if(url.protocol!=='https:'||!/^[a-z0-9-]+\.supabase\.co$/i.test(url.hostname))return '';return url.origin+'/rest/v1/ivastyl_comments'}catch{return ''}}
 async function api(path,opt={}){
   const resp=await fetch(endpoint+path,{...opt,headers:{'apikey':apiKey,...(apiKey.startsWith('sb_publishable_')?{}:{'Authorization':'Bearer '+apiKey}),'Content-Type':'application/json',...(opt.headers||{})},cache:'no-store'});
   if(!resp.ok){throw Error('Odeslání/načtení se nezdařilo ('+resp.status+').')}
   if(resp.status===204)return null;
   const text=await resp.text();return text?JSON.parse(text):null;
 }
 async function refresh(){
  if(demo){render(demoList());return}
  if(!endpoint)return;
  try{const rows=await api('?select=id,nickname,message,created_at&order=created_at.desc&limit=60');render(rows||[]);}
  catch(err){note('Komentáře se nyní nepodařilo načíst. Zkus stránku obnovit.','error');}
 }
 async function init(){
  if(demo){note('TEST: komentáře v ukázce vidíš pouze v tomto prohlížeči.','demo');render(demoList());return}
  try{
   const resp=await fetch('data/settings.json?v='+Date.now(),{cache:'no-store'});
   if(!resp.ok)throw Error('Nastavení není dostupné');
   const conf=await resp.json();endpoint=urlOk(String(conf.supabaseUrl||''));apiKey=String(conf.supabaseAnonKey||'').trim();
   if(!endpoint||!apiKey){
     note('Veřejné komentáře zatím čekají na připojení databáze. Správce musí doplnit Supabase.','disabled');
     $('guestbook-submit').disabled=true;$('guestbook-submit').title='Komentáře zatím nejsou aktivní';
     posts.innerHTML='<p class="guestbook-empty">Komentáře se zpřístupní po dokončení nastavení.</p>';return;
   }
   await refresh();setInterval(()=>{if(!document.hidden)refresh()},20000);
  }catch(err){note('Nelze načíst nastavení komentářů.','error');$('guestbook-submit').disabled=true}
 }
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(busy)return;
  const name=$('guestbook-name').value.trim(),message=$('guestbook-message').value.trim();
  if($('guestbook-trap').value)return;
  if(name.length<2||name.length>55||message.length<2||message.length>500){note('Zkontroluj jméno a délku vzkazu.','error');return}
  if(Date.now()-lastSubmit<12000){note('Mezi komentáři nech alespoň 12 sekund.','error');return}
  busy=true;lastSubmit=Date.now();$('guestbook-submit').disabled=true;note('Odesílám komentář…');
  try{
   if(demo){const rows=demoList();rows.unshift({id:String(Date.now()),nickname:name,message,created_at:new Date().toISOString()});localStorage.setItem(demoKey,JSON.stringify(rows.slice(0,60)));}
   else{await api('',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({nickname:name,message})})}
   $('guestbook-message').value='';note(demo?'Komentář uložen jen v tomto prohlížeči (test).':'Komentář byl zveřejněn. Děkujeme!','success');await refresh();
  }catch(err){note('Nepodařilo se komentář uložit. '+err.message,'error')}
  finally{busy=false;$('guestbook-submit').disabled=false}
 });
 init();
})();
