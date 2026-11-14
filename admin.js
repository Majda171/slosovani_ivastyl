'use strict';
const $=id=>document.getElementById(id);
const KEYS=['shopUrl','discountCode','facebookPostUrl','instagramPostUrl','madlaartInstagram','madlaartFacebook'];
function saveDraft(){try{for(const id of ['girls','boys',...KEYS])localStorage.setItem('iva-admin-'+id,$(id).value)}catch{}}
function rows(str){return str.split(/\r?\n/).map(t=>t.trim()).filter(Boolean)}
function parse(){
 const lines={girls:rows($('girls').value),boys:rows($('boys').value)};
 const used=new Set();let next=1;let errors=[];const ret={girls:[],boys:[]};
 for(const group of ['girls','boys']){
  for(const line of lines[group]){
   let number='',name='';
   let explicit=line.match(/^\s*(\d{1,10})\s*[;|\t]\s*(.+)$/);
   if(explicit){number=explicit[1];name=explicit[2].trim()}
   else if(/^\d{1,10}$/.test(line)){number=line;name=''}
   else{name=line}
   if(number){if(used.has(number)){errors.push('Duplicitní číslo '+number);continue}used.add(number)}
   ret[group].push({number,name:name.slice(0,100)});
  }
 }
 for(const group of ['girls','boys']){
  for(const person of ret[group]){
   if(!person.number){while(used.has(String(next)))next++;person.number=String(next);used.add(person.number);next++}
  }
 }
 return {list:ret,errors};
}
function previewText(){const {list,errors}=parse();for(const [group,id] of [['girls','girl-count'],['boys','boy-count']])$(id).textContent=list[group].length+' osob';
  const el=$('feedback');if(errors.length){el.style.color='#b02c43';el.textContent=errors.join(' · ');return false}
  if(!list.girls.length||!list.boys.length){el.style.color='#874c62';el.textContent='Doplň soutěžící do obou skupin.';return false}
  el.style.color='#24734d';el.textContent=`Připraveno: ${list.girls.length} pro holčičku, ${list.boys.length} pro kluka. Každý má vlastní číslo.`;return true;
}
function download(name,obj){const content=JSON.stringify(obj,null,2)+'\n';const url=URL.createObjectURL(new Blob([content],{type:'application/json;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function entries(){const list=parse().list;return {drawSeed:'IVASTYL-TEST-14-11-2026-0730',...list}}
function downloadParticipants(){if(!previewText()){alert('Zkontroluj seznam soutěžících.');return}download('participants.json',entries())}
function downloadSettings(){const data={};for(const id of KEYS)data[id]=$(id).value.trim();download('settings.json',data)}
function preview(){if(!previewText()){alert('Nejprve doplň soutěžící do obou skupin.');return}localStorage.setItem('ivastyl-preview-data',JSON.stringify(entries()));window.open('index.html?demo=1&source=admin','_blank','noopener')}
async function importJSON(e){const file=e.target.files?.[0];if(!file)return;try{const obj=JSON.parse(await file.text());if(!Array.isArray(obj.girls)||!Array.isArray(obj.boys))throw Error('Chybí seznam pro holčičku/kluka');for(const group of ['girls','boys'])$(group).value=obj[group].map(x=>typeof x==='string'?x:(x.name?`${x.number}; ${x.name}`:`${x.number}`)).join('\n');saveDraft();previewText()}catch(err){alert('Soubor nelze načíst: '+err.message)}finally{e.target.value=''}}
for(const id of ['girls','boys',...KEYS]){let old=null;try{old=localStorage.getItem('iva-admin-'+id)}catch{}if(old!==null)$(id).value=old;$(id).addEventListener('input',()=>{saveDraft();previewText()})}
$('download').addEventListener('click',downloadParticipants);$('preview').addEventListener('click',preview);$('settings-download').addEventListener('click',downloadSettings);$('import').addEventListener('change',importJSON);previewText();
