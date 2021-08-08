const clock=document.querySelector("h2#clock");


function currentTime(){
    const date=new Date();
    const hours=String(date.getHours());
    const minutes=String(date.getMinutes());
    const seconds=String(date.getSeconds());

    clock.innerHTML=`${hours.padStart(2,"0")}:${minutes.padStart(2,"0")}:${seconds.padStart(2,"0")}`;
}

setInterval(currentTime,1000);//function every sth second

//setTimeout(function,waitingTime)//functon after sth second