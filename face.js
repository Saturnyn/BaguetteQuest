// ---------------------------------------------------------------------------------------------------------------------
// FACE
// ---------------------------------------------------------------------------------------------------------------------

var FACE_RIGHT = 0;
var FACE_IMAGE = 1;
var FACE_TEXTS = 2;
var FACE_EXECUTE_START = 3;
Game.faceStacks = {
	'0' : [
		[false, 'face-mamie.png', ['Moumoune, come here sweety.', 'We are going to the bakery, I want to buy a baguette.']],
		[true, 'face-moune.png', ['OK Mamie !'], function(){ Game.mamie.hide = false; Game.moune.hide = false; }],
		[true, 'face-moune.png', ['This is going to be an epic quest !']],
		[false, 'face-mamie.png', ['Whatever you say sweetie...']],
		[false, null, ['- use arrow keys to move -']]
	],
	'0-1' : [
		[false, 'face-moune.png', ['Oh no !', 'Raging bears are attacking Mamie !']],
		[false, 'face-moune.png', ['But they are no match for Moulan !']],
		[false, 'face-mulan.png', ['To arms !'], function(){ Game.setMouneSkin('mulan')}],
		[false, null, ['- press space to attack -']]
	],
	'0-2' : [
		[false, 'face-mamie.png', ['Hello, I would like a baguette please.']],
		[true, 'face-boulangerie.png', ['Of course, that will be 1 euro.']],
		[false, 'face-mamie.png', ['Silly me !','I forgot my wallet.','I will be back in a minute.']]
	],
	'1' : [
		[false, 'face-mamie.png', ['Ah here it is.','Let us go back to the bakery.']]
	],
	'1-1' : [
		[false, 'face-mulan.png', ['Oh no, that new bear is too fat !', 'My sword will only bounce on it...']],
		[false, 'face-mulan.png', ['But I am sure that girl from Brave could pierce it !']],
		[false, 'face-brave.png', ['To arms !'], function(){ Game.setMouneSkin('brave')}]
	],
	'2' : [
		[false, 'face-mamie.png', ['Hello, it is me again !','Here is 1 euro.']],
		[true, 'face-boulangerie.png', ['Thanks, here is your baguette.']],
		[false, 'face-mamie.png', ['Thank you, good bye !']],
	],
	'2-1' : [
		[false, 'face-moune.png', ['There are both kinds of bear now.']],
		[false, 'face-moune.png', ['I will have to switch my attacks.']],
		[false, null, ['(Press "1" and "2" keys to switch characters)']]
	],
	'3' : [
		[false, 'face-mamie.png', ['Ha ! Home sweet home.','...']],
		[false, 'face-mamie.png', ['Damned !','I forgot my wallet at the bakery !', 'Quick let us go back !']],
	],
	'3-1' : [
		[false, 'face-moune.png', ['That new one is heavily armored.']],
		[false, 'face-moune.png', ['Wepons will not cut it this time.','It is time for magic !']],
		[false, 'face-frozen.png', ['Let it gooooo!'], function(){ Game.setMouneSkin('frozen')}]
	],
	'4' : [
		[false, 'face-mamie.png', ['Hello again, I have lost my wallet, have you seen it ?']],
		[true, 'face-boulangerie.png', ['Yes here it is.','You have to be careful with this Mamie !']],
	],
	'5' : [
		[false, 'face-mamie.png', ['Well, at least we can eat our baguette now.','...']],
		[false, 'face-mamie.png', ['The baguette !', 'Where is it ?', 'Oh no, someone stole our baguette !']],
		[false, 'face-mamie.png', ['I guess we have no choice.']],
		[false, 'face-mamie.png', ['We have to go back, Moumoune!', 'We have to go back!']]
	],
	'6' : [
		[false, 'face-boulangerie.png', ['Ah Mamie, you are back again.','Hope you didn\'t forget your wallet this time !']],
		[true, 'face-mamie.png', ['...']],
		[false, 'face-boulangerie.png', ['Oh.']],
		[true, 'face-mamie.png', ['I will be back in a minute.']]
	],
	'7' : [
		[false, 'face-mamie.png', ['Where did I put this wallet ?','Ah here it is.','Let us go back.']]
	],
	'8' : [
		[false, 'face-mamie.png', ['Hello, again, another baguette please.']],
		[true, 'face-boulangerie.png', ['Another ?','You ate the first one already ?']],
		[false, 'face-mamie.png', ['Yes another.','The first one got stolen !']],
		[true, 'face-boulangerie.png', ['Stolen ?','Are you sure your grand-daughter didn\'t hide it like last time ?']],
		[false, 'face-mamie.png', ['Oh you are probably right !','What a little scoundrel !','Bye bye.']],
		[true, 'face-moune.png', ['Sorry Mamie, it won\'t happen again, I promise...']],
		[false, 'face-mamie.png', ['It\'s okay sweetie, let us go home now.']]
	],
	'9' : [
		[false, 'face-moune.png', ['The epic quest for the baguette thus comes to an end !']],
		[false, 'face-moune.png', ['Thank you for playing !'], function(){ Game.over = true; }]
	]
};

Game.showFaceStack = function(index){
	if(!Game.showingFaces){
		console.log('showFaceStack',index);
		Game.showingFaces = true;
		Game.faceStackIndex = index;
		
		Game.faceItemIndex = 0;
		Game.faceTextIndex = 0;
		Game.displayingFace = false;
	}else{
		throw new Error();
	}
};

Game.hideFaceStack = function(){
	if(Game.showingFaces){
		Game.displayingFace = false;
		Game.showingFaces = false;
		Game.faceUI.container.visible = false;
	}else{
		throw new Error();
	}
};

Game.updateFace = function(){
	var faceStack = Game.faceStacks[Game.faceStackIndex];
	var displayCurrentItem = false;
	if(!Game.displayingFace){
		Game.displayingFace = true;
		displayCurrentItem = true;
	}else{
		if(('enter' in Game.keysUp) || ('esc' in Game.keysUp)){
			displayCurrentItem = true;
			Game.faceTextIndex ++;
			if(Game.faceTextIndex >= faceStack[Game.faceItemIndex][FACE_TEXTS].length){
				Game.faceTextIndex = 0;
				Game.faceItemIndex ++;
				if(Game.faceItemIndex >= faceStack.length){
					Game.hideFaceStack();
					displayCurrentItem = false;
				}
			}
		}
	}
	if(displayCurrentItem){
		var item = faceStack[Game.faceItemIndex];
		Game.showFace(
			item[FACE_RIGHT], 
			item[FACE_IMAGE], 
			item[FACE_TEXTS].slice(0,Game.faceTextIndex+1)
		);
		if(item[FACE_EXECUTE_START]){
			item[FACE_EXECUTE_START]();
		}
	}
}


Game.showFace = function(right, image, texts){
	console.log('showFace',right, image, texts)
	var faceUI = Game.faceUI;

	var margin = 4;
	var faceWidth = 120;
	var frameWidth =  Game.width - 2*faceWidth - 2*margin - 2*margin;
	var textWidth = (frameWidth - 2*margin) * Game.scale;
	if(!faceUI){
		faceUI = Game.faceUI = {};
		faceUI.container =  new PIXI.DisplayObjectContainer();
		faceUI.container.x = margin;
		faceUI.container.y = Game.height - faceWidth - margin;		
		Game.uiContainer.addChild(faceUI.container);
		
		faceUI.frame =  new PIXI.Graphics();
		faceUI.frame.lineStyle(1, 0x0000ff);
		faceUI.frame.beginFill(0x0000ff,0.3);
		faceUI.frame.drawRect(0, 0, frameWidth, faceWidth);
		faceUI.frame.endFill();
		faceUI.frame.x = faceWidth + margin;
		faceUI.container.addChild(faceUI.frame);

		faceUI.face =  new PIXI.Sprite(Game.textures['face-moune.png']);
		faceUI.container.addChild(faceUI.face);

		faceUI.text =  new PIXI.Text('',{
			font: '24px "Arial Black"',
			fill: 'white',
			stroke: 'blue',
			strokeThickness: 4,
			wordWrap: true,
			wordWrapWidth: textWidth
		});
		faceUI.text.scale.x = faceUI.text.scale.y = 1/Game.scale;
		faceUI.text.x = faceUI.text.y = margin;
		faceUI.frame.addChild(faceUI.text);

		faceUI.text2 =  new PIXI.Text('(Press Enter)',{
			font: '16px "Arial Black"',
			fill: 'white'
		});
		faceUI.text2.scale.x = faceUI.text2.scale.y = 1/Game.scale;
		faceUI.text2.x = 84;
		faceUI.text2.y = 110;
		faceUI.frame.addChild(faceUI.text2);
		
	}

	if(image){
		if(image === 'face-moune.png'){
			if(Game.moune.currentSkin === 'mulan'){
				image = 'face-mulan.png';
			}else if(Game.moune.currentSkin === 'brave'){
				image = 'face-brave.png';
			}else if(Game.moune.currentSkin === 'frozen'){
				image = 'face-frozen.png';
			}
		}
		faceUI.face.texture = Game.textures[image];
		faceUI.face.visible = true;
	}else{
		faceUI.face.visible = false;
	}
	if(right){
		faceUI.face.scale.x = -1;
		faceUI.face.x = Game.width - 2*margin;
	}else{
		faceUI.face.x = 0;
		faceUI.face.scale.x = 1;
	}
	faceUI.text.setText(texts.join('\n\n'));
	faceUI.container.visible = true;
};