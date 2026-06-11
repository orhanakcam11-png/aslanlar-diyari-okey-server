const rooms=[{name:'Feke VIP Masa',bet:5000,players:'2/4'},{name:'Yeni Başlayanlar',bet:1000,players:'3/4'},{name:'Sarı Kırmızı Masa',bet:2000,players:'1/4'},{name:'Turnuva Masası',bet:10000,players:'2/4'}];
const messages=[['Ahmet A.','Herkese merhaba! 👋'],['Selin Y.','İyi oyunlar dilerim 😊'],['Orhan Akçam','Hoşgeldiniz arkadaşlar 🎉'],['Sistem','Keyifli oyunlar!']];
function showPage(id){document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.getElementById(id).classList.add('active')}
function renderRooms(){const list=document.getElementById('roomList');list.innerHTML='';rooms.forEach(r=>{const div=document.createElement('div');div.className='room';div.innerHTML=`<h3>${r.name}</h3><p>Bahis: ${r.bet}</p><p>Oyuncu: ${r.players}</p><button onclick="showPage('game')">KATIL</button>`;list.appendChild(div)})}
function createRoom(){rooms.unshift({name:'Orhan Akçam Masası',bet:1905,players:'1/4'});renderRooms();showPage('rooms')}
function renderChat(){const box=document.getElementById('chatBox');box.innerHTML='';messages.forEach(m=>{const div=document.createElement('div');div.className='msg';div.innerHTML=`<b>${m[0]}:</b> ${m[1]}`;box.appendChild(div)})}
function sendMsg(){const input=document.getElementById('msg');if(!input.value.trim())return;messages.push(['Orhan Akçam',input.value]);input.value='';renderChat()}
const colors=['red','blue','yellow','black'];
function dealTiles(){const area=document.getElementById('tiles');area.innerHTML='';for(let i=0;i<14;i++){const n=Math.floor(Math.random()*13)+1;const c=colors[Math.floor(Math.random()*colors.length)];const tile=document.createElement('div');tile.className='tile '+c;tile.dataset.n=n;tile.dataset.c=c;tile.innerText=n;area.appendChild(tile)}}
function sortTiles(){const area=document.getElementById('tiles');const arr=Array.from(area.children);arr.sort((a,b)=>{if(a.dataset.c===b.dataset.c)return Number(a.dataset.n)-Number(b.dataset.n);return a.dataset.c.localeCompare(b.dataset.c)});area.innerHTML='';arr.forEach(t=>area.appendChild(t))}
renderRooms();renderChat();dealTiles();
