function addPost() {

  let title = document.getElementById("title").value
  let content = document.getElementById("content").value

  if(title==="" || content===""){
    alert("Lütfen tüm alanları doldurun!")
    return
  }

  let newCard=document.createElement("div")
  newCard.className="card"

  newCard.innerHTML=`
  <h3>🆕 ${title}</h3>
  <p>${content}</p>
  `

  document.querySelector(".posts").appendChild(newCard)

  document.getElementById("title").value=""
  document.getElementById("content").value=""

}
