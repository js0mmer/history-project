var fadePageId;
var page = document.getElementById("main");
var nextPage;
var numPlayers = 0;
var turn = 0;
var players = [];
var maxPos = 18;
var questions1 = JSON.parse("json/questions.json")[0].inventors;
var questions2 = JSON.parse("json/questions.json")[0].inventions;
var answers1 = JSON.parse("json/answers.json")[0].inventors;
var answers2 = JSON.parse("json/answers.json")[0].inventions;

function play() {
    document.getElementById("watermark").style.display = "none";
    nextPage = document.getElementById("players");
    
    transitionPage();
}

function submitPlayers() {
    numPlayers = document.getElementById("player-form").value;
    for(var i = 0; i < numPlayers; i++) {
        var newPlayerEl = document.createElement("div");
        newPlayerEl.setAttribute("id", "p" + i);
        newPlayerEl.className = "player";
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
    
    this.getPosition = function() {
        return position;
    }
    
    this.setPosition = function(newPos) {
        this.position = newPos;
    }
    
    this.movePlayerTo = function(pos) {
        document.getElementById(pos).appendChild(this.element);
    }
}

function transitionPage() {
    var pageOpacity = 1;
    var nextPageOpacity = 0;
    
    fadePageId = setInterval(fadePage, 35);
    
    function fadePage() {
        pageOpacity -= 1 / 35;
        nextPageOpacity += 1 / 35;
        
        page.style.opacity = pageOpacity;
        nextPage.style.opacity = nextPageOpacity;
        
        if(page.style.opacity <= 0 && nextPage.style.opacity >= 1) {
            page.style.opacity = 0;
            page.style.zIndex = 0;
            nextPage.style.opacity = 1;
            nextPage.style.zIndex = 10;
            
            page = nextPage;
            
            clearInterval(fadePageId);
        }
    }
}

// debugging purposes
function printNumPlayers() {
    console.log(numPlayers);
}
