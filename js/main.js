const $=id=>document.getElementById(id), KEY="master_arcade_player";
let player=localStorage.getItem(KEY)||"";
if(player){$("register").style.display="none";$("app").style.display="block";$("player").textContent=player}
$("enter").onclick=()=>{let n=$("name").value.trim();if(!n){$("err").textContent="لطفاً اسم را وارد کنید";return}player=n;localStorage.setItem(KEY,n);$("register").style.display="none";$("app").style.display="block";$("player").textContent=n};
const titles={chess:"♟️ شطرنج",ttt:"⭕❌ دوز",ludo:"🎲 منچ",memory:"🧠 بازی حافظه",math:"🧮 چالش ریاضی",snake:"🐍 مار"};
document.querySelectorAll(".card").forEach(c=>c.onclick=()=>openGame(c.dataset.game));
$("back").onclick=()=>{$("gameArea").style.display="none"};
function openGame(g){$("gameArea").style.display="block";$("gameTitle").textContent=titles[g];let x=$("gameContent");if(g==="ttt")ttt(x);else if(g==="chess")chess(x);else if(g==="ludo")ludo(x);else if(g==="memory")memory(x);else if(g==="math")math(x);else if(g==="truth")truth(x);else snake(x)}

function ttt(x){
 x.innerHTML='<div class="msg" id="tm">نوبت ❌</div><div class="board">'+Array(9).fill('<button class="cell"></button>').join('')+'</div><button class="back" id="tr">بازی دوباره</button>';
 let a=Array(9).fill(""),t="❌",cells=x.querySelectorAll(".cell"),wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],over=false;
 function reset(){a.fill("");t="❌";over=false;cells.forEach(c=>c.textContent="");$("tm").textContent="نوبت ❌"}
 cells.forEach((c,i)=>c.onclick=()=>{if(over||a[i])return;a[i]=t;c.textContent=t;let w=wins.find(w=>w.every(k=>a[k]===t));if(w){$("tm").textContent=t+" برنده شد 🎉";over=true;return}if(a.every(Boolean)){$("tm").textContent="مساوی 🤝";over=true;return}t=t==="❌"?"⭕":"❌";$("tm").textContent="نوبت "+t});
 x.querySelector("#tr").onclick=reset;
}

function chess(x){
 let board=[
 ["♜","♞","♝","♛","♚","♝","♞","♜"],
 ["♟","♟","♟","♟","♟","♟","♟","♟"],
 ["","","","","","","",""],["","","","","","","",""],
 ["","","","","","","",""],["","","","","","","",""],
 ["♙","♙","♙","♙","♙","♙","♙","♙"],
 ["♖","♘","♗","♕","♔","♗","♘","♖"]
 ];
 let selected=null,turn="white",info="";
 x.innerHTML='<div class="msg" id="cm">نوبت سفید — مهره را انتخاب کن</div><div class="chessboard" id="cb"></div><button class="back" id="cr">شروع دوباره</button>';
 const cb=x.querySelector("#cb"), cm=x.querySelector("#cm");
 function colorOf(p){if(!p)return null;return "♙♖♘♗♕♔".includes(p)?"white":"black"}
 function render(){
   cb.innerHTML="";
   for(let r=0;r<8;r++)for(let c=0;c<8;c++){
     const s=document.createElement("button");s.className="sq "+((r+c)%2?"dark":"light");s.innerHTML=board[r][c]||"";
     s.style.cursor="pointer";s.onclick=()=>click(r,c);cb.appendChild(s);
   }
 }
 function click(r,c){
   const p=board[r][c];
   if(selected){
     const [sr,sc]=selected;
     if(sr===r&&sc===c){selected=null;cm.textContent="نوبت "+(turn==="white"?"سفید":"سیاه")+" — مهره را انتخاب کن";return}
     if(p&&colorOf(p)===turn){selected=[r,c];cm.textContent="مهره انتخاب شد؛ خانه مقصد را بزن";return}
     board[r][c]=board[sr][sc];board[sr][sc]="";selected=null;
     turn=turn==="white"?"black":"white";cm.textContent="نوبت "+(turn==="white"?"سفید":"سیاه")+" — مهره را انتخاب کن";render();
   }else if(p&&colorOf(p)===turn){selected=[r,c];cm.textContent="مهره انتخاب شد؛ خانه مقصد را بزن"}
 }
 x.querySelector("#cr").onclick=()=>chess(x); render();
}

function ludo(x){
 x.innerHTML='<div class="msg" id="lm">نوبت 🔴 — برای حرکت تاس بنداز</div><div id="ludoBoard" style="width:min(330px,100%);height:330px;margin:16px auto;position:relative;border-radius:22px;background:linear-gradient(90deg,#321b25 0 33%,#182e22 33% 66%,#182338 66%);border:3px solid #50658d;overflow:hidden"><div style="position:absolute;inset:34%;background:#111a29;border:2px solid #d7bd68;transform:rotate(45deg)"></div><div id="lr" style="position:absolute;left:12%;bottom:13%;font-size:31px">🔴</div><div id="lg" style="position:absolute;left:42%;top:12%;font-size:31px">🟢</div><div id="lb" style="position:absolute;right:12%;top:13%;font-size:31px">🔵</div><div id="ly" style="position:absolute;right:12%;bottom:13%;font-size:31px">🟡</div></div><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="back" id="ld">🎲 انداختن تاس</button><button class="back" id="lrst">🔄 دوباره</button></div>';
 let turn=0, pos=[0,0,0,0], colors=["🔴","🟢","🔵","🟡"], ids=["lr","lg","lb","ly"],names=["قرمز","سبز","آبی","زرد"];
 const board=x.querySelector("#ludoBoard");
 function render(){
   let spots=[
    [[12,13],[22,20],[32,27],[42,34],[52,41],[62,48],[72,55]],
    [[42,12],[42,20],[42,28],[42,36],[42,44],[42,52],[42,60]],
    [[67,13],[62,20],[57,27],[52,34],[47,41],[42,48],[37,55]],
    [[67,78],[62,70],[57,62],[52,54],[47,46],[42,38],[37,30]]
   ];
   colors.forEach((_,i)=>{let e=x.querySelector("#"+ids[i]),s=spots[i][Math.min(pos[i],spots[i].length-1)];e.style.left=s[0]+"%";e.style.top=s[1]+"%";e.style.bottom="auto";e.style.right="auto"});
 }
 x.querySelector("#ld").onclick=()=>{
   let d=Math.floor(Math.random()*6)+1;
   pos[turn]=Math.min(6,pos[turn]+d);
   render();
   if(pos[turn]>=6){$("lm").textContent="🏆 "+names[turn]+" به پایان رسید!";pos[turn]=0}
   else $("lm").textContent="تاس "+d+" — نوبت "+names[(turn+1)%4];
   turn=(turn+1)%4;
 };
 x.querySelector("#lrst").onclick=()=>{turn=0;pos=[0,0,0,0];$("lm").textContent="نوبت 🔴 — برای حرکت تاس بنداز";render()};
 render();
}
function memory(x){
 const emojis=["🍎","🍌","🍇","🍉","⭐","🔥","🎯","🚀"];
 let cards=[...emojis,...emojis].sort(()=>Math.random()-.5),open=[],matched=0;
 x.innerHTML='<div class="msg" id="mm">جفت‌ها را پیدا کن</div><div class="board" id="mb" style="grid-template-columns:repeat(4,64px)"></div>';
 const mb=x.querySelector("#mb");
 cards.forEach(v=>{let c=document.createElement("button");c.className="cell";c.dataset.v=v;c.textContent="❓";mb.appendChild(c);c.onclick=()=>{
   if(c.textContent!=="❓"||open.length===2)return;
   c.textContent=v;open.push(c);
   if(open.length===2){
     if(open[0].dataset.v===open[1].dataset.v){matched+=2;open.forEach(z=>z.disabled=true);open=[];if(matched===cards.length)$("mm").textContent="🏆 همه جفت‌ها پیدا شدند!"}
     else{let pair=open;setTimeout(()=>{pair.forEach(z=>z.textContent="❓");open=[]},700)}
   }
 }});
}

function math(x){
 function newQ(){let a=Math.floor(Math.random()*20)+1,b=Math.floor(Math.random()*20)+1;answer=a+b;x.querySelector("#mq").textContent=`${a} + ${b} = ؟`}
 let answer=0;
 x.innerHTML='<div class="mathbox" id="mq"></div><input id="ma" inputmode="numeric" placeholder="جواب" style="padding:12px;width:100%;margin:10px 0;border-radius:10px;border:1px solid #40577f;background:#111827;color:white"><button class="back" id="mc">بررسی</button><div class="msg" id="mt"></div>';
 x.querySelector("#mc").onclick=()=>{if(Number(x.querySelector("#ma").value)===answer){x.querySelector("#mt").textContent="✅ درست! سوال بعدی";x.querySelector("#ma").value="";newQ()}else x.querySelector("#mt").textContent="❌ دوباره تلاش کن"};
 newQ();
}

function truth(x){
 const qs=[
 "🦕1. تا حالا کسی را از عمد نادیده گرفتی؟",
 "🦕2. به کسی حسادت می‌کنی؟",
 "🦕3. موی فر یا لخت؟",
 "🦕4. قد کوتاه یا بلند؟",
 "🦕5. تیشرت یا پیراهن؟",
 "🦕6. عجیب‌ترین چیزی که در گوگل جست‌وجو کردی چیست؟",
 "🦕7. اینترنت یا دوستات؟",
 "🦕8. اگر فقط یک غذا تا آخر عمر بخوری، چی انتخاب می‌کنی؟",
 "🦕9. چند تا زبان بلدی؟",
 "🦕10. سگ یا گربه؟",
 "🦕11. یکی از آرزوهای بچگیت چی بود؟",
 "🦕12. خودت را در چند جمله توصیف کن.",
 "🦕13. نظرت درباره پاریس چیست؟",
 "🦕14. یکی از خاطرات بامزه‌ات را تعریف کن.",
 "🦕15. یکی از خوبی‌هات چیست؟",
 "🦕16. یکی از بدی‌هات چیست؟",
 "🦕17. لقبت چیست؟",
 "🦕18. چرندترین لقبی که بهت داده‌اند چی بوده؟",
 "🦕19. تا حالا دروغ گفتی؟",
 "🦕20. به خرافات باور داری؟",
 "🦕21. استعداد پنهانت چیست؟",
 "🦕22. آخرین چیزی که باعث خنده‌ات شد چی بود؟",
 "🦕23. از کدام حیوان می‌ترسی؟",
 "🦕24. فیلم ترسناک مورد علاقه‌ات چیست؟",
 "🦕25. بزرگ‌ترین ترس دوران کودکی‌ات چه بود؟",
 "🦕26. یکی از ترس‌های اجتماعی‌ات چیست؟",
 "🦕27. چه چیزی باعث خجالتت می‌شود؟",
 "🦕28. در چه کاری خوب نیستی؟",
 "🦕29. عجیب‌ترین عادتت چیست؟",
 "🦕30. بهترین معلمی که داشتی چه کسی بود؟",
 "🦕31. دوست داری به کدام کشور سفر کنی؟",
 "🦕32. اگر یک قدرت جادویی داشتی، چی انتخاب می‌کردی؟",
 "🦕33. بازی مورد علاقه‌ات چیست؟",
 "🦕34. بهترین خاطره‌ات با دوستات چیست؟",
 "🦕35. اگر یک روز نامرئی بودی چه کار بی‌خطری می‌کردی؟",
 "🦕36. دوست داری چه مهارتی یاد بگیری؟",
 "🦕37. چه چیزی سریع خوشحالت می‌کند؟",
 "🦕38. چه چیزی خیلی زود حوصله‌ات را سر می‌برد؟",
 "🦕39. اگر می‌توانستی با یک شخصیت بازی ملاقات کنی، چه کسی بود؟",
 "🦕40. غذای مورد علاقه‌ات چیست؟",
 "🦕41. صبح را دوست داری یا شب را؟",
 "🦕42. تابستان یا زمستان؟",
 "🦕43. فیلم یا بازی؟",
 "🦕44. یکی از هدف‌هایت برای امسال چیست؟",
 "🦕45. اگر اسم دیگری داشتی چه اسمی انتخاب می‌کردی؟",
 "🦕46. بهترین هدیه‌ای که گرفتی چی بوده؟",
 "🦕47. چه کاری را دوست داری بهتر انجام بدهی؟",
 "🦕48. کدام درس را بیشتر دوست داری؟",
 "🦕49. اگر یک حیوان خانگی داشتی چه بود؟",
 "🦕50. سه کلمه برای توصیف خودت بگو.",
 "🦕51. یک آهنگ بی‌کلام که دوست داری انتخاب کن.",
 "🦕52. اگر می‌توانستی زمان را متوقف کنی، چه کار جالبی می‌کردی؟",
 "🦕53. آخرین باری که از ته دل خندیدی کی بود؟",
 "🦕54. دوست داری کدام شهر را ببینی؟",
 "🦕55. اگر یک ربات داشتی، چه کاری به او می‌سپردی؟",
 "🦕56. یک فیلم یا سریال پیشنهادی بده.",
 "🦕57. یک غذای عجیب ولی بی‌خطر که امتحان کردی چیست؟",
 "🦕58. اگر یک روز مدیر مدرسه بودی چه چیزی را تغییر می‌دادی؟",
 "🦕59. یک خاطره خنده‌دار از مدرسه بگو.",
 "🦕60. اگر می‌توانستی یک اختراع بسازی، چی بود؟"
 ];
 const dares=[
 "🎯 1. با صدای ربات یک جمله بگو.",
 "🎯 2. ۱۰ ثانیه ادای یک شخصیت کارتونی را دربیاور.",
 "🎯 3. یک اسم خنده‌دار برای خودت انتخاب کن.",
 "🎯 4. یک شکلک را بدون حرف زدن اجرا کن تا بقیه حدس بزنند.",
 "🎯 5. یک جمله را با صدای خیلی آرام بگو.",
 "🎯 6. ۵ ثانیه مثل یک مجری تلویزیون صحبت کن.",
 "🎯 7. یک لطیفه کوتاه تعریف کن.",
 "🎯 8. سه کلمه تصادفی بگو و با آنها یک جمله بساز.",
 "🎯 9. اسم یک بازی را با حالت نمایشی معرفی کن.",
 "🎯 10. ۱۰ ثانیه ادای یک حیوان را دربیاور.",
 "🎯 11. یک تعریف محترمانه از یکی از بازیکن‌ها بکن.",
 "🎯 12. یک داستان سه‌جمله‌ای بداهه بساز.",
 "🎯 13. با سه ایموجی حال الانت را نشان بده.",
 "🎯 14. ۵ ثانیه مثل گوینده اخبار حرف بزن.",
 "🎯 15. یک حرکت بامزه انجام بده.",
 "🎯 16. یک اسم مستعار خلاقانه برای خودت بساز.",
 "🎯 17. یک سؤال خنده‌دار از جمع بپرس.",
 "🎯 18. یک جمله را با لحن رباتی تکرار کن.",
 "🎯 19. یک بازی مورد علاقه‌ات را تبلیغ کن.",
 "🎯 20. ۱۰ ثانیه بدون خندیدن جدی بمان."
 ];
 let last=-1;
 x.innerHTML='<div class="truthbox"><h3>🥺 جرئت یا حقیقت ♥</h3><div class="truthq" id="tq">یکی از گزینه‌ها را انتخاب کن!</div><div class="truthbuttons"><button class="truth" id="tb">♥ حقیقت</button><button class="dare" id="db">⚡ جرئت</button></div></div>';
 function pick(a){let i;do{i=Math.floor(Math.random()*a.length)}while(a.length>1&&i===last);last=i;$("tq").textContent=a[i]}
 x.querySelector("#tb").onclick=()=>pick(qs);
 x.querySelector("#db").onclick=()=>pick(dares);
}

function snake(x){
 x.innerHTML='<div class="msg" id="sm">🍎 سیب‌ها را بخور و بزرگ‌تر شو</div><div id="snakeGame" style="width:300px;height:300px;max-width:100%;margin:15px auto;background:#07100c;border:2px solid #40577f;border-radius:18px;position:relative;overflow:hidden"></div><div id="snakeOverlay" style="position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:#05070bcc;border-radius:18px;z-index:5"><button class="back" id="snakeRestart" style="font-size:17px;padding:14px 25px">🔄 شروع دوباره</button></div><div style="display:grid;grid-template-columns:repeat(3,65px);gap:7px;justify-content:center"><span></span><button class="back" id="su">⬆️</button><span></span><button class="back" id="sl">⬅️</button><button class="back" id="sd">⬇️</button><button class="back" id="sr">➡️</button></div>';
 const area=x.querySelector("#snakeGame"),msg=x.querySelector("#sm"),N=15,cell=20;
 let snakeBody,dir,next,apple,score,dead,timer;
 function randomApple(){let a;do{a={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)}}while(snakeBody.some(s=>s.x===a.x&&s.y===a.y));return a}
 function draw(){area.innerHTML="";snakeBody.forEach((s,i)=>{let d=document.createElement("div");d.style.cssText=`position:absolute;left:${s.x*cell}px;top:${s.y*cell}px;width:${cell}px;height:${cell}px;border-radius:45%;background:${i===0?"#7dff88":"#42c95b"};box-shadow:0 0 8px #42c95b`;area.appendChild(d)});let a=document.createElement("div");a.textContent="🍎";a.style.cssText=`position:absolute;left:${apple.x*cell-2}px;top:${apple.y*cell-2}px;font-size:23px;line-height:20px`;area.appendChild(a)}
 function start(){
   clearInterval(timer);snakeBody=[{x:7,y:7}];dir={x:1,y:0};next={x:1,y:0};apple=randomApple();score=0;dead=false;
   x.querySelector("#snakeOverlay").style.display="none";msg.textContent="🍎 سیب‌ها را بخور و بزرگ‌تر شو";
   draw();timer=setInterval(step,220);
 }
 function setDir(d){if(d.x===-dir.x&&d.y===-dir.y)return;next=d}
 function step(){if(dead)return;dir=next;let h={x:snakeBody[0].x+dir.x,y:snakeBody[0].y+dir.y};
   if(h.x<0||h.x>=N||h.y<0||h.y>=N||snakeBody.some(s=>s.x===h.x&&s.y===h.y)){
     dead=true;clearInterval(timer);msg.textContent="💥 باختی! امتیاز: "+score;
     x.querySelector("#snakeOverlay").style.display="flex";return;
   }
   snakeBody.unshift(h);
   if(h.x===apple.x&&h.y===apple.y){score++;apple=randomApple();msg.textContent="🍎 خوردی! امتیاز "+score}
   else snakeBody.pop();
   draw();
 }
 x.querySelector("#su").onclick=()=>setDir({x:0,y:-1});x.querySelector("#sd").onclick=()=>setDir({x:0,y:1});
 x.querySelector("#sl").onclick=()=>setDir({x:-1,y:0});x.querySelector("#sr").onclick=()=>setDir({x:1,y:0});
 x.querySelector("#snakeRestart").onclick=start;
 const key=e=>{if(e.key==="ArrowUp")setDir({x:0,y:-1});if(e.key==="ArrowDown")setDir({x:0,y:1});if(e.key==="ArrowLeft")setDir({x:-1,y:0});if(e.key==="ArrowRight")setDir({x:1,y:0})};
 document.addEventListener("keydown",key);start();
}
