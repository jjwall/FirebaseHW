$(document).ready(function() {

var config = {
    apiKey: "AIzaSyAOFi3bIryWbgOrsTHyoS3bTKzTGQOpcHs",
    authDomain: "thecodingbayshop.firebaseapp.com",
    databaseURL: "https://thecodingbayshop.firebaseio.com",
    storageBucket: "thecodingbayshop.appspot.com"
  };

  firebase.initializeApp(config);

//examples for user authentication uses. i.e. as players level up
//variable that increases size of blankArray.length, right now hard coded in at 5
//variable that decreases setInterval time, right now hard coded in at 1000 ms

//game variables below
var blankArray = [];

var attackArray = [];

var attackSetUpPhase;

var attackReady;

var attackDisplay;

var attackTimer;

var defendMechanic;

var defendDisplay = [];

var x;

//firebase variables below
var database = firebase.database();

var playersRef = database.ref("players");

var currentPhaseRef = database.ref("phase");

var currentPhase = null;

var username = "guest";

var playerIndex = false;
//determines which player you are, so eventListeners will depend on this

var numberOfPlayers = null;

var playerOne = false;

var playerTwo = false;

var playerOneData = null;

var playerTwoData = null;

var peoplePlaying = null;
//no totally sure how this varialbe operates, but something like = 0 is 1 player, = 1 is 2 players

playersRef.on("value", function(snapshot) {
	peoplePlaying = snapshot.numChildren();

	playerOne = snapshot.child("1").exists();
	playerTwo = snapshot.child("2").exists();

	playerOneData = snapshot.child("1").val();
  	playerTwoData = snapshot.child("2").val();
});

//basically a dynamic button that can only be pushed once by each player
$("#start").click(function() {
	enterGame ();
});

//essentially, when a second player joins, names currentPhase variable
//attackDefend which means player 1 wil set up attack, and player 2 defends
playersRef.on("child_added", function(snapshot){
	if (peoplePlaying === 1) {
		//if (playerOneData.AttackArray.length > 5)
		currentPhaseRef.set("attackDefend");
	}
});

//child_changed might be jank code, player.ref(attackArray) starts off equal to false
//as soon as 5 attack inputs are made by player 1, attackArray "changes" thus we are able
//to use the event listener (for firebase) on("child_changed")
//wanted to use playersRef.attackArray.on("value")... in order to be specific..
playersRef.on("child_changed", function(snapshot){
	//i.e. startAttack();
	x = 0;
	setTimeout(function(){doThis()},1000);
		//console.log(playerOneData.attackArray);
		console.log(snapshot);
	function doThis () {
	$("#attacks").empty();
	if (currentPhase === "attackDefend"){
		$("#attacks").append(playerOneData.attackArray[x]);
		console.log(playerOneData.attackArray[x]);
		attackTimer = setInterval(function(){displayAttack1()},1000);
	}
	else if (currentPhase === "defendAttack"){
		$("#attacks").append(playerTwoData.attackArray[x]);
		console.log(playerTwoData.attackArray[x]);
		attackTimer = setInterval(function(){displayAttack2()},1000);
	}
}

	function displayAttack1 () {
		console.log(x);
		parryCheck();
		x++;
		$("#attacks").empty();
		$("#attacks").append(playerOneData.attackArray[x]);

		if (x > 4){
			clearInterval(attackTimer);
			setTimeout(function(){
			$("#attacks").empty();
			$("#message").text("");//},1000);
			if ((currentPhase === "attackDefend") && (playerOne)){
				currentPhaseRef.set("defendAttack");
				console.log(currentPhase);
			}
			else if ((currentPhase === "defendAttack") && (playerOne === false)){
				currentPhaseRef.set("attackDefend");
				console.log(currentPhase);
			}},1000);
		//document.addEventListener('keydown', attackInputs, true);
		//document.removeEventListener('keydown', defendInputs, true);
		}
	}

	function displayAttack2 () {
		console.log(x);
		parryCheck();
		x++;
		$("#attacks").empty();
		$("#attacks").append(playerTwoData.attackArray[x]);

		if (x > 4){
			clearInterval(attackTimer);
			setTimeout(function(){
			$("#attacks").empty();
			$("#message").text("");//},1000);
			if ((currentPhase === "attackDefend") && (playerOne)){
				currentPhaseRef.set("defendAttack");
				console.log(currentPhase);
			}
			else if ((currentPhase === "defendAttack") && (playerOne)){
				currentPhaseRef.set("attackDefend");
				console.log(currentPhase);
			}},1000);
		//document.addEventListener('keydown', attackInputs, true);
		//document.removeEventListener('keydown', defendInputs, true);
		}
	}
});

function enterGame (){

if (peoplePlaying < 2) {
	console.log(playerOne);

    if (playerOne) {
      playerIndex = 2;
    }
    else {
      playerIndex = 1;
    }

	playerRef = database.ref("/players/" + playerIndex);

	playerRef.set({
      name: username,
      wins: 0,
      losses: 0,
      attackArray: false
    });

    playerRef.onDisconnect().remove();
    //disconnects player

    currentPhaseRef.onDisconnect().remove();
    //sets phase back to null

    $("#dynamic_button").html("<h1>Hi Player " + playerIndex + "</h1>");
}
   else {
   	alert("sorry game full!");
    }
}

playersRef.on("value", function(snapshot) {
	playerOne = snapshot.child("1").exists();
  	playerTwo = snapshot.child("2").exists();

  	playerOneData = snapshot.child("1").val();
  	playerTwoData = snapshot.child("2").val();

  	if (playerOne) {
    $("#player1-name").text("Player 1 Rdy");
    $("#player1-wins").text("Wins: " + playerOneData.wins);
    $("#player1-losses").text("Losses: " + playerOneData.losses);
  }
  else {
    // If there is no player 1, clear win/loss data and show waiting
    $("#player1-name").text("Waiting for Player 1");
    $("#player1-wins").empty();
    $("#player1-losses").empty();
  }
  if (playerTwo) {
    $("#player2-name").text("Player 2 Rdy");
    $("#player2-wins").text("Wins: " + playerTwoData.wins);
    $("#player2-losses").text("Losses: " + playerTwoData.losses);
  }
  else {
  	$("#player2-name").text("Waiting for Player 2");
    $("#player2-wins").empty();
    $("#player2-losses").empty();
  }

  });

//currentPhase.child("phase").set("attackDefend")

//document.addEventListener('keydown', attackInputs, false);

//document.addEventListener('keydown', defendInputs, false);

currentPhaseRef.on("value", function(snapshot) {
	//phases need to be, attackDefend and defendAttack
	//console.log(currentPhaseRef);
		currentPhase = snapshot.val();

	if (currentPhase === "attackDefend"){
		if (playerIndex === 1) {
			console.log(playerIndex);
			document.removeEventListener('keydown', defendInputs, true);
			document.addEventListener('keydown', attackInputs, true);
		}
		if (playerIndex === 2) {
			console.log(playerIndex);
			document.removeEventListener('keydown', attackInputs, true);
			document.addEventListener('keydown', defendInputs, true);
		}
		//playersRef.on("value", function(snapshot) {
		//all game logic should go hear I believe
		//no input functions just, attackPhase, startAttack, displayAttack, parryCheck
	}
	else if (currentPhase === "defendAttack"){
		if (playerIndex === 1) {
			console.log(playerIndex);
			document.removeEventListener('keydown', attackInputs, true);
			document.addEventListener('keydown', defendInputs, true);
		}
		if (playerIndex === 2) {
			console.log(playerIndex);
			document.removeEventListener('keydown', defendInputs, true);
			document.addEventListener('keydown', attackInputs, true);
		}
	}
});

//window states will be needed to determine when this is true for players
//document.addEventListener('keydown', attackInputs, true);

//document.addEventListener('keydown', defendInputs, false);

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
	//document.addEventListener('keydown', defendInputs, true);
	attackSetUpPhase = blankArray.slice(0, 6);
	//attackReady = attackSetUpPhase;
	if (currentPhase === "attackDefend"){
		playersRef.child("1").child("attackArray").set(playerOneData.attackArray = attackSetUpPhase);
	}
	else if (currentPhase === "defendAttack"){
		playersRef.child("2").child("attackArray").set(playerTwoData.attackArray = attackSetUpPhase);
	}
	blankArray = [];
	//startAttack();
	}
}

/*function startAttack () {
	x = 0;
	$("#attacks").empty();
	$("#attacks").append(attackReady[x]);
	attackTimer = setInterval(function(){displayAttack()},1000);
}*/

/*function displayAttack () {
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
	}*/

function parryCheck() {
	if (currentPhase === "attackDefend"){
		if (playerOneData.attackArray[x] === defendMechanic) {
			$("#message").text("Parried!");
		}
		else if (playerIndex === 2) {
			$("#message").text("You took a hit!");
		}
		else {
			$("#message").text("");
		}
	}
	if (currentPhase === "defendAttack"){
		if (playerTwoData.attackArray[x] === defendMechanic) {
			$("#message").text("Parried!");
		}
		else if (playerIndex === 1) {
			$("#message").text("You took a hit!");
		}
		else {
			$("#message").text("");
		}
	}
	defendMechanic = "";
}

});