function UUID(){
    this.id = this.createUUID();
}
UUID.prototype.valueOf = function(){ return this.id; };
UUID.prototype.toString = function(){ return this.id; };
UUID.prototype.createUUID = function(){
    var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
    var dc = new Date();
    var t = dc.getTime() - dg.getTime();
    var tl = UUID.getIntegerBits(t,0,31);
    var tm = UUID.getIntegerBits(t,32,47); 
    var thv = UUID.getIntegerBits(t,48,59) + '1'; 
    var csar = UUID.getIntegerBits(UUID.rand(4095),0,7);
    var csl = UUID.getIntegerBits(UUID.rand(4095),0,7);
    var n = UUID.getIntegerBits(UUID.rand(8191),0,7) +
            UUID.getIntegerBits(UUID.rand(8191),8,15) +
            UUID.getIntegerBits(UUID.rand(8191),0,7) +
            UUID.getIntegerBits(UUID.rand(8191),8,15) +
            UUID.getIntegerBits(UUID.rand(8191),0,15); 
    return tl + tm  + thv  + csar + csl + n;
};

UUID.getIntegerBits = function(val,start,end){
	var base16 = UUID.returnBase(val,16);
	var quadArray = new Array();
	var quadString = '';
	var i = 0;
	for(i=0;i<base16.length;i++){
    	quadArray.push(base16.substring(i,i+1));   
	}
	for(i=Math.floor(start/4);i<=Math.floor(end/4);i++){
		if(!quadArray[i] || quadArray[i] == '') 
			quadString += '0';
     	else 
     		quadString += quadArray[i];
	}
 	return quadString;
};

UUID.returnBase = function(number, base){
	return (number).toString(base).toLowerCase();
};

UUID.rand = function(max){
	return Math.floor(Math.random() * (max + 1));
};

function getUUid(){
	return new UUID().createUUID();
}