// ---------------------------------------------------------------------------------------------------------------------
// PHASES
// ---------------------------------------------------------------------------------------------------------------------

Game.updatePhase = function(){
	if(Game.phaseDirectionRight){
		Game.progress = 1-(Game.endDoor.x - Game.mamie.rect.x) / ( Game.endDoor.x -Game.startDoor.x);
	}else{
		Game.progress = (Game.endDoor.x - Game.mamie.rect.x) / ( Game.endDoor.x -Game.startDoor.x);
	}
	if(Game.maxProgress < Game.progress){
		Game.maxProgress = Game.progress;
	}
	//console.log('progress',Game.progress, Game.phase);
	//if(Game.updatePhases[Game.phase]){
		Game.updatePhases[Game.phase]();
	//}
};

Game.updatePhases = {
	0 : function(){
		//First trip
		if(!Game.events){
			//init
			Game.moune.hide = false;
			Game.mamie.hide = false;
			Game.mamie.setAccessories();
			Game.events = [
				{ progress: 0.48, execute:Game.addBear, args:[{x:Game.width, y:Game.top + (Game.height-Game.top)*0.1 }] },
				{ progress: 0.51, execute:Game.showFaceStack, args:['0-1'] }
			];
		}

		Game.processPhaseEvents();

		if(Game.progress < 1){
			if( Game.progress > 0.51 && Game.bears.length==0 && Game.progress<0.5 ||
				Game.progress > 0.7 && Game.progress < 0.8){
				Game.maintainBearCount(4);
			}else if(Game.progress > 0.8){
				Game.maintainBearCount(8);
			}
		}else{
			if(Game.bears.length == 0){
				Game.nextPhase();
				Game.mamie.hide = true;
				Game.showFaceStack('0-2');
			}
		}
	},
	1 : function(){
		//back for wallet
		if(!Game.events){
			Game.mamie.hide = false;
			Game.mamie.setAccessories();
			Game.events = [
				{ progress: 0.18, execute:Game.addBear, args:[{x:-60, y:Game.top + (Game.height-Game.top)*0.1, type:'bear-big' }] },
				{ progress: 0.21, execute:Game.showFaceStack, args:['1-1'] }
			];
		}

		Game.processPhaseEvents();

		if(Game.progress < 1){
			if( Game.progress > 0.21 && Game.bears.length==0 && Game.progress<0.5 ||
				Game.progress > 0.25 && Game.progress < 0.5){
				Game.maintainBearCount(0,4);
			}else if(Game.progress > 0.5){
				Game.maintainBearCount(0,8);
			}
		}else{
			if(Game.bears.length == 0){
				Game.nextPhase();
				Game.mamie.hide = true;
				Game.showFaceStack('1');
			}
		}
	},
	2 : function(){
		// second trip
		if(!Game.events){
			//init
			Game.moune.hide = false;
			Game.mamie.hide = false;
			Game.mamie.setAccessories('bag');
			Game.events = [
				{ progress: 0.18, execute:Game.addBear, args:[{x:Game.width, y:Game.top + (Game.height-Game.top)*0.1 }] },
				{ progress: 0.18, execute:Game.addBear, args:[{x:Game.width, y:Game.top + (Game.height-Game.top)*0.1 + 50, type:'bear-big' }] },
				{ progress: 0.21, execute:Game.showFaceStack, args:['2-1'] }
			];
		}

		Game.processPhaseEvents();

		if(Game.progress < 1){
			if( Game.progress > 0.21 && Game.bears.length==0 && Game.progress<0.5 ||
				Game.progress > 0.25 && Game.progress < 0.5){
				Game.maintainBearCount(2,2);
			}else if(Game.progress > 0.5){
				Game.maintainBearCount(3,3);
			}
		}else{
			if(Game.bears.length == 0){
				Game.nextPhase();
				Game.mamie.hide = true;
				Game.showFaceStack('2');
			}
		}
		/*
		// second trip
		if(!Game.events){
			Game.mamie.hide = false;
			Game.events = [];
		}

		Game.maintainBearCount(7);

		if(Game.progress >= 1){
			Game.nextPhase();
			Game.mamie.hide = true;
			Game.showFaceStack('2');
		}
		*/
	},
	3 : function(){
		//back with baguette
		if(!Game.events){
			Game.mamie.hide = false;
			Game.mamie.setAccessories('baguette');
			Game.events = [
				{ progress: 0.18, execute:Game.addBear, args:[{x:-40, y:Game.top + (Game.height-Game.top)*0.1, type:'bear-armor' }] },
				{ progress: 0.21, execute:Game.showFaceStack, args:['3-1'] }
			];
		}

		Game.processPhaseEvents();

		if(Game.progress < 1){
			if( Game.progress > 0.21 && Game.bears.length==0 && Game.progress<0.5 ||
				Game.progress > 0.25 && Game.progress < 0.5){
				Game.maintainBearCount(0,0,4);
			}else if(Game.progress > 0.5){
				Game.maintainBearCount(0,0,8);
			}
		}else{
			if(Game.bears.length == 0){
				Game.nextPhase();
				Game.mamie.hide = true;
				Game.showFaceStack('3');
			}
		}
	},
	4 : function(){
		//third trip
		if(!Game.events){
			Game.mamie.hide = false;
			Game.mamie.setAccessories();
			Game.events = [];
		}

		if(Game.progress < 1){
			Game.maintainBearCount(3,0,3);
		}else{
			if(Game.bears.length == 0){
				Game.nextPhase();
				Game.mamie.hide = true;
				Game.showFaceStack('4');
			}
		}
	},
	5 : function(){
		//back home back with bag -> stolen baguette
		if(!Game.events){
			Game.mamie.hide = false;
			Game.mamie.setAccessories('bag');
			Game.events = [];
		}

		if(Game.progress < 1){
			Game.maintainBearCount(2,1,1);
		}else{
			if(Game.bears.length == 0){
				Game.nextPhase();
				Game.mamie.hide = true;
				Game.showFaceStack('5');
			}
		}
	},
	6 : function(){
		//fourth trip
		if(!Game.events){
			Game.mamie.hide = false;
			Game.mamie.setAccessories();
			Game.events = [];
		}

		if(Game.progress < 1){
			Game.maintainBearCount(2,2,2);
		}else{
			if(Game.bears.length == 0){
				Game.nextPhase();
				Game.mamie.hide = true;
				Game.showFaceStack('6');
			}
		}
	},
	7 : function(){
		//back home -> forgotten wallet again
		if(!Game.events){
			Game.mamie.hide = false;
			Game.events = [];
		}

		if(Game.progress < 1){
			Game.maintainBearCount(3,2,2);
		}else{
			if(Game.bears.length == 0){
				Game.nextPhase();
				Game.mamie.hide = true;
				Game.showFaceStack('7');
			}
		}
	},
	8 : function(){
		//fifth trip
		if(!Game.events){
			Game.mamie.setAccessories('bag');
			Game.mamie.hide = false;
			Game.events = [];
		}

		if(Game.progress < 1){
			Game.maintainBearCount(3,3,2);
		}else{
			if(Game.bears.length == 0){
				Game.nextPhase();
				Game.mamie.hide = true;
				Game.showFaceStack('8');
			}
		}
	},
	9 : function(){
		//back home - then end
		if(!Game.events){
			Game.mamie.setAccessories('bag');
			Game.mamie.hide = false;
			Game.events = [];
		}

		if(Game.progress < 1){
			Game.maintainBearCount(3,3,3);
		}else{
			if(Game.bears.length == 0){
				Game.nextPhase();
				Game.mamie.hide = true;
				Game.showFaceStack('9');
			}
		}
	}
};

Game.nextPhase = function(){
	Game.phase ++;
	Game.phaseTime = 0;
	Game.phaseDirectionRight = Game.phase % 2 == 0;
	Game.mamie.rect.x = Game.phaseDirectionRight % 2 ? Game.startDoor.x : Game.endDoor.x;
	Game.progress = 0;
	Game.maxProgress = 0;
	Game.events = null;
};

Game.processPhaseEvents = function(){
	if(Game.events.length > 0){
		for(var i=0, len=Game.events.length; i<len; i++){
			var e = Game.events[i];
			if(e && Game.progress > e.progress){
				//console.log('Execute event',e,'current progress',Game.progress);
				e.execute.apply(null, e.args);
				Game.events[i] = null;
			}
		}
	}
};
