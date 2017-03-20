$(document).ready(function() {

/*var config = {
    apiKey: "AIzaSyAOFi3bIryWbgOrsTHyoS3bTKzTGQOpcHs",
    authDomain: "thecodingbayshop.firebaseapp.com",
    databaseURL: "https://thecodingbayshop.firebaseio.com",
    storageBucket: "thecodingbayshop.appspot.com",
    messagingSenderId: "648124109917"
  };
  firebase.initializeApp(config);

var database = firebase.database();*/

//examples for user authentication uses. i.e. as players level up
//variable that increases size of blankArray.length, right now hard coded in at 5
//variable that decreases setInterval time, right now hard coded in at 1000 ms

var blankArray = [];

var attackSetUpPhase;

var attackReady;

var attackDisplay;

var attackTimer;

var defendMechanic;

var defendDisplay = [];

var x;

//window states will be needed to determine when this is true for players
document.addEventListener('keydown', attackInputs, true);

document.addEventListener('keydown', defendInputs, false);

function attackInputs() {
	var leftKey = event.keyCode;
	if (37 === leftKey){
	//i.e. if (player1 is attacking){
	blankArray.push("\\");
	attackPhase();
	//}
	//else if (player 2 is attacking)....
		}
	var upKey = event.keyCode;
	if (38 === upKey){
	blankArray.push("|");
	attackPhase();
		}
	var rightKey = event.keyCode;
	if (39 === rightKey){
	blankArray.push("/");
	attackPhase();
		}
	var downKey = event.keyCode;
	if (40 === downKey){
	blankArray.push("-");
	attackPhase();
		}
	var qKey = event.keyCode;
	if (81 === qKey){
	blankArray.push("*");
	//i.e. frost blast
	attackPhase();
		}
	var wKey = event.keyCode;
	if (87 === wKey){
	blankArray.push("~");
	//i.e. thunder strike
	attackPhase();
		}
	var eKey = event.keyCode;
	if (69 === eKey){
	blankArray.push("X");
	//i.e. fire slash
	attackPhase();
		}
	var rKey = event.keyCode;
	if (82 === rKey){
	blankArray.push("^");
	//i.e. earth crack
	attackPhase();
		}
	};

function defendInputs () {
	var leftKey = event.keyCode;
	if (37 === leftKey){
	defendMechanic = "";
	defendMechanic = "/";
	defendDisplay.push("\\");
		}
	var upKey = event.keyCode;
	if (38 === upKey){
	defendMechanic = "";
	defendMechanic = "-";
	defendDisplay.push("|");
		}
	var rightKey = event.keyCode;
	if (39 === rightKey){
	defendMechanic = "";
	defendMechanic = "\\";
	defendDisplay.push("/");
		}
	var downKey = event.keyCode;
	if (40 === downKey){
	defendMechanic = "";
	defendMechanic = "|";
	defendDisplay.push("-");
		}
	var qKey = event.keyCode;
	if (81 === qKey){
	defendMechanic = "";
	defendMechanic = "~";
	defendDisplay.push("*");
	//ice beats thunder
		}
	var wKey = event.keyCode;
	if (87 === wKey){
	defendMechanic = "";
	defendMechanic = "^";
	defendDisplay.push("~");
	//thunder beats earth
		}
	var eKey = event.keyCode;
	if (69 === eKey){
	defendMechanic = "";
	defendMechanic = "*";
	defendDisplay.push("X");
	//fire beats ice
		}
	var rKey = event.keyCode;
	if (82 === rKey){
	defendMechanic = "";
	defendMechanic = "X";
	defendDisplay.push("^");
	//earth beats fire
		}
	}
function attackPhase () {
if (blankArray.length === 5) {
	document.removeEventListener('keydown', attackInputs, true);
	document.addEventListener('keydown', defendInputs, true);
	attackSetUpPhase = blankArray.slice(0, 6);
	attackReady = attackSetUpPhase;
	blankArray = [];
	startAttack();
	}
}

function startAttack () {
	x = 0;
	$("#attacks").empty();
	$("#attacks").append(attackReady[x]);
	attackTimer = setInterval(function(){displayAttack()},1000);
}

function displayAttack () {
	console.log(x);
	parryCheck();
	x++;
	$("#attacks").empty();
	$("#attacks").append(attackReady[x]);

	if (x > 4){
		clearInterval(attackTimer);
		setTimeout(function(){
			$("#attacks").empty();
			$("#message").text("");},1000);
		document.addEventListener('keydown', attackInputs, true);
		document.removeEventListener('keydown', defendInputs, true);
		}
	}

function parryCheck() {
	if (attackReady[x] === defendMechanic) {
		$("#message").text("Parried!");
	}
	
	else {
		$("#message").text("You took a hit!");
	}
	defendMechanic = "";
}

});