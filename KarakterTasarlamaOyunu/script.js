const character=document.getElementById("character")
const hair=document.getElementById("hair")
const body=document.getElementById("body")
const pants=document.getElementById("pants")
const hat=document.getElementById("hat")
const glasses=document.getElementById("glasses")
const pet=document.getElementById("pet")

function setCharacter(type){
character.classList.remove("normal-mode","hero-mode","funny-mode")
character.classList.add(type+"-mode")
}

function setHairColor(color){
hair.style.backgroundColor=color
}

function setShirt(shirt){
body.className="body "+shirt
}

function removeShirt(){
body.className="body hidden"
}

function setPants(type){
pants.className="pants "+type
}

function removePants(){
pants.className="pants hidden"
}

function setHat(emoji){
hat.textContent=emoji
hat.classList.remove("hidden")
}

function removeHat(){
hat.classList.add("hidden")
}

function toggleGlasses(){
glasses.classList.toggle("hidden")
}

function togglePet(){
pet.classList.toggle("hidden")
}

function resetCharacter(){

setCharacter("normal")

hair.style.backgroundColor="#2d1b0e"

body.className="body shirt-blue"
pants.className="pants pants-black"

hat.textContent="🧢"
hat.classList.remove("hidden")

glasses.classList.add("hidden")
pet.classList.add("hidden")

}

function randomCharacter(){

const hairColors=["#2d1b0e","#7a4a20","#d4a017","#c2185b"]
const shirts=["shirt-blue","shirt-red","shirt-green"]
const pantsList=["pants-black","pants-purple","pants-orange"]
const hats=["🧢","🎩","👑"]
const modes=["normal","hero","funny"]

setCharacter(modes[Math.floor(Math.random()*modes.length)])

setHairColor(hairColors[Math.floor(Math.random()*hairColors.length)])

body.className="body "+shirts[Math.floor(Math.random()*shirts.length)]

pants.className="pants "+pantsList[Math.floor(Math.random()*pantsList.length)]

setHat(hats[Math.floor(Math.random()*hats.length)])

Math.random()>0.5?glasses.classList.remove("hidden"):glasses.classList.add("hidden")
Math.random()>0.5?pet.classList.remove("hidden"):pet.classList.add("hidden")

}

resetCharacter()
