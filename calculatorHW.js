const calculator={
    add:function(a,b){
        return a+b;
    },minus:function(a,b){
        console.log(a-b);
    },divide:function(a,b){
        console.log(a/b);
    },multi:function(a,b){
        console.log(a*b);
    },square:function(a,b){ //power
        console.log(a**b);
    }
}
console.log(calculator.add(1,2));
calculator.minus(1,2);
calculator.divide(2,1);
calculator.multi(2,4);
calculator.square(2,3);

// typeof sth or(sth)

console.log(parseInt("sdf")); //NaN="Not A NUmber"
console.log(isNaN("sdf"));//boolean
//can get object from html to javascript
//js can access and recreate html JS>>HTML
const title=document.querySelector("#title");
console.dir(title);
title.innerText="Got ya";
//querySelector helps you to get elements like CSS
title.style.color="violet";
function handleTitleClick(){
    console.log("title was clicked.");
    if (title.style.color=="violet"){title.style.color="black";}
    else title.style.color="violet";
}
function handleWindowResize(){
    document.body.style.backgroundColor="tomato";
    //document.title==head title not body title
    //document body head title restofit=> use query selector
}
//title.addEventListener("click",handleTitleClick); 
//->later you can use .removeeventlistener
//Web APIs sth with on is eventlistener but u should use without on
title.onclick=handleTitleClick; //not recommanded
window.addEventListener("resize",handleWindowResize);