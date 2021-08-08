const loginForm = document.querySelector(".login-form");
const loginInput=document.querySelector(".login-form input");
const loginButton=document.querySelector(".login-form button");
// input validation => input should be inside of form
const greeting=document.querySelector("#greeting");

const USERNAME_KEY="username";

function onLoginSubmit(event){ //frist argument is about the event(what just happened)
    event.preventDefault();
    loginForm.classList.add("hidden");
    const username=loginInput.value;
    console.log(username);
    localStorage.setItem(USERNAME_KEY,username);
    paintGreetings(username);
}
function paintGreetings(username){
    greeting.innerHTML=`Hello ${username}`;
    greeting.classList.remove("hidden");
}
const savedUsername=localStorage.getItem(USERNAME_KEY);

if (savedUsername===null){
    loginForm.classList.remove("hidden");
    loginForm.addEventListener("submit",onLoginSubmit);
}else{
paintGreetings(savedUsername);
}