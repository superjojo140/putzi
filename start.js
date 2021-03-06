var Gpio = require('pigpio').Gpio;
const spawn = require('child_process');


//Own classes
const einkClass = require("./e-ink/eink.js");
const eink = new einkClass("./e-ink/menu.json");

/*

   _____                _              _
  / ____|              | |            | |
 | |     ___  _ __  ___| |_ __ _ _ __ | |_ ___
 | |    / _ \| '_ \/ __| __/ _` | '_ \| __/ __|
 | |___| (_) | | | \__ \ || (_| | | | | |_\__ \
  \_____\___/|_| |_|___/\__\__,_|_| |_|\__|___/



*/
const FORWARD = 1;
const BACKWARDS = 0;
var motor1 = {};
var motor2 = {};
var lightPort;
var buttonRightState = 0;
var buttonLeftState = 0;
var accelerationIntervall = 5;
var accelerationStep = 10;
var adjustSpeedTimeout;
/*

  _____       _ _     _____           _
 |_   _|     (_) |   |  __ \         | |
   | |  _ __  _| |_  | |__) |__  _ __| |_ ___
   | | | '_ \| | __| |  ___/ _ \| '__| __/ __|
  _| |_| | | | | |_  | |  | (_) | |  | |_\__ \
 |_____|_| |_|_|\__| |_|   \___/|_|   \__|___/



*/
motor1.pwmGPIO = new Gpio(19, {
  mode: Gpio.OUTPUT
});
motor1.direction0GPIO = new Gpio(16, {
  mode: Gpio.OUTPUT
});
motor1.direction1GPIO = new Gpio(13, {
  mode: Gpio.OUTPUT
});

//MOTOR 2

motor2.pwmGPIO = new Gpio(26, {
  mode: Gpio.OUTPUT
});
motor2.direction0GPIO = new Gpio(21, {
  mode: Gpio.OUTPUT
});
motor2.direction1GPIO = new Gpio(20, {
  mode: Gpio.OUTPUT
});

//LIGHT
lightPort = new Gpio(6, {
  mode: Gpio.OUTPUT
});
/*

  _____       _ _     __  __       _                _____ _        _
 |_   _|     (_) |   |  \/  |     | |              / ____| |      | |
   | |  _ __  _| |_  | \  / | ___ | |_ ___  _ __  | (___ | |_ __ _| |_ ___  ___
   | | | '_ \| | __| | |\/| |/ _ \| __/ _ \| '__|  \___ \| __/ _` | __/ _ \/ __|
  _| |_| | | | | |_  | |  | | (_) | || (_) | |     ____) | || (_| | ||  __/\__ \
 |_____|_| |_|_|\__| |_|  |_|\___/ \__\___/|_|    |_____/ \__\__,_|\__\___||___/



*/
motor1.pwmState = 0;
motor1.directionState = 0;
motor2.pwmState = 0;
motor2.directionState = 0;
/*

  _____       _ _     __  __       _                __                  _   _
 |_   _|     (_) |   |  \/  |     | |              / _|                | | (_)
   | |  _ __  _| |_  | \  / | ___ | |_ ___  _ __  | |_ _   _ _ __   ___| |_ _  ___  _ __  ___
   | | | '_ \| | __| | |\/| |/ _ \| __/ _ \| '__| |  _| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
  _| |_| | | | | |_  | |  | | (_) | || (_) | |    | | | |_| | | | | (__| |_| | (_) | | | \__ \
 |_____|_| |_|_|\__| |_|  |_|\___/ \__\___/|_|    |_|  \__,_|_| |_|\___|\__|_|\___/|_| |_|___/



*/
motor1.turn = function(direction, speed) {
  motor1.direction0GPIO.digitalWrite(direction);
  motor1.direction1GPIO.digitalWrite(!direction);
  motor1.directionState = direction;
  motor1.pwmGPIO.pwmWrite(speed);
  motor1.pwmState = speed;
};
motor2.turn = function(direction, speed) {
  motor2.direction0GPIO.digitalWrite(direction);
  motor2.direction1GPIO.digitalWrite(!direction);
  motor2.directionState = direction;
  motor2.pwmGPIO.pwmWrite(speed);
  motor2.pwmState = speed;
};
/*

  _____       _ _     ____        _   _
 |_   _|     (_) |   |  _ \      | | | |
   | |  _ __  _| |_  | |_) |_   _| |_| |_ ___  _ __  ___
   | | | '_ \| | __| |  _ <| | | | __| __/ _ \| '_ \/ __|
  _| |_| | | | | |_  | |_) | |_| | |_| || (_) | | | \__ \
 |_____|_| |_|_|\__| |____/ \__,_|\__|\__\___/|_| |_|___/



*/
//Right
/*var buttonRight = new Gpio(20, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP,
    edge: Gpio.EITHER_EDGE
});
buttonRight.on('interrupt', function (level) {
    console.log("Rechter Taster gedückt: " + level);
    buttonRightState = level;
    if (buttonRightState == 1 && motor2.directionState == BACKWARDS && motor2.pwmState > 0) {
        motorTurn(motor2, FORWARD, 0);
        console.log("Lenkung blockiert nach Rechts - Lenkung gestoppt");
    }
});
//Left
var buttonLeft = new Gpio(13, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_UP,
    edge: Gpio.EITHER_EDGE
});
buttonLeft.on('interrupt', function (level) {
    console.log("Linker Taster gedrückt: " + level);
    buttonLeftState = level;
    if (buttonLeftState == 1 && motor2.directionState == FORWARD && motor2.pwmState > 0) {
        motorTurn(motor2, BACKWARDS, 0);
        console.log("Lenkung blockiert nach Links - Lenkung gestoppt");
    }
});*/
/*

  __  __       _                _____            _             _   ______                _   _
 |  \/  |     | |              / ____|          | |           | | |  ____|              | | (_)
 | \  / | ___ | |_ ___  _ __  | |     ___  _ __ | |_ _ __ ___ | | | |__ _   _ _ __   ___| |_ _  ___  _ __  ___
 | |\/| |/ _ \| __/ _ \| '__| | |    / _ \| '_ \| __| '__/ _ \| | |  __| | | | '_ \ / __| __| |/ _ \| '_ \/ __|
 | |  | | (_) | || (_) | |    | |___| (_) | | | | |_| | | (_) | | | |  | |_| | | | | (__| |_| | (_) | | | \__ \
 |_|  |_|\___/ \__\___/|_|     \_____\___/|_| |_|\__|_|  \___/|_| |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/



*/
function motorTurn(motor, direction, speed) {
  //check Speed
  if (speed < 0 || speed > 255) {
    console.log("Falsche Speed Angabe (Mind. 100 | Max. 255): " + speed);
    return;
  }
  //Prüfe ob Lenkung blockiert
  /*if (buttonRightState == 1 && direction == BACKWARDS && motor == motor2 && speed > 0) {
      console.log("Lenkung blockiert nach Rechts - Lenkung gestoppt");
      return;
  }
  if (buttonLeftState == 1 && direction == FORWARD && motor == motor2 && speed > 0) {
      console.log("Lenkung blockiert nach Links - Lenkung gestoppt");
      return;
  }*/
  //Prüfe, ob motor gestopp oder gestartet wird
  if (speed > 0) {
    console.log("Turning Motor");
  } else {
    console.log("Stopping Motor");
  }
  //
  //Befehl an Motor
  //
  //  adjustSpeed(motor, Number(direction), Number(speed));
  motor.turn(Number(direction), Number(speed));
}

function adjustSpeed(motor, direction, speed) {
  clearTimeout(adjustSpeedTimeout);
  if (motor == motor2) {
    motor2.turn(direction, speed);
  } else if (motor == motor1) {
    if (motor1.pwmState < speed) {
      console.log("schneller werden");
      motor1.turn(direction, Math.min(speed, motor1.pwmState + accelerationStep));
      adjustSpeedTimeout = setTimeout(function() {
        adjustSpeed(motor, direction, speed);
      }, accelerationIntervall);
    } else if (motor1.pwmState > speed) {
      console.log("langsamer werden");
      motor1.turn(direction, Math.max(speed, motor1.pwmState - accelerationStep));
      adjustSpeedTimeout = setTimeout(function() {
        adjustSpeed(motor, direction, speed);
      }, accelerationIntervall);
    }
  } else {
    console.log("Error: adjustSpeed() has no valid motor");
  }
}

function stoppAll() {
  motor1.turn(0, 0);
  motor2.turn(0, 0);
  console.log("EMERGENCY - UIUIUIUIUIUIUIUIUIUIU");
  clearTimeout(adjustSpeedTimeout);
}
/*

  _      _       _     _
 | |    (_)     | |   | |
 | |     _  __ _| |__ | |_
 | |    | |/ _` | '_ \| __|
 | |____| | (_| | | | | |_
 |______|_|\__, |_| |_|\__|
            __/ |
           |___/

*/
function lightSwitch(state) {
  lightPort.digitalWrite(state);
}
/*

   _____
  / ____|
 | (___   ___ _ __ ___  ___ _ __
  \___ \ / __| '__/ _ \/ _ \ '_ \
  ____) | (__| | |  __/  __/ | | |
 |_____/ \___|_|  \___|\___|_| |_|



*/
var ipAdresse = getIp();
var screenContent = ["e-ink/screen_writer.py", "   Putzi  ", ipAdresse, "Port:  3000", "Akku: 10.5V", "Clients:  1", "Menu      -", 0, 1, 0, 0, 0, 0];

function showScreenInfo() {
  //auf Bildschirm schreiben
  //const ls = spawn.spawn('python', screenContent);
  //eink.alert("Hallo1");
}

function setScreenInfo(line, content) {
  if (line > 0 && line < 10) {
    screenContent[line] = content;

  }

}

function getIp() {
  var os = require('os');
  var networkInterfaces = os.networkInterfaces();
  return networkInterfaces['wlan0'][0]['address'];
}
/*

   _____            _        _     _
  / ____|          | |      | |   (_)
 | (___   ___   ___| | _____| |_   _  ___
  \___ \ / _ \ / __| |/ / _ \ __| | |/ _ \
  ____) | (_) | (__|   <  __/ |_ _| | (_) |
 |_____/ \___/ \___|_|\_\___|\__(_)_|\___/



*/
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
app.use(express.static('public')); //Verzeichniss zur Verfügung stellen
var connections = [];
server.listen(3000);
console.log("Server running on Port 3000");

showScreenInfo();

io.sockets.on("connection", function(socket) {
  connections.push(socket);
  console.log("New Client connected");
  //Disconnect
  socket.on("disconnect", function(data) {
    stoppAll();
    connections.splice(connections.indexOf(socket), 1);
    console.log("Client disconnected");
  });
  socket.on("message", function(data) {
    if (data.type == "motor") {
      var myMotor;
      if (data.motor == 1) {
        myMotor = motor1;
        motorTurn(myMotor, data.direction, data.speed);
      } else if (data.motor == 2) {
        myMotor = motor2;
        motorTurn(myMotor, data.direction, data.speed);
      } else if (data.motor == "both") {
        console.log("both");
        motorTurn(motor1, data.direction, data.speed);
        motorTurn(motor2, data.direction, data.speed);
      }

    } else
    if (data.type == "light") {
      lightSwitch(data.state);
    } else if (data.type == "screenControl") {
      if (data.control == "next"){
        eink.next();
      }
      if (data.control == "back"){
        eink.back();
      }
      if (data.control == "select"){
        eink.select();
      }
    } else {
      stoppAll();
    }
  });
});
