(function Main_js(){
	
	window.onload = function onWindowLoad(){
		Game.div = document.getElementById('game-holder');
		

		//Prepare pixi stage
		PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

		Game.stage = new PIXI.Stage(0x34495e);
		Game.renderer = PIXI.autoDetectRenderer(Game.canvasWidth, Game.canvasHeight);
		Game.div.appendChild(Game.renderer.view);

		Game.bgContainer = new PIXI.DisplayObjectContainer();
		Game.bgContainer.scale.x = Game.bgContainer.scale.y = Game.scale;
		Game.stage.addChild(Game.bgContainer);

		Game.container = new PIXI.DisplayObjectContainer();
		Game.container.scale.x = Game.container.scale.y = Game.scale;
		Game.stage.addChild(Game.container);

		Game.uiContainer = new PIXI.DisplayObjectContainer();
		Game.uiContainer.scale.x = Game.uiContainer.scale.y = Game.scale;
		Game.stage.addChild(Game.uiContainer);

		Game.graphics = new PIXI.Graphics();
		Game.stage.addChild(Game.graphics);
		Game.graphics.scale.x = Game.graphics.scale.y = Game.scale;
		Game.stage.addChild(Game.graphics);


		//handle window resize
		window.onresize = onResize;
		onResize();
		function onResize(){
			var screenWidth = window.innerWidth;
			var screenHeight = window.innerHeight;

			Game.div.style.left = Math.max(0,Math.round((screenWidth-Game.canvasWidth)/2)) + 'px';
			Game.div.style.top = Math.max(0,Math.round((screenHeight-Game.canvasHeight)/2)) + 'px';
		};

		
		//load assets
		var assetsToLoad = [
			//"assets/ArialBlack32.fnt",
			"assets/bg.png", "assets/mamie.png", "assets/mamie-accessories.png",
			 "assets/moune.png",  "assets/mulan.png",  "assets/brave.png",  "assets/frozen.png",
			"assets/ours.png",  "assets/ours-big.png",  "assets/ours-armor.png", 
			"assets/sword.png", "assets/arrow.png", "assets/ice.png", 
			"assets/face-moune.png", "assets/face-mamie.png",  "assets/face-mulan.png", 
			"assets/face-brave.png", "assets/face-boulangerie.png", "assets/face-frozen.png",
		];
		var loader = new PIXI.AssetLoader(assetsToLoad);
		loader.onComplete = onLoadDone;
		loader.load();

		function onLoadDone(){

			//Create textures
			Game.textures = {};
			for(var i=0 ; i<assetsToLoad.length ; i++){
				var fileName = assetsToLoad[i];
				var texture = PIXI.Texture.fromImage(fileName);
				Game.textures[ fileName.split("/")[1] ] = texture;
			}

			Game.start();
		}


		//stats
		if(Game.debug){
			window.stats = new Stats();
			stats.setMode(0); // 0: fps, 1: ms

			// align top-left
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.left = '0px';
			stats.domElement.style.top = '0px';

			document.body.appendChild( stats.domElement );
		}
	};
})();