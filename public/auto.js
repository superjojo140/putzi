 var socket = io.connect();
var lightState = 0;

 function drive(motor,direction,speed) {
     socket.emit("message", {
         type : "motor", motor : motor, direction : direction, speed : speed
     });
 }
var i = 0;

function startDriving(){
   
        drive(2,1,i);
    i += 20;
    
}

$("body").keydown(function(event){
    switch (event.key){
        case "ArrowUp" : drive(1,1,255); break;
        case "ArrowDown" : drive(1,0,255); break;
        case "ArrowRight" : drive(2,0,255); break;
        case "ArrowLeft" : drive(2,1,255); break;
    }
});

$("body").keyup(function(event){
    switch (event.key){
        case "ArrowUp" : drive(1,1,0); break;
        case "ArrowDown" : drive(1,0,0); break;
        case "ArrowRight" : drive(2,1,0); break;
        case "ArrowLeft" : drive(2,0,0); break;
    }
});

$("#forward").on("touchstart",function(){ drive(1,1,255)});
$("#backward").on("touchstart",function(){ drive(1,0,255)});
$("#left").on("touchstart",function(){ drive(2,1,255)});
$("#right").on("touchstart",function(){ drive(2,0,255)});

$("#forward").on("touchend",function(){ drive(1,1,0)});
$("#backward").on("touchend",function(){ drive(1,0,0)});
$("#left").on("touchend",function(){ drive(2,1,0)});
$("#right").on("touchend",function(){ drive(2,0,0)});

function stop(){
    socket.emit("message", {
         type : "emergency"
     });
}

function toggleLight(){
    lightState = !lightState;
    socket.emit("message", {
         type : "light",
         state : lightState
     });
}



