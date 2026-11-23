'use strict';
const $=i=>document.getElementById(i),C=$('c'),X=C.getContext('2d'),WH=800,isT='ontouchstart'in window;
let W,H,Z,S=JSON.parse(localStorage.arr3||'{"c":0,"o":0}'),st='menu',sel=Math.min(S.c,9),LVL,L,SP,E,P,B,GR,PK,RG,FX,cx=0,cy=0,TG,shake=0,T=0,M='',mt=0,la=0,ac=0,AC;
const keys={},mouse={x:0,y:0,d:0},tin={mx:0,up:0,fire:0,aim:0,on:0};
const COLS=['#f59e0b','#22c55e','#3b82f6','#ec4899','#a855f7','#ef4444'],BN=['RAZOR','VIPER','GHOST','NOVA','BLAZE','TITAN'],BC=['#94a3b8','#fb7185','#34d399','#fbbf24','#818cf8','#2dd4bf'],NB=[3,3,4,4,4,5,5,5,6,6];
const WP=[
{n:'PISTOL',d:16,r:330,s:14,sp:.03,m:12,rl:800,p:1,rc:.3,c:'#fde68a',f:520,l:14},
{n:'SMG',d:9,r:85,s:15,sp:.09,m:30,rl:1100,p:1,rc:.25,c:'#a3e635',f:300,l:16},
{n:'AK-47',d:14,r:125,s:16,sp:.05,m:30,rl:1300,p:1,rc:.4,c:'#fb923c',f:210,l:22},
{n:'SHOTGUN',d:10,r:750,s:13,sp:.16,m:6,rl:1400,p:6,rc:2.2,c:'#f87171',f:140,l:20},
{n:'SNIPER',d:75,r:1100,s:30,sp:.004,m:5,rl:1900,p:1,rc:3,c:'#60a5fa',f:900,l:28},
{n:'ROCKET',d:55,r:1000,s:9,sp:.01,m:2,rl:2000,p:1,rc:3,c:'#e879f9',f:100,l:24,ex:1}];
// name, sky, platform color, width, gravity, hazard color, builder
const LD=[
['Bermuda Outpost',['#7dd3fc','#d9f99d'],'#4d7c0f',2400,1,0,p=>{p(0,700,2400,100);for(let i=0;i<7;i++)p(180+i*300,570-i%3*95,160,14,1);p(1060,600,50,100);p(640,640,70,60);p(1650,630,60,70)}],
['Kalahari Dunes',['#fcd34d','#fed7aa'],'#b45309',2600,1,0,p=>{for(let i=0;i<9;i++){const h=700-Math.min(i,8-i)*48;p(i*290,h,290,820-h)}p(1000,430,300,14,1);p(300,470,180,14,1);p(2120,470,180,14,1);p(1260,250,140,14,1)}],
['Purgatory Bridge',['#94a3b8','#e2e8f0'],'#57534e',2800,1,'#0369a1',p=>{p(0,560,600,300);p(2200,560,600,300);p(600,585,1600,16);p(1000,320,30,265);p(1770,320,30,265);p(850,330,1100,14,1);p(650,440,130,14,1);p(2020,440,130,14,1);p(1300,460,200,14,1)}],
['Alpine Ice',['#bae6fd','#f1f5f9'],'#64748b',2600,1,0,p=>{p(0,700,2600,100,2);for(let i=0;i<4;i++)p(900+i*85,700-(i+1)*62,800-i*170,62,2);p(120,540,220,14,2);p(2260,540,220,14,2);p(380,380,180,14,1);p(2040,380,180,14,1)}],
['Crystal Cave',['#1e1b4b','#312e81'],'#4c4270',2800,1,0,p=>{p(0,0,2800,110);p(0,700,2800,100);for(let i=0;i<8;i++)p(200+i*330,110,60+i%3*30,90+i%4*45);for(let i=0;i<6;i++)p(260+i*430,540-i%2*140,220,20,1);for(let i=0;i<4;i++)p(500+i*600,640,90,60)}],
['Iron Factory',['#78716c','#d6d3d1'],'#374151',3000,1,0,p=>{p(0,700,3000,100);p(0,510,1100,18);p(1500,510,1500,18);p(500,320,1000,18);p(2000,320,1000,18);p(1480,330,22,180);p(1200,630,110,70);p(2500,430,90,80);p(300,630,90,70);p(2700,630,90,70)}],
['Sky Islands',['#a78bfa','#fbcfe8'],'#6d28d9',3000,1,'#1e1b4b',p=>{[[100,600,320],[550,500,220],[900,620,260],[1250,430,200],[1550,560,300],[1900,380,220],[2200,520,260],[2550,420,300],[1000,300,180],[1700,240,200],[2750,640,230]].map(a=>p(a[0],a[1],a[2],30))}],
['Lava Forge',['#7f1d1d','#f97316'],'#292524',2800,1,'#ea580c',p=>{for(let i=0;i<9;i++){const h=80+i*7%5*55;p(100+i*300,720-h,150,h+90)}for(let i=0;i<4;i++)p(330+i*600,520,160,12,1)}],
['Orbital Station (low-G)',['#020617','#1e3a8a'],'#475569',2800,.42,0,p=>{p(0,700,2800,100);p(1200,480,400,20);for(let s=0;s<2;s++){const m=(x,w)=>s?2800-x-w:x;[[300,560,260],[80,400,200],[560,300,240]].map(a=>p(m(a[0],a[2]),a[1],a[2],18,1));p(m(760,120),620,120,18);p(m(900,24),120,24,260)}}],
['Citadel (BOSS)',['#450a0a','#7c2d12'],'#44403c',3200,1,0,p=>{p(0,700,3200,100);for(let s=0;s<2;s++){const m=(x,w)=>s?3200-x-w:x;p(m(300,40),300,40,400);p(m(300,300),520,300,16,1);p(m(300,300),360,300,16,1);for(let i=0;i<5;i++)p(m(700+i*60,60),700-(i+1)*40,60,(i+1)*40)}p(1300,500,600,20);p(1400,320,400,20);p(1500,140,200,20);p(1300,320,30,180);p(1870,320,30,180)}]];
const save=()=>localStorage.arr3=JSON.stringify(S),ng=id=>({id,m:WP[id].m,r:id?WP[id].m*2:99}),rnd=Math.random;
function snd(f,d,t='square',v=.04){try{AC=AC||new AudioContext();const o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime;o.type=t;o.frequency.setValueAtTime(f,n);o.frequency.exponentialRampToValueAtTime(Math.max(30,f*.4),n+d);g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g);g.connect(AC.destination);o.start();o.stop(n+d)}catch(e){}}
const fx=(x,y,n,c,sp=3,l=25,s=3)=>{for(let i=0;i<n;i++)FX.push({x,y,vx:(rnd()-.5)*sp*2,vy:(rnd()-.5)*sp*2-1,l:l*(.5+rnd()),c,s})};
const msg=t=>{M=t;mt=120};
function mk(name,col,bot){return{name,col,bot,x:0,y0:0,y:0,vx:0,vy:0,hp:100,mhp:100,sc:1,al:false,rt:0,k:0,d:0,gr:0,gt:0,cy:0,u0:0,fuel:100,aim:0,dir:1,ph:0,gn:[ng(0)],gi:0,gc:2,ft:0,gt2:0,rl:0,inv:0,fl:0,jet:0,lh:null,in:{mx:0,up:0,fire:0},tt:0,tg:null,str:1,ae:0}}
const solidAt=(x,y)=>{for(const p of L)if(p.t!=1&&x>p.x&&x<p.x+p.w&&y>p.y&&y<p.y+p.h)return 1;return 0};
const los=(ax,ay,bx,by)=>{for(let i=1;i<9;i++)if(solidAt(ax+(bx-ax)*i/9,ay+(by-ay)*i/9))return 0;return 1};
const fb=(x,y,d)=>{for(const p of L)if(x>p.x&&x<p.x+p.w&&p.y>=y&&p.y<y+d)return 1;return 0};
function startLevel(n){sel=n;const d=LD[n];LVL={n:d[0],sk:d[1],c:d[2],w:d[3],g:d[4],hz:d[5],i:n};L=[];SP=[];d[6]((x,y,w,h,t=0)=>L.push({x,y,w,h,t}));
L.forEach(p=>{if(p.w>=110&&p.y>120)for(let x=p.x+70;x<p.x+p.w-50;x+=320)SP.push([x,p.y-20])});
B=[];GR=[];RG=[];FX=[];TG=8+n*2;P=mk('YOU',COLS[S.o||0],0);E=[P];
for(let i=0;i<NB[n];i++)E.push(mk(BN[i],BC[i],1));
if(n==9){const b=E[1];b.name='BOSS';b.mhp=300;b.sc=1.35}
PK=SP.filter((_,i)=>i%3==1).map(s=>({x:s[0],y:s[1]+8,tm:0,t:roll()}));
E.forEach(e=>{e.rt=0;spawn(e)});cx=P.x;cy=P.y;st='play';$('menu').classList.add('hide');$('ov').classList.add('hide');$('hud').classList.remove('hide');
if(isT){$('tl').classList.remove('hide');$('tr').classList.remove('hide')}msg(`Level ${n+1}: ${LVL.n} — first to ${TG} kills`)}
function roll(){const r=rnd();return r<.5?{k:'g',id:1+(rnd()*5|0)}:r<.75?{k:'h'}:{k:'b'}}
function spawn(e){let best=SP[0],bd=-1;for(let k=0;k<5;k++){const s=SP[rnd()*SP.length|0];let d=1e9;for(const o of E)if(o.al&&o!==e)d=Math.min(d,Math.hypot(o.x-s[0],o.y-s[1]));if(d>bd){bd=d;best=s}}
Object.assign(e,{x:best[0],y:best[1],vx:0,vy:0,hp:e.mhp,al:true,inv:120,gn:[ng(0)],gi:0,gc:2,fuel:100,rl:0,ft:0,lh:null,aim:0})}
function hurt(e,d,o,kx=0,ky=0){if(!e.al||e.inv>0)return;e.hp-=d;e.lh=o;e.fl=5;e.vx+=kx;e.vy+=ky;fx(e.x,e.y,4,'#dc2626',2,18,2);if(e.hp<=0)die(e,o)}
function die(e,o){if(!e.al)return;e.al=false;e.rt=180;e.d++;if(o&&o!==e){o.k++;msg(o.name+' ✕ '+e.name)}else msg(e.name+' fell');
[[0,-13,10,10,'#fcd9b6'],[0,-1,12,16,e.col],[-5,-4,4,12,'#fcd9b6'],[5,-4,4,12,'#fcd9b6'],[-3,12,5,13,'#1f2937'],[3,12,5,13,'#1f2937']].forEach(a=>RG.push({x:e.x+a[0]*e.sc,y:e.y+a[1]*e.sc,vx:e.vx+(rnd()-.5)*5,vy:e.vy-rnd()*5-2,a:0,va:(rnd()-.5)*.5,w:a[2]*e.sc,h:a[3]*e.sc,c:a[4],l:260}));
fx(e.x,e.y,14,'#b91c1c',4,30,3);snd(120,.3,'sawtooth',.06);shake=Math.max(shake,e===P?9:3);
if(o&&o!==e&&o.k>=TG)end(o===P)}
function end(w){st='end';if(w){S.c=Math.max(S.c,Math.min(10,sel+1));save()}
ov(w?(sel==9?'🏆 ALL LEVELS CLEARED':'BOOYAH! LEVEL CLEAR'):'LEVEL LOST',`${LVL.n} • You ${P.k} kills / ${P.d} deaths`,[...(w&&sel<9?[['Next Level ▶',()=>startLevel(sel+1)]]:[]),['↻ Retry',()=>startLevel(sel)],['☰ Menu',menu]])}
function ov(t,s,b){$('ot').textContent=t;$('os').textContent=s;$('ob').innerHTML='';b.forEach(([l,f])=>{const x=document.createElement('button');x.textContent=l;x.onclick=()=>{$('ov').classList.add('hide');f()};$('ob').append(x)});$('ov').classList.remove('hide')}
function pause(){if(st=='play'){st='pause';ov('PAUSED','',[['▶ Resume',()=>st='play'],['↻ Retry',()=>startLevel(sel)],['☰ Menu',menu]])}else if(st=='pause'){$('ov').classList.add('hide');st='play'}}
function menu(){st='menu';$('menu').classList.remove('hide');$('hud').classList.add('hide');$('ov').classList.add('hide');
$('lv').innerHTML='';LD.forEach((d,i)=>{const b=document.createElement('button');b.textContent=i>S.c?'🔒':i+1;b.className=(i>S.c?'lk ':'')+(i==sel?'on':'');b.onclick=()=>{if(i<=S.c){sel=i;menu()}};$('lv').append(b)});
$('sw').innerHTML='';COLS.forEach((c,i)=>{const b=document.createElement('i');b.style.background=c;b.className=i==(S.o||0)?'on':'';b.onclick=()=>{S.o=i;save();menu()};$('sw').append(b)});
$('info').textContent=`${sel+1}. ${LD[sel][0]} • first to ${8+sel*2} kills • ${NB[sel]} bots`}
function shoot(e){const g=e.gn[e.gi],w=WP[g.id];if(e.ft>0||e.rl>0)return;if(g.m<=0){reload(e);return}
e.ft=w.r*(e.bot?1.3:1)/16.7;g.m--;for(let i=0;i<w.p;i++){const a=e.aim+(rnd()-.5)*w.sp*2;B.push({x:e.x+Math.cos(e.aim)*20,y:e.y-4+Math.sin(e.aim)*20,vx:Math.cos(a)*w.s,vy:Math.sin(a)*w.s,d:w.d,o:e,l:w.ex?160:75,ex:w.ex,c:w.c})}
e.vx-=Math.cos(e.aim)*w.rc;e.vy-=Math.sin(e.aim)*w.rc*.5;fx(e.x+Math.cos(e.aim)*24,e.y-4+Math.sin(e.aim)*24,3,'#fde047',2,8,2);
if(e===P||Math.abs(e.x-P.x)<700)snd(w.f,.12,w.p>1?'sawtooth':'square',.05);if(g.m<=0)reload(e)}
function reload(e){const g=e.gn[e.gi],w=WP[g.id];if(e.rl>0||g.m>=w.m)return;if(g.id&&g.r<=0){if(g.m<=0){e.gn.splice(e.gi,1);if(!e.gn.length)e.gn.push(ng(0));e.gi=0}return}e.rl=w.rl/16.7}
function swap(e){if(e.gn.length>1){e.gi^=1;e.rl=0;e.ft=10}}
function nade(e){if(e.gc>0&&e.gt2<=0){e.gc--;e.gt2=40;GR.push({x:e.x,y:e.y-6,vx:Math.cos(e.aim)*9+e.vx*.5,vy:Math.sin(e.aim)*9-2+e.vy*.3,f:100,o:e})}}
function ex(x,y,r,d,o){for(const e of E)if(e.al){const dx=e.x-x,dy=e.y-y,q=Math.hypot(dx,dy);if(q<r){const k=1-q/r;hurt(e,d*k+5,o,dx/(q||1)*k*14,dy/(q||1)*k*12-4*k)}}fx(x,y,26,'#fb923c',6,30,5);fx(x,y,12,'#475569',3,45,6);shake=Math.max(shake,8);snd(80,.35,'sawtooth',.1)}
function take(e,k){const t=k.t;if(t.k=='h'){if(e.hp>=e.mhp)return;e.hp=Math.min(e.mhp,e.hp+50)}else if(t.k=='b'){if(e.gc>=5)return;e.gc=Math.min(5,e.gc+2)}else{const h=e.gn.find(g=>g.id==t.id);if(h)h.r+=WP[t.id].m*2;else if(e.gn.length<2){e.gn.push(ng(t.id));e.gi=e.gn.length-1;e.rl=0}else{e.gn[e.gi]=ng(t.id);e.rl=0}}k.tm=900;k.t=roll();if(e===P)snd(700,.12,'sine',.05)}
function move(e){const hw=9*e.sc,hh=17*e.sc;e.x+=e.vx;
for(const p of L){if(p.t==1)continue;if(e.x+hw>p.x&&e.x-hw<p.x+p.w&&e.y+hh>p.y&&e.y-hh<p.y+p.h){if(e.vx>0)e.x=p.x-hw;else if(e.vx<0)e.x=p.x+p.w+hw;e.vx=0}}
e.x=Math.max(14,Math.min(LVL.w-14,e.x));e.gr=0;const py=e.y;e.y+=e.vy;
for(const p of L){if(e.x+hw>p.x&&e.x-hw<p.x+p.w&&e.y+hh>p.y&&e.y-hh<p.y+p.h){if(e.vy>=0&&py+hh<=p.y+1){e.y=p.y-hh;e.vy=0;e.gr=1;e.gt=p.t}else if(p.t!=1&&e.vy<0){e.y=p.y+p.h+hh;e.vy=0}}}}
function pin(e){const i=e.in,t=tin;i.mx=Math.max(-1,Math.min(1,(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+t.mx));i.up=keys.w||keys[' ']||keys.arrowup||t.up?1:0;i.fire=mouse.d||t.fire||keys.j?1:0;
if(t.on)e.aim=t.aim;else if(!isT)e.aim=Math.atan2(cy+mouse.y/Z-e.y,cx+mouse.x/Z-e.x);else if(Math.abs(e.vx)>.5)e.aim=e.vx>0?0:Math.PI}
function ai(b){const i=b.in;if(--b.tt<=0){b.tt=25;let bd=1e9;b.tg=null;for(const e of E)if(e!==b&&e.al){const d=Math.hypot(e.x-b.x,e.y-b.y)*(e===P?.65:1);if(d<bd){bd=d;b.tg=e}}b.str=rnd()<.5?1:-1;b.ae=(rnd()-.5)*Math.max(.05,.5-LVL.i*.045)}
const t=b.tg;i.mx=0;i.up=0;i.fire=0;if(!t)return;
const dx=t.x-b.x,dy=t.y-b.y,d=Math.hypot(dx,dy),s=Math.sign(dx)||1;
let df=Math.atan2(dy+t.vy*d/18,dx+t.vx*d/22)+b.ae-b.aim;df=Math.atan2(Math.sin(df),Math.cos(df));b.aim+=df*.15;
i.mx=d>300?s:d<140?-s:b.str*.5;
if(b.gr&&Math.abs(b.vx)<.5&&i.mx)i.up=1;
if(dy<-60&&b.fuel>15&&Math.abs(dx)<400)i.up=1;
if(b.gr&&!fb(b.x+i.mx*34,b.y+17,140))i.up=1;
if(!b.gr&&b.vy>3&&!fb(b.x,b.y+17,220)&&b.fuel>10)i.up=1;
if(b.y>WH-60&&b.fuel>5)i.up=1;
if(d<560&&Math.abs(df)<.2&&los(b.x,b.y,t.x,t.y))i.fire=1;
if(i.fire&&d>150&&d<380&&rnd()<.004)nade(b)}
function upd(e){if(!e.al){if(--e.rt<=0)spawn(e);return}
e.bot?ai(e):pin(e);const i=e.in,gv=LVL.g;
e.jet=0;e.ft>0&&e.ft--;e.gt2>0&&e.gt2--;e.inv>0&&e.inv--;e.fl>0&&e.fl--;
e.cy=e.gr?7:e.cy-1;
e.vx+=(i.mx*(e.bot?3.3+LVL.i*.1:4.3)-e.vx)*(e.gr?(e.gt==2?.03:.22):.07);
e.vy=Math.min(e.vy+.55*gv,15);
if(i.up){if(e.cy>0&&!e.u0){e.vy=-10.5*Math.sqrt(gv);e.cy=0}else if(e.cy<=0&&e.fuel>0){e.vy=Math.max(e.vy-.55*gv-.55,-6.5);e.fuel-=.8;e.jet=1;if(T%2)fx(e.x,e.y+16*e.sc,1,'#fbbf24',1,14,3)}}
e.u0=i.up;if(e.gr)e.fuel=Math.min(100,e.fuel+1.5);else if(!e.jet)e.fuel=Math.min(100,e.fuel+.12);
move(e);if(e.gr)e.ph+=e.vx*.16;e.dir=Math.cos(e.aim)>=0?1:-1;
if(e.rl>0&&--e.rl<=0){const g=e.gn[e.gi],w=WP[g.id],n=Math.min(w.m-g.m,g.id?g.r:99);g.m+=n;if(g.id)g.r-=n}
if(i.fire)shoot(e);
for(const k of PK)if(k.tm<=0&&Math.abs(k.x-e.x)<22&&Math.abs(k.y-e.y)<28)take(e,k);
if(e.y>WH+60)die(e,e.lh)}
function step(){T++;mt>0&&mt--;shake*=.86;E.forEach(upd);PK.forEach(k=>k.tm>0&&k.tm--);
for(let k=B.length;k--;){const b=B[k];let dead=0;const n=Math.ceil(Math.hypot(b.vx,b.vy)/6);
for(let s=0;s<n&&!dead;s++){b.x+=b.vx/n;b.y+=b.vy/n;if(solidAt(b.x,b.y)){dead=1;fx(b.x,b.y,2,'#d6d3d1',2,8,2)}else for(const e of E)if(e.al&&e!==b.o&&Math.abs(b.x-e.x)<10*e.sc&&Math.abs(b.y-e.y)<18*e.sc){hurt(e,b.d*(b.y<e.y-9?1.4:1),b.o,b.vx*.08,b.vy*.05);dead=1;break}}
if(dead&&b.ex)ex(b.x,b.y,85,b.d,b.o);if(dead||--b.l<=0||b.y>WH+80||b.y<-200)B.splice(k,1)}
for(let k=GR.length;k--;){const g=GR[k];g.vy+=.4*LVL.g;g.x+=g.vx;if(solidAt(g.x,g.y)){g.x-=g.vx;g.vx*=-.5}g.y+=g.vy;if(solidAt(g.x,g.y)){g.y-=g.vy;g.vy*=-.5;g.vx*=.8}
if(--g.f<=0||g.y>WH+80){if(g.f<=0)ex(g.x,g.y,95,75,g.o);GR.splice(k,1)}}
for(let k=RG.length;k--;){const p=RG[k];p.vy+=.5*LVL.g;if(solidAt(p.x+p.vx,p.y))p.vx*=-.4;else p.x+=p.vx;if(solidAt(p.x,p.y+p.vy)){p.vy*=-.35;p.vx*=.8;p.va*=.7}else p.y+=p.vy;p.a+=p.va;if(--p.l<=0)RG.splice(k,1)}
for(let k=FX.length;k--;){const f=FX[k];f.x+=f.vx;f.y+=f.vy;f.vy+=.1;if(--f.l<=0)FX.splice(k,1)}}
function person(e){const s=e.sc,f=e.dir,w=WP[e.gn[e.gi].id];X.save();X.translate(e.x,e.y);X.scale(s,s);if(e.inv>0&&T>>2&1)X.globalAlpha=.5;
const sw=Math.sin(e.ph)*(e.gr?7:3),lf=e.gr?0:-3;X.lineCap='round';X.lineWidth=5;X.strokeStyle='#1f2937';
for(const q of[-1,1]){X.beginPath();X.moveTo(0,5);X.lineTo(q*sw,16-(e.gr&&q*Math.cos(e.ph)>0?3:0)+lf);X.stroke()}
X.fillStyle='#475569';X.fillRect(-f*10,-8,5,13);if(e.jet){X.fillStyle=T%4<2?'#fbbf24':'#f97316';X.beginPath();X.moveTo(-f*10,5);X.lineTo(-f*7.5,5+10+rnd()*8);X.lineTo(-f*5,5);X.fill()}
X.fillStyle=e.fl>0?'#fff':e.col;X.fillRect(-6,-8,12,15);
X.fillStyle='#fcd9b6';X.beginPath();X.arc(f,-14,6.5,0,7);X.fill();X.fillStyle=e.col;X.beginPath();X.arc(f,-15,7,Math.PI,0);X.fill();X.fillStyle='#111';X.fillRect(f*3.5-1,-15,2,2);
X.save();X.translate(0,-4);X.rotate(e.aim);if(f<0)X.scale(1,-1);X.strokeStyle='#fcd9b6';X.lineWidth=4;X.beginPath();X.moveTo(0,0);X.lineTo(9,0);X.stroke();X.fillStyle='#111';X.fillRect(5,-3,w.l,5);X.fillStyle=w.c;X.fillRect(5,-3,w.l*.4,2);X.restore();X.restore();
if(e!==P){X.fillStyle='#0008';X.fillRect(e.x-14,e.y-34*s,28,4);X.fillStyle='#ef4444';X.fillRect(e.x-14,e.y-34*s,28*Math.max(0,e.hp/e.mhp),4);X.fillStyle='#fff';X.font='bold 9px system-ui';X.textAlign='center';X.fillText(e.name,e.x,e.y-37*s)}
else{X.fillStyle='#fbbf24';X.beginPath();X.moveTo(e.x,e.y-38);X.lineTo(e.x-5,e.y-46);X.lineTo(e.x+5,e.y-46);X.fill()}}
function draw(){const vw=W/Z,vh=H/Z;
cx+=(Math.max(0,Math.min(LVL.w-vw,P.x+Math.cos(P.aim)*60-vw/2))-cx)*.12;cy+=(Math.max(0,Math.min(WH-vh,P.y-vh/2-20))-cy)*.12;
X.setTransform(1,0,0,1,0,0);const g=X.createLinearGradient(0,0,0,H);g.addColorStop(0,LVL.sk[0]);g.addColorStop(1,LVL.sk[1]);X.fillStyle=g;X.fillRect(0,0,W,H);
for(let l=0;l<2;l++){X.fillStyle=l?'rgba(0,0,0,.28)':'rgba(0,0,0,.15)';X.beginPath();X.moveTo(0,H);for(let x=0;x<=W;x+=20){const wx=x/Z+cx*(.15+.2*l);X.lineTo(x,H*(.6+.1*l)-(Math.sin(wx*.004+l*3)+Math.sin(wx*.011+l)+2)*H*.06)}X.lineTo(W,H);X.fill()}
X.setTransform(Z,0,0,Z,(-cx+(rnd()-.5)*shake)*Z,(-cy+(rnd()-.5)*shake)*Z);
if(LVL.hz){X.globalAlpha=.88;X.fillStyle=LVL.hz;X.fillRect(cx-50,WH-40+Math.sin(T/20)*4,vw+100,300);X.globalAlpha=1}
for(const p of L){if(p.x>cx+vw||p.x+p.w<cx)continue;X.fillStyle=p.t==2?'#bae6fd':LVL.c;X.fillRect(p.x,p.y,p.w,p.h);X.fillStyle='rgba(255,255,255,.3)';X.fillRect(p.x,p.y,p.w,p.t==1?p.h:4);X.fillStyle='rgba(0,0,0,.2)';X.fillRect(p.x,p.y+p.h-3,p.w,3)}
X.textAlign='center';for(const k of PK)if(k.tm<=0){const y=k.y-4+Math.sin(T/15+k.x)*3,t=k.t;X.fillStyle=t.k=='g'?WP[t.id].c:t.k=='h'?'#ef4444':'#334155';X.fillRect(k.x-12,y-8,24,16);X.fillStyle=t.k=='g'?'#111':'#fff';X.font='bold 8px system-ui';X.fillText(t.k=='g'?WP[t.id].n.slice(0,3):t.k=='h'?'+HP':'💣',k.x,y+3)}
for(const q of GR){X.fillStyle=q.f%10<5?'#ef4444':'#1f2937';X.beginPath();X.arc(q.x,q.y,5,0,7);X.fill()}
for(const b of B){X.strokeStyle=b.c;X.lineWidth=b.ex?4:2;X.beginPath();X.moveTo(b.x-b.vx*.7,b.y-b.vy*.7);X.lineTo(b.x,b.y);X.stroke()}
for(const p of RG){X.save();X.translate(p.x,p.y);X.rotate(p.a);X.fillStyle=p.c;X.fillRect(-p.w/2,-p.h/2,p.w,p.h);X.restore()}
for(const e of E)if(e.al)person(e);
for(const f of FX){X.globalAlpha=Math.min(1,f.l/12);X.fillStyle=f.c;X.fillRect(f.x,f.y,f.s,f.s)}X.globalAlpha=1;
if(T%5==0){const g=P.gn[P.gi];$('hp').style.width=Math.max(0,P.hp/P.mhp*100)+'%';$('jf').style.width=P.fuel+'%';$('wep').textContent=`${WP[g.id].n} ${P.rl>0?'RELOAD…':g.m+'/'+(g.id?g.r:'∞')}  💣${P.gc}`;
$('top').textContent=`🎯 ${TG} kills  |  `+[...E].sort((a,b)=>b.k-a.k).slice(0,4).map(e=>e.name+' '+e.k).join(' · ');$('msg').textContent=!P.al?'RESPAWN IN '+Math.ceil(P.rt/60):mt>0?M:''}}
function loop(t){requestAnimationFrame(loop);const dt=Math.min(50,t-la);la=t;if(st=='menu')return;if(st=='play'){ac+=dt;while(ac>=16.67){step();ac-=16.67;if(st!='play')break}}draw()}
function stick(el,f){const k=el.firstElementChild;let id=null,ox,oy;
const mv=e=>{if(e.pointerId!==id)return;let dx=e.clientX-ox,dy=e.clientY-oy;const d=Math.hypot(dx,dy),m=45;if(d>m){dx*=m/d;dy*=m/d}k.style.transform=`translate(${dx}px,${dy}px)`;f(dx/m,dy/m)};
el.onpointerdown=e=>{id=e.pointerId;el.setPointerCapture(id);const r=el.getBoundingClientRect();ox=r.left+r.width/2;oy=r.top+r.height/2;mv(e)};el.onpointermove=mv;
el.onpointerup=el.onpointercancel=e=>{if(e.pointerId===id){id=null;k.style.transform='';f(0,0)}}}
stick($('tl'),(x,y)=>{tin.mx=Math.abs(x)>.25?x:0;tin.up=y<-.45?1:0});
stick($('tr'),(x,y)=>{const m=Math.hypot(x,y);tin.on=m>.2;if(m>.2)tin.aim=Math.atan2(y,x);tin.fire=m>.6?1:0});
$('bg').onpointerdown=()=>nade(P);$('bs').onpointerdown=()=>swap(P);$('br').onpointerdown=()=>reload(P);$('pz').onclick=pause;$('go').onclick=()=>startLevel(sel);
onkeydown=e=>{const k=e.key.toLowerCase();keys[k]=1;if(k==' ')e.preventDefault();if(st=='play'&&P.al){if(k=='g'||k=='f')nade(P);if(k=='q')swap(P);if(k=='r')reload(P)}if(k=='p'||k=='escape')pause()};
onkeyup=e=>keys[e.key.toLowerCase()]=0;
onpointerdown=e=>{if(e.pointerType=='mouse')mouse.d=1};onpointerup=e=>{if(e.pointerType=='mouse')mouse.d=0};
onpointermove=e=>{if(e.pointerType=='mouse'){mouse.x=e.clientX;mouse.y=e.clientY}};oncontextmenu=e=>e.preventDefault();
function rs(){C.width=W=innerWidth;C.height=H=innerHeight;Z=H/520}onresize=rs;rs();menu();requestAnimationFrame(loop);
