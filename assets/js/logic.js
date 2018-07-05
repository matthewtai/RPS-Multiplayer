// Initialize Firebase

var config = {
	apiKey: "AIzaSyA4NuqYLrMPlhfUGBgEkQqgj6qQ4ILfNq0",
	authDomain: "scsbootcamp.firebaseapp.com",
	databaseURL: "https://scsbootcamp.firebaseio.com",
	projectId: "scsbootcamp",
	storageBucket: "scsbootcamp.appspot.com",
	messagingSenderId: "609288541479"
};
firebase.initializeApp(config);


//database reference
var database = firebase.database();
var PlayerName = '';
var user_1_Name = "";
var user_2_Name = "";
var user_1_Choice = "";
var user_2_Choice = "";
var newMessage = "";
var player_1_win = 0;
var player_1_lose = 0;
var player_2_win = 0;
var player_2_lose = 0;
var turns = 1;
var delayTimer;
var delayTimer2;
var IsGameResetting = false;


$(document).ready(function () {


	var CheckWinners = {

		resetGame: function () {
			IsGameResetting = false;
			turns = 1;

			database.ref().update({
				turn: turns
			});
		},

		clearDelay: function () {
			clearTimeout(delayTimer);
			CheckWinners.resetGame();
		},

		updateWinner1: function () {
			$("#winner").html(user_1_Name + " wins!!");
		},

		updateWinner2: function () {
			$("#winner").html(user_2_Name + " wins!!");
		},

		updateScore: function () {
			database.ref("players/1").update({
				win: player_1_win,
				lose: player_1_lose,
			});
			database.ref("players/2").update({
				win: player_2_win,
				lose: player_2_lose,
			});
		},

		playerSocre: function () {

			if (user_1_Choice == "rock" && user_2_Choice == "scissors") {
				player_1_win++;
				player_2_lose++;
				CheckWinners.updateWinner1();
				CheckWinners.updateScore();
			}

			if (user_1_Choice == "rock" && user_2_Choice == "paper") {
				player_1_lose++;
				player_2_win++;
				CheckWinners.updateWinner2();
				CheckWinners.updateScore();
			}

			if (user_1_Choice == "scissors" && user_2_Choice == "rock") {
				player_1_lose++;
				player_2_win++;
				CheckWinners.updateWinner2();
				CheckWinners.updateScore();
			}

			if (user_1_Choice == "scissors" && user_2_Choice == "paper") {
				player_1_win++;
				player_2_lose++;
				CheckWinners.updateWinner1();
				CheckWinners.updateScore();
			}

			if (user_1_Choice == "paper" && user_2_Choice == "rock") {
				player_1_win++;
				player_2_lose++;
				CheckWinners.updateWinner1();
				CheckWinners.updateScore();
			}

			if (user_1_Choice == "paper" && user_2_Choice == "scissors") {
				player_1_lose++;
				player_2_win++;
				CheckWinners.updateWinner2();
				CheckWinners.updateScore();
			}

			if (user_1_Choice == user_2_Choice) {
				$("#winner").html("It's a tie!");
			}

		}
	}



	$("#greetings").html("<h2>Enter Your Name to Play</h2>" +
		"</br><input type='text' id='name-input'>" +
		"</br></br><button class = 'btn btn-default' input type='submit' id='submit-name'>Submit</button>");
	$("#waiting1").html("Waiting for player 1");
	$("#waiting2").html("Waiting for player 2");


	function hidden() {
		$("#player1choices").attr("style", "visibility:hidden");
		$("#player2choices").attr("style", "visibility:hidden");
		$("#group2message").attr("style", "visibility:hidden");
		$("#group1message").attr("style", "visibility:hidden");
	}
	hidden();


	database.ref().on("value", function (snapshot) {

		function playerDisconnect() {
			if (PlayerName != "") {

				if ((snapshot.child("players").child(1).exists()) && (PlayerName == snapshot.child("players").child(1).val().name)) {

					database.ref("/chat").onDisconnect().update({
						message: ((snapshot.child("players").child(1).val().name) + " has been disconnected!"),
						dateAdded: firebase.database.ServerValue.TIMESTAMP
					});

					database.ref("players/1").onDisconnect().remove();

				} else if ((snapshot.child("players").child(2).exists()) && (PlayerName == snapshot.child("players").child(2).val().name)) {

					database.ref("/chat").onDisconnect().update({
						message: ((snapshot.child("players").child(2).val().name) + " has been disconnected!"),
						dateAdded: firebase.database.ServerValue.TIMESTAMP
					});
					database.ref("players/2").onDisconnect().remove();

					database.ref("/turn").onDisconnect().remove();
				}
			}
		}


		if (((snapshot.child("players").child(1).exists()) == false)) {
			$("#waiting1").html("Waiting for player 1");
			$("#winner").empty();
			$("#win1").empty();
			$("#lose1").empty();
			$("#player1-name").empty();
			$("#whose-turn").empty();
			$("#player-1").attr("style", "border: 5px solid white");
			$("#player-2").attr("style", "border: 5px solid white");

		};

		if (((snapshot.child("players").child(2).exists()) == false)) {
			$("#waiting2").html("Waiting for player 2");
			$("#winner").empty();
			$("#win2").empty();
			$("#lose2").empty();
			$("#player2-name").empty();
			$("#whose-turn").empty();
			$("#player-1").attr("style", "border: 5px solid white");
			$("#player-2").attr("style", "border: 5px solid white");
		};

		if ((snapshot.child("players").child(2).exists()) && ((snapshot.child("players").child(1).exists()) === false)) {
			$("#player2-name").html(snapshot.child("players").child(2).val().name);
			$("#waiting2").empty();
			$("#player-1").attr("style", "border: 5px solid white");
			$("#player-2").attr("style", "border: 5px solid white");
			hidden();

			playerDisconnect();
		};

		if ((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()) === false)) {
			$("#waiting1").empty();
			$("#player1-name").html(snapshot.child("players").child(1).val().name);
			hidden();

			playerDisconnect();

			if (PlayerName == snapshot.child("players").child(1).val().name) {
				$("#greetings").html("<h2>Hello " + snapshot.child("players").child(1).val().name + ".  You are player 1!</h2>");
				$("#win1").html("WIN: " + player_1_win);
				$("#lose1").html("LOSE: " + player_1_lose);
			}

		} else if ((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()))) {

			var databaseTurn = snapshot.child("turn").val();
			user_1_Name = snapshot.child("players").child(1).val().name;
			user_2_Name = snapshot.child("players").child(2).val().name;

			$("#waiting2").empty();
			$("#waiting1").empty();
			$("#player2-name").html(snapshot.child("players").child(2).val().name);
			$("#player1-name").html(snapshot.child("players").child(1).val().name);
			$("#win2").html("WIN: " + snapshot.child("players").child(2).val().win);
			$("#lose2").html("LOSE: " + snapshot.child("players").child(2).val().lose);
			$("#win1").html("WIN: " + snapshot.child("players").child(1).val().win);
			$("#lose1").html("LOSE: " + snapshot.child("players").child(1).val().lose);

			playerDisconnect();


			if ((PlayerName == snapshot.child("players").child(1).val().name) && (databaseTurn == 1)) {
				$("#greetings").html("<h2>Hello " + snapshot.child("players").child(1).val().name + ".  You are player 1!</h2>");
				$("#player-1").attr("style", "border: 5px solid yellow");
				$("#player-2").attr("style", "border: 5px solid white");
				hidden();
				$("#player1choices").attr("style", "visibility:visible");
				$("#rock1").html("ROCK");
				$("#paper1").html("PAPER");
				$("#scissors1").html("SCISSORS");
				$("#winner").empty();
				$("#whose-turn").html("It's your turn!");
			}

			if ((PlayerName == snapshot.child("players").child(1).val().name) && (databaseTurn == 2)) { //after player 1 picks
				$("#player-1").attr("style", "border: 5px solid white");
				$("#player-2").attr("style", "border: 5px solid yellow");
				hidden();
				$("#group1message").attr("style", "visibility:visible");
				$("#group1message").html("Chose: " + "<h2>" + user_1_Choice + "</h2>");
				$("#whose-turn").html("Waiting for " + user_2_Name + " to choose...");
			}


			if ((PlayerName == snapshot.child("players").child(2).val().name) && (databaseTurn == 1)) {
				$("#greetings").html("<h2>Hello " + snapshot.child("players").child(2).val().name + ".  You are player 2!</h2>");
				$("#player-1").attr("style", "border: 5px solid yellow");
				$("#player-2").attr("style", "border: 5px solid white");
				$("#whose-turn").html("Wating for " + user_1_Name + " to choose!!");
				hidden();
				$("#winner").empty();
			}

			if ((PlayerName == snapshot.child("players").child(2).val().name) && (databaseTurn == 2)) {
				$("#player-1").attr("style", "border: 5px solid white");
				$("#player-2").attr("style", "border: 2px solid yellow");
				$("#whose-turn").html("It is your turn!");
				hidden();
				$("#player2choices").attr("style", "visibility:visible");
				$("#rock2").html("ROCK");
				$("#paper2").html("PAPER");
				$("#scissors2").html("SCISSORS");
			}

			if (databaseTurn == 3 && IsGameResetting == false) {
				IsGameResetting = true;

				user_1_Choice = snapshot.child("players").child(1).val().choice;
				user_2_Choice = snapshot.child("players").child(2).val().choice;
				player_1_win = snapshot.child("players").child(1).val().win;
				player_1_lose = snapshot.child("players").child(1).val().lose;
				player_2_win = snapshot.child("players").child(2).val().win;
				player_2_lose = snapshot.child("players").child(2).val().lose;

				$("#player-1").attr("style", "border: 5px solid white");
				$("#player-2").attr("style", "border: 5px solid white");
				$("#player2choices").attr("style", "visibility:hidden");
				$("#player1choices").attr("style", "visibility:hidden");
				$("#group2message").attr("style", "visibility:visible");
				$("#group1message").attr("style", "visibility:visible");
				$("#group1message").html("Chose: " + "<h2>" + user_1_Choice + "</h2>");
				$("#group2message").html("Chose: " + "<h2>" + user_2_Choice + "</h2>");
				$("#whose-turn").empty();

				CheckWinners.playerSocre();

				delayTimer = setTimeout(CheckWinners.clearDelay, 5 * 1000);
			}
		}
	});

	$("#submit-name").on("click", function () {

		var username = $("#name-input").val().trim();

		PlayerName = username;
		console.log(username);


		database.ref().once('value').then(function (snapshot) {

			if ((snapshot.child("players").child(1).exists()) === false) {
				database.ref("players/1").set({
					name: username,
					win: player_1_win,
					lose: player_1_lose
				});

			} else if ((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()) === false)) {
				database.ref("players/2").set({
					name: username,
					win: player_2_win,
					lose: player_2_lose
				});
				database.ref().update({
					turn: turns,
				});

			} else if ((snapshot.child("players").child(1).exists()) && (snapshot.child("players").child(2).exists())) {
				alert("There are two players playing! Try again later!");
			}
		});
	});


	$(".choice1").on("click", function () {

		user_1_Choice = $(this).val();
		console.log(user_1_Choice);

		database.ref().once('value').then(function (snapshot) {

			turns = (snapshot.child("turn").exists() ? snapshot.child("turn").val() : turns);
			turns++;


			if ((PlayerName == snapshot.child("players").child(1).val().name)) {
				database.ref("players/1").update({
					choice: user_1_Choice,
				});

				database.ref().update({
					turn: turns
				});
			}
		});
	});

	$(".choice2").on("click", function () {

		user_2_Choice = $(this).val();
		console.log(user_2_Choice);

		database.ref().once('value').then(function (snapshot) {

			turns = (snapshot.child("turn").exists() ? snapshot.child("turn").val() : turns);
			turns++;


			if ((PlayerName == snapshot.child("players").child(2).val().name)) {
				database.ref("players/2").update({
					choice: user_2_Choice,
				});

				database.ref().update({
					turn: turns,
				});
			}
		});
	});


	$("#submit-chat").on("click", function (event) {

		event.preventDefault();
		console.log(this);

		var messages = $("#chat-input").val().trim();
		$("#chat-input").val("");


		newMessage = PlayerName + " : " + messages;


		database.ref("/chat").update({
			message: newMessage,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});
	});


	database.ref("/chat").orderByChild("dateAdded").limitToLast(1).on("value", function (snapshot) {
		$("#chat-window").append("</br>" + snapshot.val().message + "</br>");
	});

});