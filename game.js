var Game = window.Game = {
	//quickPhase: 6,
	//stats: true,
	disableBears: false,
	//mamieBoost: 800,
	debug: false,
	started: false,
	width : 500,
	height : 300,
	scale: 2, // 1 or 2
	top: 100,
	over: false,
	bottom: 300
};
Game.canvasWidth = Game.width * Game.scale;
Game.canvasHeight = Game.height * Game.scale;
Game.startDoor = point(40,Game.top);
Game.endDoor = point(455,Game.top);

Game.start = function(){
	//console.log('game start');
	Game.started = true;
	Game.createBackground();

	Game.createBaseEntities();

	Game.actualTime = Date.now() * 0.001;
	Game.time = 0;
	
	
	if(!Game.quickPhase){
		Game.showFaceStack('0');
		Game.phase = -1;
		Game.nextPhase();
	}else{
		Game.phase = Game.quickPhase-1;
		Game.moune.hide = false;
		Game.mamie.hide = false;

		Game.nextPhase();
	}

	Game.tic();
};

Game.tic = function(){
	if(window.stats && Game.stats) stats.begin();


	if(Game.over){
		Game.render();
	}else{
		var nowTime = Date.now() * 0.001;
		var dt = nowTime - Game.actualTime;
		if(Game.showingFaces){
			Game.updateFace(dt);
			Game.render();
		}else{
			Game.time += dt;
			Game.update(dt);
			Game.render();

			Game.updatePhase();
			

			Game.prevPhaseTime = Game.phaseTime;
			Game.phaseTime += dt;
		}
		Game.actualTime = nowTime;
	}

	Game.flushKeys();

	if(window.stats && Game.stats) stats.end();
	requestAnimationFrame(Game.tic);
	
};



// ---------------------------------------------------------------------------------------------------------------------
// Entity Management
// ---------------------------------------------------------------------------------------------------------------------

Game.createBaseEntities = function(){
	Game.bears = [];
	Game.bearCount = {
		'bear': 0,
		'bear-big': 0,
		'bear-armor': 0
	};

	Game.arrows = [];

	Game.entities = [];
	Game.mamie = {
		type: 'mamie',
		right: true,
		hide: true,
		scared: false,
		speed: Game.mamieBoost ? Game.mamieBoost : 15,
		scaredSpeed: 200,
		rect: rect(Game.startDoor.x, Game.startDoor.y, 23, 10),
		skin: skin('mamie.png', 12, 45, 40, 60),
		animMap: { 'walk':[0,1,2], 'scared':[3,4] }
	};
	Game.setAnim(Game.mamie, 'walk');
	Game.addEntity(Game.mamie);

	var bagTexture = new PIXI.Texture(Game.textures['mamie-accessories.png']);
	bagTexture.setFrame( new PIXI.Rectangle(80,0,40,60));
	Game.mamieBag = new PIXI.Sprite(bagTexture);
	Game.mamieBag.visible = false;
	Game.mamie.sprite.addChild(Game.mamieBag);

	var baguetteTexture = new PIXI.Texture(Game.textures['mamie-accessories.png']);
	baguetteTexture.setFrame( new PIXI.Rectangle(40,0,40,60));
	Game.mamieBaguette = new PIXI.Sprite(baguetteTexture);
	Game.mamieBaguette.visible = false;
	Game.mamie.sprite.addChild(Game.mamieBaguette);

	Game.mamie.setAccessories = function(accessoryName){
		Game.mamieBaguette.visible = accessoryName == 'baguette';
		Game.mamieBag.visible = accessoryName == 'bag';
	};

	Game.moune = {
		type: 'moune',
		right: true,
		hide: true,
		speed: 180,
		rect: rect(Game.startDoor.x - Game.mamie.rect.width - 2, Game.startDoor.y, 23, 10),
		skin: skin('moune.png', 11, 47, 40, 60),
		animMap: { 'walk':[0,1,2,3] },
		currentSkin: 'moune'
	};
	Game.setAnim(Game.moune, 'walk');
	Game.addEntity(Game.moune);
	
	Game.swordAttack = {
		type: 'sword',
		endTime: 0,
		hide: true,
		duration: 0.15,
		delay: 0.0,
		rect: rect(0, 0, 20, 20),
		skin: skin('sword.png', 0, 15)
	};
	Game.addEntity(Game.swordAttack);

	Game.iceAttack = {
		type: 'ice',
		hide: true,
		rect: rect(0, 0, 30, 20),
		skin: skin('ice.png', 0, 8, 30, 20),
		animMap: { 'attack':[0,1,2,3] }
	};
	Game.setAnim(Game.iceAttack, 'attack');
	Game.addEntity(Game.iceAttack);
};

Game.setMouneSkin = function(skin){
	if( skin != Game.moune.currentSkin){
		Game.moune.currentSkin = skin;

		if(skin=='brave'){
			Game.moune.skin.imageName = 'brave.png';
			Game.moune.animMap = { 'walk':[0,1,2] };
		}else if(skin=='frozen'){
			Game.moune.skin.imageName = 'frozen.png';
			Game.moune.animMap = { 'walk':[0,1,2] };
		}else if(skin=='mulan'){
			Game.moune.skin.imageName = 'mulan.png';
			Game.moune.animMap = { 'walk':[0,1,2] };
		}
		Game.setAnim(Game.moune, 'walk');
		Game.moune.sprite.texture = Game.textures[Game.moune.skin.imageName];
	}
};

Game.addEntity = function(e){
	Game.entities.push(e);

	var sprite = new PIXI.Sprite( new PIXI.Texture(Game.textures[e.skin.imageName]));
	Game.container.addChild(sprite);
	e.sprite = sprite;
};

Game.removeEntity = function(e){
	Game.entities.splice(Game.entities.indexOf(e), 1);
	Game.container.removeChild(e.sprite);
};

Game.addArrow = function(){
	var arrow = {
		type: 'arrow',
		speed: 300,
		rect: rect(0, 0, 30, 20),
		skin: skin('arrow.png', 0, 0, 30, 20),
		animMap: { 'walk':[0,1,2] }
	};
	Game.setAnim(arrow,'walk');
	Game.addEntity(arrow);
	Game.arrows.push(arrow);
	return arrow;
};

Game.removeArrow = function(arrow){
	if(!arrow) throw new Error();
	Game.arrows.splice(Game.arrows.indexOf(arrow), 1);
	Game.removeEntity(arrow);
};

Game.addBear = function(options){
	if(Game.disableBears) return;

	var bear = {
		type: 'bear',
		scaredSpeed: 200,
		speed: 35,
		rect: rect(0, 0, 21, 20),
		skin: skin('ours.png', 10, 40, 40, 60),
		animMap: { 'walk':[0,1,2], 'scared':[3,4] }
	};
	if(options){
		if(options.type == 'bear-big'){
			bear = {
				type: 'bear-big',
				scaredSpeed: 200,
				speed: 30,
				rect: rect(0, 0, 40, 30),
				skin: skin('ours-big.png', 0, 30, 40, 60),
				animMap: { 'walk':[0,1,2], 'scared':[3,4] }
			};
		}else if(options.type == 'bear-armor'){
			bear = {
				type: 'bear-armor',
				scaredSpeed: 200,
				speed: 45,
				rect: rect(0, 0, 20, 20),
				skin: skin('ours-armor.png', 10, 40, 40, 60),
				animMap: { 'walk':[0,1,3,2], 'scared':[4,5,6] }
			};
		}
	}

	Game.setAnim(bear, 'walk');
	Game.addEntity(bear);
	Game.bears.push(bear);
	Game.bearCount[bear.type] ++;

	if(options && 'x' in options){
		bear.rect.x = options.x;
		bear.rect.y = options.y;
	}else{
		if(Math.random() > 0.6){
			//left/right
			bear.rect.y = Game.top + Math.random() * (Game.height - Game.top);
			if(Game.mamie.rect.x < Game.width/4){
				bear.rect.x = Game.width + bear.skin.offsetX;
				//console.log('add bear left',bear.rect);
			}else if(Game.mamie.rect.x < 3*Game.width/4){
				bear.rect.x = Math.random() > 0.5 ? Game.width + bear.skin.offsetX : - bear.skin.width;
				//console.log('add bear middle',bear.rect);
			}else{
				bear.rect.x = - bear.skin.width;
				//console.log('add bear right',bear.rect);
			}
		}else{
			//bottom
			bear.rect.y = Game.height + bear.skin.offsetY;
			bear.rect.x = Math.random() * (Game.width-bear.rect.width);
			//console.log('add bear bottom',bear.rect);
		}
	}
};

Game.removeBear = function(bear){
	if(!bear) throw new Error();
	Game.bears.splice(Game.bears.indexOf(bear), 1);
	Game.removeEntity(bear);
	Game.bearCount[bear.type] --;
};

Game.maintainBearCount = function(count, countBig, countArmor){
	var canAddBear = (!Game.addBearTime || Game.time > Game.addBearTime);
	if(canAddBear){
		if(canAddBear && Game.bearCount['bear-armor'] < countArmor){
			Game.addBearTime = Game.time + 1; //delay
			Game.addBear({type:'bear-armor'});
		}
		if(canAddBear && Game.bearCount['bear-big'] < countBig){
			Game.addBearTime = Game.time + 1; //delay
			Game.addBear({type:'bear-big'});
		}
		if(canAddBear && Game.bearCount['bear'] < count){
			Game.addBearTime = Game.time + 1; //delay
			Game.addBear();
		}
	}
};





// ---------------------------------------------------------------------------------------------------------------------
// UPDATE
// ---------------------------------------------------------------------------------------------------------------------

Game.update = function(dt){
	////console.log(Game.time);
	//update moune position
	var dx = 0;
	var dy = 0;
	if(Game.keys.left){
		dx = -1;
	}else if(Game.keys.right){
		dx = 1;
	}
	if(Game.keys.up){
		dy = -1;
	}else if(Game.keys.down){
		dy = 1;
	}
	if(dx || dy){
		if(dx * dy){
			dx *= DIAG_RATIO;
			dy *= DIAG_RATIO;
		}
		dx *= Game.moune.speed * dt; 
		dy *= Game.moune.speed * dt;
		Game.moveEntity(Game.moune, dx, dy);
	}

	//Sword attack
	var attacking = Game.swordAttack.endTime > Game.time;
	var canAttack = Game.swordAttack.endTime + Game.swordAttack.delay < Game.time;
	if(!attacking && canAttack && Game.moune.currentSkin == 'mulan'){
		if(Game.keysDown.space){
			//sword attack
			Game.swordAttack.endTime = Game.time + Game.swordAttack.duration; 
			attacking = true;
			Game.swordAttack.hide = false;
			Game.swordAttack.right = Game.moune.right;
		}
	}
	if(attacking){
		if(Game.swordAttack.right != Game.moune.right){
			//flip: interrupt attack
			Game.swordAttack.endTime = 0;
		}else{
			if(Game.swordAttack.right){
				Game.swordAttack.rect.x = Game.moune.rect.x + Game.moune.rect.width;
			}else{
				Game.swordAttack.rect.x = Game.moune.rect.x - Game.swordAttack.rect.width;
			}
			Game.swordAttack.rect.y = Game.moune.rect.y + Game.moune.rect.height - Game.swordAttack.rect.height;

			for(var i = 0, len = Game.bears.length; i<len; i++){
				var bear = Game.bears[i];
				if(!bear.scared && bear.type=='bear' && rectCollide(bear.rect, Game.swordAttack.rect)){
					bear.scared = true;
					bear.scaredDx = Game.moune.right ? 1 : -1;
					bear.scaredDy = Math.random()-0.5;
					Game.setAnim(bear, 'scared');
				}
			}
		}
	}else if(!Game.swordAttack.hide){
		Game.swordAttack.hide = true;
	}
	
	//bow
	if(Game.moune.currentSkin == 'brave'){
		if(Game.keysDown.space){
			var arrow = Game.addArrow();
			arrow.right = Game.moune.right;
			if(arrow.right){
				arrow.rect.x = Game.moune.rect.x +  Game.moune.rect.width;
			}else{
				arrow.rect.x = Game.moune.rect.x -  arrow.skin.width;
			}
			arrow.rect.y = Game.moune.rect.y - arrow.skin.height;
		}
	}
	
	//ice attack
	if(Game.moune.currentSkin == 'frozen' && Game.keys.space){
		Game.iceAttack.hide = false;
		Game.iceAttack.right = Game.moune.right;
		if(Game.iceAttack.right){
			Game.iceAttack.rect.x = Game.moune.rect.x + Game.moune.rect.width;
		}else{
			Game.iceAttack.rect.x = Game.moune.rect.x - Game.iceAttack.rect.width;
		}
		Game.iceAttack.rect.y = Game.moune.rect.y + Game.moune.rect.height - Game.iceAttack.rect.height;

		for(var i = 0, len = Game.bears.length; i<len; i++){
			var bear = Game.bears[i];
			if(!bear.scared && bear.type=='bear-armor' && rectCollide(bear.rect, Game.iceAttack.rect)){
				bear.scared = true;
				bear.scaredDx = Game.moune.right ? 1 : -1;
				bear.scaredDy = 0;
				Game.setAnim(bear, 'scared');
			}
		}
	}else{
		Game.iceAttack.hide = true;
	}

	//update mamie position
	if(Game.mamie.scared){
		if(Game.phase%2 == 0){
			Game.moveEntity(Game.mamie, -Game.mamie.scaredSpeed * dt, 0);
		}else{
			Game.moveEntity(Game.mamie, Game.mamie.scaredSpeed * dt, 0);
		}
		if(Game.progress <= 0){
			if(Game.mamie.scared && (!Game.mamie.scaredTime || Game.time > Game.mamie.scaredTime)){
				Game.mamie.scared = false;
				Game.setAnim(Game.mamie,'walk');
			}
		}
	}else if(Game.progress<1){
		if(Game.phase%2 == 0){
			Game.moveEntity(Game.mamie, Game.mamie.speed * dt, 0);
		}else{
			Game.moveEntity(Game.mamie, -Game.mamie.speed * dt, 0);
		}
	}

	//update bears
	for(var i = Game.bears.length-1; i>=0; i--){
		var bear = Game.bears[i];

		if(bear.scared){
			Game.moveEntity(bear, bear.scaredSpeed * dt * bear.scaredDx, bear.scaredSpeed * dt *bear.scaredDy);
			if(bear.rect.x > Game.width + 100 || bear.rect.x < -100){
				Game.removeBear(bear);
			}
		}else{
			if(Game.mamie.scared){
				//Game.moveEntity(bear, bear.speed * dt, 0);
			}else{
				if(rectCollide(Game.mamie.rect, bear.rect)){
					if(!Game.mamie.scared){
						Game.mamie.scared = true;
						Game.setAnim(Game.mamie,'scared');
					}
					Game.mamie.scaredTime = Game.time + 1;
				}else{
					var dist = tempPoint;
					dist.x = Game.mamie.rect.x - bear.rect.x;
					dist.y = (Game.mamie.rect.y + Game.mamie.rect.height) - (bear.rect.y + bear.rect.height); 
					normalize(dist, bear.speed * dt);
					Game.moveEntity(bear, dist.x, dist.y);
				}
			}
		}
	}

	//update arrows
	for(var i = Game.arrows.length-1; i>=0; i--){
		var arrow = Game.arrows[i];
		Game.moveEntity(arrow, arrow.speed * dt * (arrow.right ? 1 : -1), 0);
		for(var j = Game.bears.length-1; j>=0; j--){
			var bear = Game.bears[j];
			if(!bear.scared && bear.type=='bear-big' && rectCollide(bear.rect, arrow.rect)){
				bear.scared = true;
				bear.scaredDx = arrow.right ? 1 : -1;
				bear.scaredDy = 0;
				Game.setAnim(bear, 'scared');
			}
		}
		if(arrow.rect.x > Game.width + 100 || arrow.rect.x < -100){
			Game.removeArrow(arrow);
		}
	}

	//switch chars
	if(Game.phase >= 2){
		if(Game.keysDown["1"]){
			Game.setMouneSkin("mulan");
		}else if(Game.keysDown["2"]){
			Game.setMouneSkin("brave");
		}else if(Game.keysDown["3"] && Game.phase >= 3){
			Game.setMouneSkin("frozen");
		}
	}
};

Game.moveEntity = function(e, dx, dy){
	e.rect.x += dx;
	e.rect.y += dy;

	if(e==Game.moune || e==Game.mamie){
		if(e.rect.y < Game.top){
			e.rect.y = Game.top;
		}else if(e.rect.y + e.rect.height > Game.bottom){
			e.rect.y = Game.bottom - e.rect.height;
		}
		if(e.rect.x < 0){
			e.rect.x = 0;
		}else if(e.rect.x + e.rect.width > Game.width){
			e.rect.x = Game.width - e.rect.width;
		}
	}
	if(dx != 0){
		e.right = dx > 0;
	}
};



// ---------------------------------------------------------------------------------------------------------------------
// RENDER
// ---------------------------------------------------------------------------------------------------------------------

Game.render = function(){
	if(Game.debug){
		Game.graphics.clear();
		Game.graphics.lineStyle(1, 0x00ff00);
	}
	
	for(var i = 0, len = Game.entities.length; i<len; i++){
		var e = Game.entities[i];

		e.sprite.visible = !e.hide;
		e.sprite.y = e.rect.y - e.skin.offsetY;	
		if(e.right){
			e.sprite.x = e.rect.x - e.skin.offsetX;
		}else{
			e.sprite.x = e.rect.x + e.rect.width + e.skin.offsetX;
		}
		if(e.scared && e.type != 'bear-armor'){
			e.sprite.tint = 0xffaaaa; 
		}else{
			e.sprite.tint = 0xffffff;
		}

		if(e.animName){
			var frameList = e.animMap[e.animName];
			if(e.animFrameCount==0){
				e.sprite.texture.setFrame( new PIXI.Rectangle(
					e.skin.width * frameList[e.animFrameIndex],
					0,
					e.skin.width,
					e.skin.height
				));
			}
			e.animFrameCount++;
			if(e.animFrameCount > 8){
				e.animFrameCount = 0;
				e.animFrameIndex++;
				if(e.animFrameIndex >= frameList.length){
					e.animFrameIndex = 0;
				}
			}
			
			
		}

		//e.sprite.x = Math.round(e.sprite.x);
		//e.sprite.y = Math.round(e.sprite.y);

		if(e.right){
			e.sprite.scale.x = 1;
		}else{
			e.sprite.scale.x = -1;
		}

		if(Game.debug){
			var e = Game.entities[i];
			if(!e.hide){
				Game.graphics.drawRect(e.rect.x, e.rect.y, e.rect.width, e.rect.height);
			}
		}
	}

	
	Game.container.children.sort(function(e1,e2){
		return (e1.y + e1.height) - (e2.y + e2.height);
	});
	
	Game.renderer.render(Game.stage);
};

Game.createBackground = function(){
	var texture = Game.textures['bg.png'];
    var bg = new PIXI.Sprite(texture);
	Game.bgContainer.addChild(bg);

	var sepiaFilter = new PIXI.SepiaFilter();
	sepiaFilter.sepia = 0.5;
	bg.shader = sepiaFilter;  
};

Game.setAnim = function(e, animName){
	e.animName = animName;
	e.animFrameIndex = 0;
	e.animFrameCount = 0;
};