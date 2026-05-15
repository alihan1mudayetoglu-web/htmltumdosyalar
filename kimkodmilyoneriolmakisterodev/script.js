const questions = [

{
question:"HTML'de en büyük başlık etiketi hangisidir?",
answers:["<h6>","<h1>","<header>","<title>"],
correct:1
},

{
question:"CSS'te yazı rengini değiştiren özellik hangisi?",
answers:["text-color","font-color","color","background"],
correct:2
},

{
question:"JavaScript'te mesaj kutusu açan fonksiyon?",
answers:["alert()","popup()","msg()","open()"],
correct:0
},

{
question:"HTML'de liste oluşturma etiketi?",
answers:["<ul>","<table>","<li>","<ol>"],
correct:0
},

{
question:"CSS'te elementi gizlemek?",
answers:["display:none","hide:true","opacity:2","visible:false"],
correct:0
},

{
question:"JavaScript değişken tanımlama?",
answers:["make","let","create","varible"],
correct:1
},

{
question:"HTML'de kullanıcı veri girişi?",
answers:["<data>","<input>","<type>","<field>"],
correct:1
},

{
question:"CSS arkaplan rengi?",
answers:["bgcolor","background-color","color-bg","bg-style"],
correct:1
},

{
question:"Sayfa yüklendiğinde çalışan event?",
answers:["onstart","onload","onopen","onbegin"],
correct:1
},

{
question:"Resme tıklayınca link vermek?",
answers:["<a> içine koymak","onclick yazmak","<goto>","<img link>"],
correct:0
}

];

let currentQuestion=0;
let score=0;
let answered=false;

let time=30;
let timer;

let lifelines={
fifty:1,
phone:1,
audience:1
};

const questionText=document.getElementById("questionText");
const answersContainer=document.getElementById("answersContainer");
const nextBtn=document.getElementById("nextBtn");
const restartBtn=document.getElementById("restartBtn");
const messageBox=document.getElementById("messageBox");

const questionNumber=document.getElementById("questionNumber");
const scoreText=document.getElementById("scoreText");
const timerText=document.getElementById("timer");

function startTimer(){

clearInterval(timer);

time=30;

timerText.textContent="⏱ "+time;

timer=setInterval(()=>{

time--;

timerText.textContent="⏱ "+time;

if(time<=0){

clearInterval(timer);

messageBox.textContent="⏰ Süre bitti!";

setTimeout(resetGame,1500);

}

},1000);

}

function loadQuestion(){

answered=false;

nextBtn.disabled=true;

startTimer();

const q=questions[currentQuestion];

questionNumber.textContent="Soru "+(currentQuestion+1);
scoreText.textContent="Skor: "+score;

questionText.textContent=q.question;

answersContainer.innerHTML="";

q.answers.forEach((a,i)=>{

const btn=document.createElement("button");

btn.className="answer-btn";

btn.textContent=a;

btn.onclick=()=>selectAnswer(i,btn);

answersContainer.appendChild(btn);

});

}

function selectAnswer(i,btn){

if(answered)return;

answered=true;

clearInterval(timer);

const q=questions[currentQuestion];

const buttons=document.querySelectorAll(".answer-btn");

buttons.forEach((b,index)=>{

b.disabled=true;

if(index===q.correct){

b.classList.add("correct");

}

});

if(i===q.correct){

btn.classList.add("correct");

score++;

messageBox.textContent="✔ Doğru!";

updateMoney();

nextBtn.disabled=false;

}else{

btn.classList.add("wrong");

messageBox.textContent="❌ Yanlış!";

setTimeout(resetGame,1500);

}

scoreText.textContent="Skor: "+score;

}

function updateMoney(){

const items=document.querySelectorAll("#moneyList li");

items.forEach((li,i)=>{

li.classList.remove("active","passed");

if(i===score){

li.classList.add("active");

}

if(i<score){

li.classList.add("passed");

}

});

}

function useFifty(){

if(lifelines.fifty<=0||answered)return;

lifelines.fifty--;

const q=questions[currentQuestion];

const buttons=document.querySelectorAll(".answer-btn");

let wrong=[];

buttons.forEach((btn,i)=>{

if(i!==q.correct)wrong.push(i);

});

wrong.sort(()=>Math.random()-0.5);

buttons[wrong[0]].style.visibility="hidden";
buttons[wrong[1]].style.visibility="hidden";

}

function usePhone(){

if(lifelines.phone<=0||answered)return;

lifelines.phone--;

const q=questions[currentQuestion];

let guess;

if(Math.random()<0.7){

guess=q.answers[q.correct];

}else{

guess=q.answers[Math.floor(Math.random()*4)];

}

messageBox.textContent="📞 Telefon: "+guess;

}

function useAudience(){

if(lifelines.audience<=0||answered)return;

lifelines.audience--;

const q=questions[currentQuestion];

let results=[];

for(let i=0;i<4;i++){

if(i===q.correct){

results.push(60+Math.floor(Math.random()*30));

}else{

results.push(Math.floor(Math.random()*40));

}

}

let max=results.indexOf(Math.max(...results));

messageBox.textContent="👥 Seyirci en çok "+q.answers[max]+" dedi (%"+results[max]+")";

}

nextBtn.onclick=()=>{

currentQuestion++;

if(currentQuestion>=questions.length){

messageBox.textContent="🎉 Oyunu kazandın!";

nextBtn.disabled=true;

return;

}

loadQuestion();

};

restartBtn.onclick=resetGame;

function resetGame(){

currentQuestion=0;
score=0;

lifelines={
fifty:1,
phone:1,
audience:1
};

loadQuestion();

}

loadQuestion();
