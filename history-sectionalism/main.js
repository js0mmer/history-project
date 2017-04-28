var fadePageId;
var fadeInId;
var fadeOutId;
var inFade = false;
var page = document.getElementById("main");
var nextPage;
var numPlayers = 0;
var turn = 0;
var players = [];
var maxPos = 18;
var currentQuestion1 = 0;
var currentQuestion2 = 0;
var correctAnswer;
var freeChoice = false;
var previousSpot;
var questionType;
var dieRolled = false;
var questions1 = ["What was the telegraph?", "What was morse code?", "What was the mechanical reaper", "How did steam powered factories differ from water powered factories?", "What was the transcontinental telegraph line?", "What new inventions were made for farming?", "How did the shift to steam powered factories lead to growth in cities?", "What inventions made life at home easier?"];
var questions2 = ["What invention did Samuel F.B. Morse create?", "What invention did Cyrus McCormick make?", "What invention by John Deere improved farming?", "What invention did Isaac Singer improve?", "What invention by Elias Howe made life at home easier?", "What invention did Alfred Lewis Vail create?", "What invention did Walter Hunt create?"];
var answers1 = ["The first way of instant long distance communication.", "The way of communicating on the telegraph.", "A machine that cut and harvested grains much faster.", "They did not need to be placed near a source of water. They could be built anywhere.", "A telegraph line running across the entire U.S.", "Steel plows and the Mechanical Reaper.", "Steam powered factories could be built anywhere so companies started building them near cities. People moved to cities to get factory jobs.", "Matches, the sewing machine, the safety pin, iceboxes and iron cookstoves"];
var answers2 = ["The Telegraph", "The Mechanical Reaper", "Steel Plows", "The Sewing Machine", "The Sewing Machine", "Morse Code", "The Safety Pin"];
var colors = ["red", "blue", "yellow", "limegreen", "orange", "purple", "pink", "brown", "black"];

function play() {
    shuffle(questions1, 1);
    shuffle(questions2, 2);
    nextPage = document.getElementById("players");
    
    transitionPage();
}

function rolldie() {
    if(dieRolled || inFade) {
        return;
    }
    
    previousSpot = players[turn].position;
    
    var i = getRandomInt(1, 6);
    document.getElementById("die").style.backgroundImage = "url('images/die_" + i + ".png')";
    dieRolled = true;
    
    if(players[turn].position + i >= 18) {
        players[turn].movePlayerTo(18);
        showMessage("Player " + (turn + 1) + " has won the game!", "limegreen", "bold", "forever");
        return;
    }
    
    players[turn].movePlayerTo(players[turn].position + i);
    var pos = players[turn].position;
    
    if(pos == 4 || pos == 12) {
        // 4 and 12 = free choice
        showMessage("You got a free choice!", "black", "400", 800);
        freeChoice = true;
        showQuestion(3);
    } else if(pos == 8 || pos == 16) {
        // 8 and 16 = free square
        showMessage("You got a free square!", "black", "400", 800);
        nextTurn();
    } else if(((pos / 2) + "").includes(".")) {
        // invention
        showMessage("You got an invention question!", "black", "400", 800);
        questionType = 1;
        showQuestion(1);
    } else {
        // inventor
        showMessage("You got an inventor question!", "black", "400", 800);
        questionType = 2;
        showQuestion(2);
    }
}

function answer(i) {
    if(inFade) {
        return;
    }
    
    if(freeChoice) {
        if(i == 0 || i == 2) {
            questionType = 2;
            showQuestion(2);
        } else {
            showQuestion(1);
            questionType = 1;
        }
        
        freeChoice = false;
        return;
    }
    
    if(correctAnswer == i) {
        showMessage("Correct!", "limegreen", "bold", 800);
    } else {
        showMessage("Incorrect", "red", "bold", 2200);
        if(questionType == 1) {
            subMessage("The correct answer was: " + answers1[currentQuestion1 - 1]);
        } else {
            subMessage("The correct answer was: " + answers2[currentQuestion2 - 1]);
        }
        
        players[turn].movePlayerTo(previousSpot);
    }
    
    nextTurn();
}

function nextTurn() {
    if(turn + 1 == numPlayers) {
        turn = 0;
    } else {
        turn++;
    }
    
    document.getElementById("answers").style.display = "none";
    document.getElementById("question").style.display = "none";
    document.getElementById("player").innerHTML = "Player " + (turn + 1);
    document.getElementById("player").style.color = colors[turn];
    dieRolled = false;
}

function showMessage(message, color, bold, waitTime) {
    inFade = true;
    document.getElementById("sub-message").style.display = "none";
    document.getElementById("message-text").innerHTML = message;
    document.getElementById("message-text").style.color = color;
    document.getElementById("message-text").style.fontWeight = bold;
    var mDiv = document.getElementById("message");
    mDiv.style.zIndex = 20;
    
    var pageOpacity = 0;
    fadeInId = setInterval(fadeIn, 30);
    
    function fadeIn() {
        pageOpacity += 1 / 30;
        
        mDiv.style.opacity = pageOpacity;
        
        if(mDiv.style.opacity >= 1) {
            mDiv.style.opacity = 1;
            
            if(waitTime != "forever") {
                setTimeout(wait, waitTime);
            }
            
            clearInterval(fadeInId);
        }
    }
    
    function wait() {
        fadeOutId = setInterval(fadeOut, 30);
    }
    
    function fadeOut() {
        pageOpacity -= 1 / 30;
        
        mDiv.style.opacity = pageOpacity;
        
        if(mDiv.style.opacity <= 0) {
            mDiv.style.opacity = 0;
            mDiv.style.zIndex = 0;
            
            clearInterval(fadeOutId);
            inFade = false;
        }
    }
}

function subMessage(msg) {
    document.getElementById("sub-message").innerHTML = msg;
    document.getElementById("sub-message").style.display = "block";
}

function showQuestion(type) {
    if(type == 1) {
        document.getElementById("question").innerHTML = questions1[currentQuestion1];
        var taken = [];
        for(var i = 0; i < 4; i++) {
            var rand = getRandomInt(0, answers1.length - 1);
            
            if(answers1[rand] == answers1[currentQuestion1]) {
                i--;
                continue;
            }
            
            if(taken.includes(rand)) {
                i--;
                continue;
            }
            
            document.getElementById("answer" + i).innerHTML = "<p>" + answers1[rand] + "</p>";
            taken.push(rand);
        }
        
        var rand = getRandomInt(0, 3);
        document.getElementById("answer" + rand).innerHTML = "<p>" + answers1[currentQuestion1] + "</p>";
        correctAnswer = rand;
        
        if(currentQuestion1 + 1 == questions1.length) {
            currentQuestion1 = 0;
        } else {
            currentQuestion1++;
        }
    } else if(type == 2) {
        document.getElementById("question").innerHTML = questions2[currentQuestion2];
        var taken = [];
        for(var i = 0; i < 4; i++) {
            var rand = getRandomInt(0, answers2.length - 1);
            
            if(answers2[rand] == answers2[currentQuestion2]) {
                i--;
                continue;
            }
            
            if(taken.includes(rand)) {
                i--;
                continue;
            }
            
            document.getElementById("answer" + i).innerHTML = "<p>" + answers2[rand] + "</p>";
            taken.push(rand);
        }
        
        var rand = getRandomInt(0, 3);
        document.getElementById("answer" + rand).innerHTML = "<p>" + answers2[currentQuestion2] + "</p>";
        correctAnswer = rand;
        
        if(currentQuestion2 + 1 == questions2.length) {
            currentQuestion2 = 0;
        } else {
            currentQuestion2++;
        }
    } else if(type == 3) {
        document.getElementById("question").innerHTML = "Inventor or invention question?";
        document.getElementById("answer" + 0).innerHTML = "<p>Inventor</p>";
        document.getElementById("answer" + 2).innerHTML = "<p>Inventor</p>";
        document.getElementById("answer" + 1).innerHTML = "<p>Invention</p>";
        document.getElementById("answer" + 3).innerHTML = "<p>Invention</p>";
    }
    
    document.getElementById("question").style.display = "block";
    document.getElementById("answers").style.display = "table";
}

function submitPlayers() {
    numPlayers = document.getElementById("player-form").value;
    for(var i = 0; i < numPlayers; i++) {
        var newPlayerEl = document.createElement("div");
        newPlayerEl.setAttribute("id", "p" + i);
        newPlayerEl.className = "player";
        newPlayerEl.style.backgroundColor = colors[i];
        var newPlayer = new Player(newPlayerEl);
        newPlayer.movePlayerTo(0);
        players.push(newPlayer);
    }
    
    nextPage = document.getElementById("game");
    
    transitionPage();
}
   
function Player(el) {
    this.position = 0;
    this.element = el;
    
    this.movePlayerTo = function(pos) {
        this.position = pos;
        document.getElementById(this.position + "").appendChild(this.element);
    }
}

function transitionPage() {
    inFade = true;
    var pageOpacity = 1;
    var nextPageOpacity = 0;
    
    fadePageId = setInterval(fadePage, 30);
    
    function fadePage() {
        pageOpacity -= 1 / 30;
        nextPageOpacity += 1 / 30;
        
        page.style.opacity = pageOpacity;
        nextPage.style.opacity = nextPageOpacity;
        
        if(page.style.opacity <= 0 && nextPage.style.opacity >= 1) {
            page.style.opacity = 0;
            page.style.zIndex = 0;
            nextPage.style.opacity = 1;
            nextPage.style.zIndex = 10;
            
            page = nextPage;
            
            clearInterval(fadePageId);
            inFade = false;
        }
    }
}

function shuffle(array, type) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        if(type == 1) {
            temporaryValue = answers1[currentIndex];
            answers1[currentIndex] = answers1[randomIndex];
            answers1[randomIndex] = temporaryValue;
        } else if(type == 2) {
            temporaryValue = answers2[currentIndex];
            answers2[currentIndex] = answers2[randomIndex];
            answers2[randomIndex] = temporaryValue;
        }
    }

    return array;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// debugging purposes
function printNumPlayers() {
    console.log(numPlayers);
}
