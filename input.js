(function(){
	Game.keys = {};
	
	Game.flushKeys = function(){
		//called on tic
		Game.keysDown = {};
		Game.keysUp = {};
	}
	Game.flushKeys();

	
	var keyMap = {
		37: "left", // left arrow
		65: "left", // a
		81: "left", // q
		38: "up",   // up arrow
		90: "up",	// z
		87: "up",	// w
		83: "down",	// d
		40: "down",
		39: "right",// right arrow
		68: "right",//d
		32: "space",
		27: "esc",
		13: "enter",
		97: "1", 98:"2", 99:"3",
		49: "1", 50:"2", 51:"3"	
	};
	//Set up key listener
	function onkey(isDown, e) {
		if (!e) e = window.e;
		var c = e.keyCode;
		if (e.charCode && !c) c = e.charCode;
		console.log('key',c);

		var keyName = keyMap[c];
		if(keyName){
			Game.keys[keyName] = isDown;

			if(isDown){
				Game.keysDown[keyName] = Game.time;
			}else{
				Game.keysUp[keyName] = Game.time;
			}
		}
	}
	document.onkeyup = function(e){
		onkey(false, e);
	};
	document.onkeydown = function(e){
		if(!e.repeat){
			onkey(true, e);
		}
	};


})();