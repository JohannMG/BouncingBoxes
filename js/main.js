

var CLOCK; //var holds the interval refresh function 
var REFRESH_RATE = 55; //fps
var REFRESH_INTERVAL = Math.floor(1000 / REFRESH_RATE);  //frequency of updates per seconds to hit the DESIRED refresh LIMIT. 1000ms / rate
var frameCount = 0;
var COLLISION_BUFFER = 1; 
var FIELD = document.getElementById('field'); 
var running = false; 

//collection of all squares. faster than querying the DOM for each item
/*{
	'id': ID in DOM, 
	'posX': last updates x-coord (top-right anchor),
	'posY': last updates y-coord (top-right anchor),
	'velocityX': x-velocity, 
	'velocityY': y-velocity,
	'size': 50px,
	'DOMelement': Link to DOM element. for speed, always use this over a document query 
}
*/
var ACTIVE_SQUARES = []; 



//CALLED EVERY CYCLE
function updateBoxes() { 
	
	borderCollision(function(){
		
		ACTIVE_SQUARES.forEach(function moveBlock (element, index, arr){
			
			element.posX += element.velocityX;
			element.posY += element.velocityY;    
			
			element.DOMelement.style.left = element.posX + 'px';
			element.DOMelement.style.top = element.posY + 'px';
		}); 
		
		
	});

	document.getElementById('framecount').innerText = ++frameCount;


}


//pass a array of squares to check, returns true if any collisions found
//found collisions will be edited 
function borderCollision(_callback) {
	
	var fieldW = FIELD.clientWidth; 
	var fieldH = FIELD.clientHeight;
	var collisionFound = false;  
	
	ACTIVE_SQUARES.forEach(function(element, index, arr){
		
		//horizontal borders
		if ( element.posY <= (0 + COLLISION_BUFFER) ||
			 ((element.posY + element.size + COLLISION_BUFFER ) >= fieldH )
			){
				 element.velocityY *= -1; 
				 element.DOMelement.setAttribute('data-velocity-Y', element.velocityY); 
			}
		
		//vertical borders
		if ( element.posX <= (0 + COLLISION_BUFFER) ||
			 (element.posX + element.size + COLLISION_BUFFER) >= fieldW 
		){
			element.velocityX *= -1; 
			element.DOMelement.setAttribute('data-velocity-x', element.velocityX); 
		}
	}); 
	
	_callback(collisionFound); 

}


/*
send all integers. pixel suffixes will be added
adds to DOM and ACTIVE_SQUARES array
settings is an object to be passed with the following settings:
	posX
	posY
	velocityX (optional)
	velocityY (optional)
callback returns the new object {} with settings 
*/ 

function newSquare(settings, _callback) {
	
	//make auto-velocity negative about 50% of the time
	var neg = Math.random() > 0.5 ? 1 : -1; 
	
	var newData = {
		
		id: 'sq-'+ACTIVE_SQUARES.length, 
		posX: !isNaN(settings.posX) ? settings.posX : Math.random() * (FIELD.clientWidth - 50),
		posY: !isNaN(settings.posY) ? settings.posY : Math.random() * (FIELD.clientHeight - 50),
		velocityX : settings.velocityX || ( neg * Math.random() * 3 ) ,
		velocityY : settings.velocityY || ( neg * Math.random() * 3 ) ,
		size: 50
	};
	
	var newelement = document.createElement('div'); 
	newelement.setAttribute('id', newData.id  );
	newelement.setAttribute('class', 'bouncing-box' );
	newelement.setAttribute('data-velocity-X', newData.velocityX );
	newelement.setAttribute('data-velocity-Y', newData.velocityY );
	newelement.style.left = newData.posX + 'px'; 
	newelement.style.top = newData.posY + 'px'; 
	
	newData.DOMelement = newelement; 
	
	ACTIVE_SQUARES.push(newData);
	FIELD.appendChild(newelement); 
	
	if (_callback) { _callback(newData); } 

}

function clickBox(element){
	
	var boxID = element.id; 
	
	var square1 = ACTIVE_SQUARES.filter(function(element, index, array){
		return (element.id === boxID);
	});
	
	//double check something found
	if ( !square1 ) { return; }
	square1 = square1[0];
	
	newSquare({
		posX: square1.posX,
		posY: square1.posY, 
		velocityX: square1.velocityX * 2,
		velocityY: square1.velocityY  *2
	}); 
	
	console.log(square1);
	
}


//INITIAL SET. open for reuse
function __init__() {
	
	CLOCK = setInterval(updateBoxes, REFRESH_INTERVAL);
	newSquare({ posX: 10, posY: 10}) ; 
	running = true; 
}


///EVENT LISTENERS----------
document.addEventListener("DOMContentLoaded", function (event) {
	__init__();
});


document.getElementById('field').addEventListener('click', function(event){
	if (event.srcElement.className === 'bouncing-box'){
		clickBox(event.srcElement); 
	}
});




///BUTTONS--------------

document.getElementById('start').addEventListener("click", function (event) {
	__init__();
});


document.getElementById('stop').addEventListener("click", function (event) {
	clearInterval(CLOCK);
	FIELD.innerHTML = '';
	ACTIVE_SQUARES = []; 
});  

document.getElementById('stop-clock').addEventListener("click", function(event){
	if (running){
		clearInterval(CLOCK);
	}else{
		CLOCK = setInterval(updateBoxes, REFRESH_INTERVAL);
	}
	
	running = !running;
}); 

document.getElementById('add-box').addEventListener("click", function (event) {
	newSquare({}); 
});
