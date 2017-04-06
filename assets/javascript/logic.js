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

var attackSetUpPhase;

var attackReady;

var attackDisplay;

var attackTimer1;

var attackTimer2;

var defendMechanic;

var defendDisplay = [];

var x;

var y;

var hit1 = false;

var hit2 = false;

var hit3 = false;

var hit4 = false;

var hit5 = false;

//firebase variables below
var database = firebase.database();

var playersRef = database.ref("players");

var attack1Ref = database.ref("players/1/attackArray1");

var attack2Ref = database.ref("players/2/attackArray2");

var currentPhaseRef = database.ref("phase");

var currentPhase = null;

var username = "guest";

var playerIndex = false;
//determines which player you are, so eventListeners will depend on this

var numberOfPlayers = null;

var playerOne = false;

var playerTwo = false;

var playerOneAttack = null;

var playerTwoAttack = null;

var playerOneData = null;

var playerTwoData = null;

var peoplePlaying = null;
//no totally sure how this varialbe operates, but something like = 0 is 1 player, = 1 is 2 players

$("#hide_text").text("hide");

$("#hide_button").on("click", function(){
	$("#instructions_script").toggle();
	if ($("#hide_text").text() === "hide") {
		$("#hide_text").text("show");
	}
	else if ($("#hide_text").text() === "show") {
		$("#hide_text").text("hide");
	}
})

playersRef.on("value", function(snapshot) {
	peoplePlaying = snapshot.numChildren();

	playerOne = snapshot.child("1").exists();
	playerTwo = snapshot.child("2").exists();

	playerOneData = snapshot.child("1").val();
  	playerTwoData = snapshot.child("2").val();

  	playerOneAttack = snapshot.child("1/attackArray1").val();
  	playerTwoAttack = snapshot.child("2/attackArray2").val();
  	console.log(playerOneAttack);
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
		startingPhase();
		//currentPhaseRef.set("attackDefend");
	}
});

//attack1Ref.on("child_changed", function(snapshot){
	//playerOneAttack = snapshot.child("1/attackArray").val();
  	//playerTwoAttack = snapshot.child("2/attackArray").val();
  	//console.log(playerOneAttack);
//});

var startingPhase = function () {
	currentPhaseRef.set("attackDefend");
	startingPhase = function(){};
}

//child_changed might be jank code, player.ref(attackArray) starts off equal to false
//as soon as 5 attack inputs are made by player 1, attackArray "changes" thus we are able
//to use the event listener (for firebase) on("child_changed")
//wanted to use playersRef.attackArray.on("value")... in order to be specific.. but not sure how that code would look like

attack1Ref.on("value", function(snapshot){
	playerOneAttack = snapshot.val();
	console.log(playerOneAttack);
	//i.e. startAttack();
	setTimeout(function(){doThis()},1000);
		//console.log(playerOneData.attackArray);
		//console.log(snapshot);
	function doThis () {
	x = 0;
	$("#attacks").empty();
	if (currentPhase === "attackDefend"){
		$("#attacks").append(playerOneAttack[x]);
		console.log(playerOneAttack[x]);
		attackTimer1 = setInterval(function(){displayAttack1()},1000);
	}
	/*else if (currentPhase === "defendAttack"){
		$("#attacks").append(playerTwoAttack[x]);*/
		//console.log(playerTwoData.attackArray[x]);
		//attackTimer = setInterval(function(){displayAttack2()},1000);
	//}
}

	function displayAttack1 () {
		parryCheck1();
		x++;
		$("#attacks").empty();
		$("#attacks").append(playerOneAttack[x]);
		console.log(playerOneAttack[x]);

		if (x > 4){
			clearInterval(attackTimer1);
			setTimeout(function(){
			$("#attacks").empty();
			$("#message").text("");//},1000);
			//if ((currentPhase === "attackDefend") && (playerOne)){
				attack1Ref.set("     ");
				currentPhaseRef.set("defendAttack");
				console.log(currentPhase);
				//attack1Ref.disconnect();
			//}
			//else if ((currentPhase === "defendAttack") && (playerOne === false)){
				//currentPhaseRef.set("attackDefend");
				//console.log(currentPhase);
			},1000);
		//document.addEventListener('keydown', attackInputs, true);
		//document.removeEventListener('keydown', defendInputs, true);
		}
	}

	function parryCheck1() {
	if (currentPhase === "attackDefend"){
		if (playerOneAttack[x] === defendMechanic) {
			$("#message").text("Parried!");
			//basically if player 1 attacks, and p2 puts right input, p2 parries
		}
		else if (playerIndex === 2) {
		$("#message").text("You took a hit!");
			playersRef.child("2").child("health").set(playerTwoData.health - 5);
			if (playerTwoData.health <= 0) {
				alert("p1 wins!");
				//could set wins here,
				//could push wins from here to api
				//could append reset button, which is how you should do it
				// - > settimeout append reset button??
			}
		}
		else {
			$("#message").text("");
			//nothing should be shown for p1, prolly jank cause sometimes parry shows up
		}
	}
	defendMechanic = "";
}

});

attack2Ref.on("value", function(snapshot){
	playerTwoAttack = snapshot.val();
	//i.e. startAttack();
	setTimeout(function(){doThat()},1000);
		//console.log(playerOneData.attackArray);
		console.log(snapshot.val());
	function doThat () {
	y = 0;
	$("#attacks").empty();
	if (currentPhase === "defendAttack"){
		console.log(y);
		$("#attacks").append(playerTwoAttack[y]);
		attackTimer2 = setInterval(function(){displayAttack2()},1000);
}
	/*else if (currentPhase === "defendAttack"){
		$("#attacks").append(playerTwoData.attackArray[x]);
		console.log(playerTwoData.attackArray[x]);
		attackTimer = setInterval(function(){displayAttack2()},1000);
	}*/
	}

	function displayAttack2 () {
		parryCheck2();
		y++;
		$("#attacks").empty();
		$("#attacks").append(playerTwoAttack[y]);
		console.log(playerTwoAttack[y]);

		if (y > 4){
			clearInterval(attackTimer2);
			setTimeout(function(){
			$("#attacks").empty();
			$("#message").text("");//},1000);
			attack2Ref.remove();
			//if ((currentPhase === "attackDefend") && (playerOne === false)){
				//currentPhaseRef.set("defendAttack");
				//console.log(currentPhase);
			//}
			//else if ((currentPhase === "defendAttack") && (playerOne)){
				attack2Ref.set("     ");
				currentPhaseRef.set("attackDefend");
				console.log(currentPhase);
			},1000);
		//document.addEventListener('keydown', attackInputs, true);
		//document.removeEventListener('keydown', defendInputs, true);
		}
	}

	function parryCheck2 () {
	if (currentPhase === "defendAttack"){
		if (playerTwoAttack[y] === defendMechanic) {
			console.log(playerTwoAttack[y]);
			$("#message").text("Parried!");
		}
		else if (playerIndex === 1) {
			$("#message").text("You took a hit!");
			playersRef.child("1").child("health").set(playerOneData.health - 5);
			if (playerOneData.health <= 0) {
				alert("p2 wins!");
			}
		}
		else {
			$("#message").text("");
		}
	}
	defendMechanic = "";
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
      health: 100,
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
    //$("#player1-wins").text("Wins: " + playerOneData.wins);
    $("#p1-health").css('width', playerOneData.health+'%').attr('aria-valuenow', playerOneData.health);
    $("#player1-losses").text("Losses: " + playerOneData.losses);
  }
  else {
    // If there is no player 1, clear win/loss data and show waiting
    $("#player1-name").text("Waiting for Player 1");
    //$("#player1-wins").empty();
    $("#p1-health").css('width', 0+'%').attr('aria-valuenow', 0);
    //on disconnect health drops to zero, this could cause problems down the line, check back later
    $("#player1-losses").empty();
  }
  if (playerTwo) {
    $("#player2-name").text("Player 2 Rdy");
    //$("#player2-wins").text("Wins: " + playerTwoData.wins);
    $("#p2-health").css('width', playerTwoData.health+'%').attr('aria-valuenow', playerTwoData.health);
    $("#player2-losses").text("Losses: " + playerTwoData.losses);
  }
  else {
  	$("#player2-name").text("Waiting for Player 2");
    //$("#player2-wins").empty();
    $("#p2-health").css('width', 0+'%').attr('aria-valuenow', 0);
    $("#player2-losses").empty();
  }

});

//currentPhase.child("phase").set("attackDefend")

//document.addEventListener('keydown', attackInputs, true);

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
			console.log("we wanna see this");
		}
		if (playerIndex === 2) {
			console.log(playerIndex);
			document.removeEventListener('keydown', attackInputs, true);
			document.addEventListener('keydown', defendInputs, true);
			console.log("we wanna see this");
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
			console.log("we wanna see this");
		}
		if (playerIndex === 2) {
			console.log(playerIndex);
			document.removeEventListener('keydown', defendInputs, true);
			document.addEventListener('keydown', attackInputs, true);
			console.log("we wanna see this");
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
	console.log("hi");
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
		attack1Ref.set(attackSetUpPhase);
	}
	else if (currentPhase === "defendAttack"){
		attack2Ref.set(attackSetUpPhase);
	}
	blankArray = [];
	//startAttack();
	}
}

/*function parryCheck1() {
	if (currentPhase === "attackDefend"){
		if (playerOneAttack[x] === defendMechanic) {
			$("#message").text("Parried!");
			//basically if player 1 attacks, and p2 puts right input, p2 parries
		}
		else if (playerIndex === 2) {*/
			/*if (hit1 === false && hit2 === false && hit3 === false && hit4 === false && hit5 === false) {
				$("#message").text("You took a hit!");
				hit1 = true;
				playersRef.child("2").child("health").set(playerTwoData.health - 5);
			}
			else if (hit1 && hit2 === false && hit3 === false && hit4 === false && hit5 === false) {
				$("#message").text("You took a hit!");
				hit2 = true;
				playersRef.child("2").child("health").set(playerTwoData.health - 5);
				//etc.
			}
			else if (hit1 && hit2 && hit3 === false && hit4 === false && hit5 === false) {
				$("#message").text("You took a hit!");
				hit3 = true;
				playersRef.child("2").child("health").set(playerTwoData.health - 5);
				//etc.
			}
			else if (hit1 && hit2 && hit3 && hit4 === false && hit5 === false) {
				$("#message").text("You took a hit!");
				hit4 = true;
				playersRef.child("2").child("health").set(playerTwoData.health - 5);
				//etc.
			}
			else if (hit1 && hit2 && hit3 && hit4 && hit5 === false) {
				$("#message").text("You took a hit!");
				hit5 = true;
				playersRef.child("2").child("health").set(playerTwoData.health - 5);
				//etc.
			}
			else if (hit1 && hit2 && hit3 && hit4 && hit5) {
				x = 0;
				//wont need this else if code probably at all
			}*/
			//$("#message").text("You took a hit!");
			//playersRef.child("2").child("health").set(playerTwoData.health - 5);
		//}
		//else {
			//$("#message").text("");
			//nothing should be shown for p1, prolly jank cause sometimes parry shows up
		//}
	//}
	//defendMechanic = "";
//}

/*function parryCheck2 () {
	if (currentPhase === "defendAttack"){
		if (playerTwoAttack[y] === defendMechanic) {
			console.log(playerTwoAttack[y]);
			$("#message").text("Parried!");
		}
		else if (playerIndex === 1) {
			$("#message").text("You took a hit!");
			playersRef.child("1").child("health").set(playerOneData.health - 5);
		}
		else {
			$("#message").text("");
		}
	}
	defendMechanic = "";
}*/

});