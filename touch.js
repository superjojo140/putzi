var Gpio = require('pigpio').Gpio;
const spawn = require('child_process');

var isTouched = false;
var lastTouched = 0;
var delay=100;

/*
  _____       _ _     _____           _       
 |_   _|     (_) |   |  __ \         | |      
   | |  _ __  _| |_  | |__) |__  _ __| |_ ___ 
   | | | '_ \| | __| |  ___/ _ \| '__| __/ __|
  _| |_| | | | | |_  | |  | (_) | |  | |_\__ \
 |_____|_| |_|_|\__| |_|   \___/|_|   \__|___/
                                              
                                              

*/

touchPort = new Gpio(5, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP,
    edge: Gpio.EITHER_EDGE
});

touchPort.on('interrupt', function (level) {
    if (isTouched == false){
        isTouched = true;     
        console.log("Taster gedückt: " + level);
    }
    lastTouched = Date.now();
    setTimeout(freeTouch,delay+10);
    
    
});
 
function freeTouch(){    
    if((Number(Date.now() - lastTouched)) > delay){
         isTouched = false;
    }
   
}
