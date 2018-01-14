var counter = 0, prevCount=0, ctxL=128, plusOneSpeed=5, plusOneY=70;
var timer, ctx;
var plusOnes = [];
var loginDataCache;
var defaultLogin={
	id:"0", username:"test0", password:"test1230", options:["0","0","0"], bank:"0", theme:"0",
};
function init(loginData) {		
			loginDataCache=loginData;	
			document.getElementById("lastScore").innerHTML = "Last score: " + loginData.bank.toString();
            document.getElementById("theCookie").onclick = function() {cookieClickEvent()};
			timer = new Date();
			timer=timer.getTime()/1000;			
			ctx = document.getElementById("ctx").getContext("2d");			
			ctx.font = '16px Arial';
			ctx.fillStyle = 'white';
		}
		
window.onload = processUser;
function PlusOne(x,y){this.x=x; this.y=y;}
function cookieClickEvent(){
	counter = counter + 1;
	document.getElementById("counter").innerHTML = "Cookies in bank: " + counter;
	var obj = new PlusOne(Math.floor((Math.random() * 100) + 20),plusOneY);
	plusOnes.push(obj);
	}

function processUser(){
	var login=["test0","test1230"];
	if(location.search.substring(1)){
    var parameters = location.search.substring(1).split("&");
    var temp = parameters[0].split("=");
    login[0] = unescape(temp[1]);
    temp = parameters[1].split("=");
    login[1] = unescape(temp[1]);
	}
	getData(login[0], login[1]);
  }	
	
function getData(user, psw) {
    fetch('http://localhost:3000/data')
        .then(function (response) {
			if(response.ok) {
				return response.json();
			}
			//throw new Error('Network response was not ok.');
			if(!response.ok){
				init(defaultLogin);
			}
			}).then(function (data) {
                for(var i=0;i<data.length;i++){
					if(data[i].username === user && data[i].password === psw){
						init(data[i]);
						console.log(data[i]);
						return;
						}
				}
				createAccount(user, psw, data.length);
				return;
            });
};

function createAccount(user, psw, id){
	console.log("CREATE");
	var newLogin=defaultLogin;
	newLogin.username=user.toString();
	newLogin.password=psw.toString();
	newLogin.id=id.toString();
	var xmlhttp = new XMLHttpRequest(); 
	xmlhttp.open("POST", "http://localhost:3000/data/");
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify(newLogin));
	init(newLogin);
}

function setMember(key,value){
	loginDataCache[key]=value;
	var xmlhttp = new XMLHttpRequest(); 
	var url="http://localhost:3000/data/"+loginDataCache.id;
	console.log(url);
	
	xmlhttp.open("PUT", url);
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.send(JSON.stringify(loginDataCache));
}

function myFunction() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

var intervalID = setInterval(function(){
	var d = new Date();
	d=Math.floor(d.getTime()/1000 - timer);
	document.getElementById("timer").innerHTML = "Run started: " + Math.floor(d/60) + " minutes, " + Math.floor(d%60) + " seconds ago";
	document.getElementById("perSec").innerHTML = "Cookies per second: " + (counter-prevCount);
	prevCount = counter;
	if(counter>0)
		setMember("bank",counter.toString());
}, 1000);

var updateID = setInterval(function(){
	ctx.clearRect(0,0,ctxL,ctxL);
	for(var i=0;i<plusOnes.length;i++){
		
		if(plusOnes[i].y>0){
			plusOnes[i].y-=plusOneSpeed;
			ctx.fillText('+1',plusOnes[i].x,plusOnes[i].y);
		}
		else
			plusOnes.splice(i,1);
	}
}, 60);
