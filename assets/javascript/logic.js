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

var blankArray = [];

var attackSetUpPhase;

var attackReady;

var attackDisplay;

var attackTimer;

var x;

//window states will be needed to determine when this is true for players
document.addEventListener('keydown', actions, true);

function actions() {
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
	console.log(attackSetUpPhase);
		}
	};
function attackPhase () {
if (blankArray.length === 5) {
	document.removeEventListener('keydown', actions, true);
	attackSetUpPhase = blankArray.slice(0, 6);
	attackReady = attackSetUpPhase;
	blankArray = [];
	startAttack();
	}
	console.log(attackReady)
}

function startAttack () {
	x = 0;
	attackTimer = setInterval(function(){displayAttack()},1000);
}

function displayAttack () {
	console.log(x);
	$("#attacks").empty();
	$("#attacks").append(attackReady[x]);
	x++;
			
	if (x > 4){
		clearInterval(attackTimer);
		setTimeout(function(){
		$("#attacks").empty();},1000);
		document.addEventListener('keydown', actions, true);
		}
	}

});