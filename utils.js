
function clamp(val,b1,b2){
	if(val<b1){
		return b1;
	}else if(val>b2){
		return b2;
	}
	return val;
}

function pyth(l1,l2){
	return Math.sqrt(l1*l1 + l2*l2);
}

function normalize(p,size){
	size = (size || 1)/pyth(p.x, p.y);
	p.x *= size;
	p.y *= size;
}

function point(x, y){
	return {
		x: x,
		y: y
	}
}

function rect(x, y, width, height){
	return {
		x: x,
		y: y,
		width: width,
		height: height
	}
}

function skin(imageName, offsetX, offsetY, width, height){
	return {
		imageName: imageName,
		offsetX: offsetX,
		offsetY: offsetY,
		width: width,
		height: height
	}
}

function rectCollide(rect1, rect2){
	if (rect1.x < rect2.x + rect2.width &&
	   rect1.x + rect1.width > rect2.x &&
	   rect1.y < rect2.y + rect2.height &&
	   rect1.height + rect1.y > rect2.y) {
		return true;
	}else{
		return false;
	}
}

var DIAG_RATIO = Math.sqrt(2) / 2;

var tempPoint = point(0,0);