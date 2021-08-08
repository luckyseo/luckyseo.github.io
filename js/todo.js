const toDoForm= document.getElementById("todo-form");
const toDoInput= toDoForm.querySelector("input");
const toDoList=document.getElementById("todo-list");

const TODOS_KEY="todos";

let toDos=[];
    
function saveToDos(){
    localStorage.setItem(TODOS_KEY,JSON.stringify(toDos));
}

function deleteToDO(event){
    const li = event.target.parentElement;
    toDos = toDos.filter((toDo) => toDo.id !== parseInt(li.id));
    li.remove();
    saveToDos();
}

function paintToDo(newToDo){
    const li = document.createElement("li");
    li.id=newToDo.id;
    const span=document.createElement("span");
    span.innerText=newToDo.text;
    const button=document.createElement("button");
    button.innerText="❌";
    button.addEventListener("click",deleteToDO);

    li.appendChild(span);
    li.appendChild(button);
    toDoList.appendChild(li);
}

function handleToDoSubmit(event){
    event.preventDefault();
    const newToDo = toDoInput.value;
    toDoInput.value="";
    const newToDoObj={
        text:newToDo,
        id:Date.now()
    }
    toDos.push(newToDoObj);
    paintToDo(newToDoObj);
    saveToDos();
}

toDoForm.addEventListener("submit",handleToDoSubmit);


const savedToDos = localStorage.getItem(TODOS_KEY);

if(savedToDos !== null){
    const parseToDos = JSON.parse(savedToDos);
    toDos = parseToDos;
    parseToDos.forEach(paintToDo); //(item) => console.log(sdf)
}
// arr.filter(item=> item >2)
