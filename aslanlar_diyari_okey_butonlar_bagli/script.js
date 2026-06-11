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

function enterApp(){
  const login = document.getElementById('loginScreen');
  if(login){
    login.style.opacity = '0';
    setTimeout(()=> login.style.display = 'none', 350);
  }
}

/* Giriş / kayıt / buton bağlantıları */
function hideAllAuthForms(){
  const loginMenu = document.getElementById('loginMenu');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  if(loginMenu) loginMenu.classList.add('hidden');
  if(loginForm) loginForm.classList.add('hidden');
  if(registerForm) registerForm.classList.add('hidden');
}

function showLoginMenu(){
  hideAllAuthForms();
  document.getElementById('loginMenu').classList.remove('hidden');
}

function showLoginForm(){
  hideAllAuthForms();
  document.getElementById('loginForm').classList.remove('hidden');
}

function showRegisterForm(){
  hideAllAuthForms();
  document.getElementById('registerForm').classList.remove('hidden');
}

function closeLoginScreen(){
  const login = document.getElementById('loginScreen');
  if(login){
    login.style.opacity = '0';
    setTimeout(()=> login.style.display = 'none', 350);
  }
}

function setActiveUser(name){
  localStorage.setItem('activeUserName', name);
  const topUserName = document.getElementById('topUserName');
  if(topUserName){
    topUserName.innerHTML = name + ' <span>VIP 8</span>';
  }
  const topUserStatus = document.getElementById('topUserStatus');
  if(topUserStatus){
    topUserStatus.innerText = '🟢 Çevrimiçi • 🪙 1.250.000';
  }
}

function guestLogin(){
  setActiveUser('Misafir Aslan');
  closeLoginScreen();
  if(typeof showPage === 'function') showPage('lobby');
}

function googleDemoLogin(){
  setActiveUser('Google Kullanıcısı');
  closeLoginScreen();
  if(typeof showPage === 'function') showPage('lobby');
}

function registerUser(){
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const pass = document.getElementById('registerPassword').value.trim();
  const msg = document.getElementById('registerMessage');

  if(!name || !email || !pass){
    msg.innerText = 'Lütfen tüm alanları doldurun.';
    return;
  }

  const user = {name, email, pass, coins:1250000, vip:8};
  localStorage.setItem('user_' + email, JSON.stringify(user));
  msg.innerText = 'Kayıt başarılı. Giriş yapabilirsiniz.';
  setTimeout(showLoginForm, 800);
}

function loginUser(){
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value.trim();
  const msg = document.getElementById('loginMessage');

  const saved = localStorage.getItem('user_' + email);
  if(!saved){
    msg.innerText = 'Bu e-posta ile kayıt bulunamadı.';
    return;
  }

  const user = JSON.parse(saved);
  if(user.pass !== pass){
    msg.innerText = 'Şifre hatalı.';
    return;
  }

  setActiveUser(user.name);
  closeLoginScreen();
  if(typeof showPage === 'function') showPage('lobby');
}

function enterApp(){
  guestLogin();
}

/* Sayfa açıldığında daha önce giriş yapan kullanıcı varsa adı yazılsın */
window.addEventListener('load', () => {
  const savedName = localStorage.getItem('activeUserName');
  if(savedName){
    setActiveUser(savedName);
  }
});
