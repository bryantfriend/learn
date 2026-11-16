import {encodeSave,decodeSave} from './coastal-expedition.js';
import {t,registerTranslations} from './coastal-i18n.js';

export const PROFILE_KEY='coastal-student-profiles-v1';
const empty=()=>({version:1,activeId:'guest',profiles:[{id:'guest',name:'Guest',journeys:{}}]});
const journeyKey=state=>(state.world??'uk')+':'+(state.mode??'normal');
export function createProfileStore(storage){
 let memory=empty(),error='',currentId=null;
 function read(){try{const raw=storage.getItem(PROFILE_KEY);if(raw){const data=JSON.parse(raw);if(data.version!==1||!Array.isArray(data.profiles)||!data.profiles.length||data.profiles.some(p=>typeof p.id!=='string'||typeof p.name!=='string'||!p.journeys||typeof p.journeys!=='object'))throw Error('Invalid profile data');memory=data;}}catch{error='Profiles could not be read. Keep this page open and try saving again.';}return structuredClone(memory);}
 function write(data){try{storage.setItem(PROFILE_KEY,JSON.stringify(data));memory=data;error='';return true;}catch{error='Progress could not be saved. Browser storage is unavailable or full.';return false;}}
 function selected(){const data=read();currentId??=data.activeId;return data.profiles.find(p=>p.id===currentId)??data.profiles[0];}
 return {
  read,selected,get error(){return error;},
  create(name){name=name.trim().replace(/\s+/g,' ');if(!name||name.length>32)throw Error('Use a name between 1 and 32 characters.');const data=read();if(data.profiles.some(p=>p.name.toLocaleLowerCase()===name.toLocaleLowerCase()))throw Error('That profile name already exists.');if(data.profiles.length>=40)throw Error('This browser already has 40 profiles.');const id=globalThis.crypto.randomUUID();data.profiles.push({id,name,journeys:{}});data.activeId=id;if(!write(data))throw Error(error);currentId=id;return id;},
  select(id){const data=read();if(!data.profiles.some(p=>p.id===id))throw Error('Profile not found.');data.activeId=id;if(!write(data))throw Error(error);currentId=id;},
  save(state){const data=read(),p=data.profiles.find(p=>p.id===(state.profileId??data.activeId));if(!p)return false;const copy=structuredClone(state);copy.running=false;copy.selected=null;p.journeys[journeyKey(copy)]={raw:encodeSave(copy),round:copy.round,credits:copy.credits,world:copy.world,mode:copy.mode,language:copy.language,updatedAt:new Date().toISOString()};return write(data);},
  load(key){const entry=selected().journeys[key];if(!entry)throw Error('No saved journey.');const state=decodeSave(entry.raw);state.profileId=selected().id;return state;},
  reset(){const id=selected().id,data=read(),p=data.profiles.find(p=>p.id===id);if(!p)return false;p.journeys={};if(!write(data))return false;try{for(let i=0;i<4;i++)storage.removeItem(p.id==='guest'?'coastal-journey-slot-'+i:'coastal-profile-'+p.id+'-slot-'+i);}catch{error='Profile reset, but an old save slot could not be removed.';}return true;}
 };
}

const entries=`
Student profiles|Профили учеников|Окуучулардын профилдери
Guest|Гость|Конок
Manage profiles|Управление профилями|Профилдерди башкаруу
Save progress|Сохранить прогресс|Прогрессти сактоо
Saved|Сохранено|Сакталды
Create profile|Создать профиль|Профиль түзүү
Student name or nickname|Имя или псевдоним ученика|Окуучунун аты же лакап аты
Your journeys|Ваши путешествия|Сиздин саякаттарыңыз
No saved journeys yet.|Пока нет сохранённых путешествий.|Азырынча сакталган саякаттар жок.
Saved journeys resume automatically. Use Reset progress to start over.|Сохранённые путешествия продолжаются автоматически. Чтобы начать заново, сбросьте прогресс.|Сакталган саякаттар автоматтык түрдө уланат. Башынан баштоо үчүн прогрессти тазалаңыз.
Resume journey|Продолжить путешествие|Саякатты улантуу
Switch profile|Сменить профиль|Профилди алмаштыруу
Reset progress|Сбросить прогресс|Прогрессти баштапкы абалга келтирүү
Yes, reset my progress|Да, сбросить мой прогресс|Ооба, прогрессимди тазалоо
Cancel|Отмена|Жокко чыгаруу
Close profiles|Закрыть профили|Профилдерди жабуу
Saved on this browser and device. Autosaves every 15 seconds and when you leave.|Сохраняется в этом браузере на этом устройстве. Автосохранение каждые 15 секунд и при выходе.|Ушул браузерде жана түзмөктө сакталат. Ар 15 секунд сайын жана чыкканда автоматтык түрдө сакталат.
This clears all journeys, routes, upgrades and geography stamps for this profile.|Все путешествия, маршруты, улучшения и географические отметки этого профиля будут удалены.|Бул профилдин бардык саякаттары, каттамдары, жакшыртуулары жана географиялык белгилери өчүрүлөт.
Progress could not be saved. Browser storage is unavailable or full.|Не удалось сохранить прогресс. Хранилище браузера недоступно или заполнено.|Прогрессти сактоо мүмкүн болгон жок. Браузердин сактагычы жеткиликсиз же толгон.
Use a name between 1 and 32 characters.|Имя должно содержать от 1 до 32 символов.|Ат 1ден 32ге чейин белгиден турушу керек.
That profile name already exists.|Такое имя профиля уже существует.|Мындай аталыштагы профиль бар.
`;
for(const row of entries.trim().split('\n')){const [en,ru,ky]=row.split('|');registerTranslations(en,ru,ky);}

export function installProfiles({node,getGame,showStart,launch}){
 let storage;try{storage=window.localStorage;}catch{storage={getItem(){throw Error();},setItem(){throw Error();},removeItem(){throw Error();}};}
 const store=createProfileStore(storage);let status=null,toolbarStatus=null,dialog=null,lastSave=0,lastStage='',resume=false;
 const button=(label,action)=>{const b=node('button',t(label));b.type='button';b.onclick=action;return b;};
 const stage=s=>[s.round,s.complete,s.failed,s.cardPhase,s.cardHistory?.length].join('|');
 function save(){const game=getGame();if(!game)return true;game.state.profileId??=store.selected().id;const ok=store.save(game.state);for(const label of [status,toolbarStatus])if(label)label.textContent=t(ok?'Saved':store.error);if(ok){lastSave=Date.now();lastStage=stage(game.state);}return ok;}
 function summary(entry){return t(entry.world==='kyrgyzstan'?'Kyrgyzstan':'United Kingdom')+' · '+t(entry.mode==='hard'?'Hard':'Normal')+' · '+t('Round')+' '+entry.round+' · '+entry.credits+' 💷';}
 function resumeJourney(key){try{if(!save())return;const state=store.load(key);resume=false;launch(state);}catch(error){status.textContent=t(error.message);}}
 function render(){const profile=store.selected();dialog.replaceChildren(button('Close profiles',()=>dialog.close()),node('span','🧭 '+t('EXPEDITION PASSPORT'),'coastal-profile-eyebrow'),node('h2',t('Student profiles')),node('p',t('Saved on this browser and device. Autosaves every 15 seconds and when you leave.')));
  const identity=node('div',null,'coastal-profile-identity');identity.append(node('span',profile.name.slice(0,2).toUpperCase(),'coastal-profile-avatar'),node('strong',profile.name==='Guest'?t('Guest'):profile.name));dialog.append(identity);
  status=node('p',store.error?t(store.error):'','coastal-profile-status');status.setAttribute('role','status');dialog.append(status);
  const switcher=node('label',t('Switch profile')),select=node('select');select.dataset.profileSelect='';select.setAttribute('aria-label',t('Switch profile'));for(const p of store.read().profiles){const option=node('option',p.name==='Guest'?t('Guest'):p.name);option.value=p.id;option.selected=p.id===profile.id;select.append(option);}select.onchange=()=>{try{if(!save()){select.value=profile.id;return;}store.select(select.value);resume=false;showStart();}catch(error){status.textContent=t(error.message);}};switcher.append(select);dialog.append(switcher);
  const form=node('form',null,'coastal-profile-create'),input=node('input');input.type='text';input.maxLength=32;input.required=true;input.placeholder=t('Student name or nickname');input.setAttribute('aria-label',t('Student name or nickname'));input.autocomplete='off';const create=button('Create profile',()=>{});create.type='submit';form.append(input,create);form.onsubmit=event=>{event.preventDefault();try{if(!save())return;store.create(input.value);resume=false;showStart();}catch(error){status.textContent=t(error.message);}};dialog.append(form,node('h3',t('Your journeys')));
  const journeys=Object.entries(profile.journeys);if(!journeys.length)dialog.append(node('p',t('No saved journeys yet.')));for(const [key,entry]of journeys){const card=node('article',null,'coastal-profile-journey'),img=node('img');img.src=entry.world==='kyrgyzstan'?new URL('../assets/coastal/kyrgyzstan/world-cover.jpg',import.meta.url).href:new URL('../assets/coastal/stations/london.jpg',import.meta.url).href;img.alt='';const details=node('div');details.append(node('strong',summary(entry)),node('small',new Date(entry.updatedAt).toLocaleString()),button('Resume journey',()=>resumeJourney(key)));card.append(img,details);dialog.append(card);}
  if(getGame())dialog.append(button('Save progress',()=>save()));const reset=button('Reset progress',()=>{const confirm=node('section',null,'coastal-profile-confirm');confirm.append(node('strong',profile.name),node('p',t('This clears all journeys, routes, upgrades and geography stamps for this profile.')),button('Cancel',()=>render()),button('Yes, reset my progress',()=>{if(!store.reset()){status.textContent=t(store.error);return;}resume=false;lastStage='';showStart({discard:true});}));reset.replaceWith(confirm);});reset.className='coastal-profile-reset';dialog.append(reset);
 }
 function attach(root,start=false){const toolbar=node('section',null,start?'coastal-profile-start':'coastal-profile-toolbar'),p=store.selected();toolbar.setAttribute('translate','no');toolbar.append(node('span','👤 '+(p.name==='Guest'?t('Guest'):p.name)),button('Manage profiles',()=>{resume=Boolean(getGame()?.state.running);if(getGame())getGame().state.running=false;render();dialog.showModal();}));if(!start)toolbar.append(button('Save progress',()=>save()));else{const recent=Object.entries(p.journeys).sort((a,b)=>b[1].updatedAt.localeCompare(a[1].updatedAt))[0];if(recent)toolbar.append(button('Resume journey',()=>resumeJourney(recent[0])),node('small',t('Saved journeys resume automatically. Use Reset progress to start over.')));}
  dialog=node('dialog',null,'coastal-shop coastal-profile-dialog');dialog.setAttribute('translate','no');dialog.setAttribute('aria-label',t('Student profiles'));const attached=dialog;attached.addEventListener('click',event=>{if(event.target!==attached)return;const r=attached.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)attached.close();});attached.addEventListener('close',()=>{const game=getGame();if(resume&&game&&!game.state.complete&&!game.state.failed)game.state.running=true;resume=false;});root.append(attached);if(start)root.prepend(toolbar);else root.querySelector('.coastal-controls')?.append(toolbar);status=node('small','','coastal-profile-status');toolbarStatus=status;status.setAttribute('role','status');toolbar.append(status);if(store.error)status.textContent=t(store.error);
 }
 function tick(){const game=getGame();if(game&&(stage(game.state)!==lastStage||Date.now()-lastSave>=15000))save();}
 const timer=setInterval(tick,1000),leaving=()=>save(),hidden=()=>{if(document.hidden)save();};window.addEventListener('pagehide',leaving);window.addEventListener('beforeunload',leaving);document.addEventListener('visibilitychange',hidden);
 return {store,attach,save,start(settings,fresh){try{const key=settings.world+':'+settings.mode,state=store.selected().journeys[key]?store.load(key):fresh();state.language=settings.language;launch(state);}catch(error){if(status)status.textContent=t(error.message);}},destroy(){save();clearInterval(timer);window.removeEventListener('pagehide',leaving);window.removeEventListener('beforeunload',leaving);document.removeEventListener('visibilitychange',hidden);}};
}
