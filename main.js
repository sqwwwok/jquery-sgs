var suits = ["spade","daimond","club","heart"], 
	points = ["A",2,3,4,5,6,7,8,9,10,"J","Q","K"], 
	cardNames = ["sha","shan","tao","guo"], 
	player1 = $("#player1"),
	player2 = $("#player2");

// 返回0-maxnum的一个伪随机整数
function newRandom (maxnum){
	return Math.floor(Math.random()*(maxnum + 1))
}

// 卡牌
class Card {
	// this.chosen = false;
	constructor(name,suit,point) {
		this.name = name;
		this.suit = suit;
		this.point = point
	}
	// 创建一个button标签
	creatjQuery(){
		return $("<button class=\'" + this.name +"\'>" + this.name +" "+ this.suit + this.point + "</button>")
	}
}

// 手牌
class Hand extends Array{
	// Uncaught Reference Error:
	// Must call super constructor in derived class before accessing 'this' or returning from derived constructor
	constructor(player) {
		super();
		this.owner = player
	}
	remove(card){
		if(card === 'random'){
			this.splice(newRandom(this.length-1),1)
		}else{
			this.splice(this.indexOf(element),1);
			}
	}
	add(card){
		this.push(card)
	}
	show(){
		this.map(function(current){
			$("#" + this + "Hand").append(current.creatjQuery());
			// console.log("#" + owner + "Hand")
			// console.log($("#" + owner + "Hand"))
		},this.owner)
	}
}

// 随机牌库
class Library extends Array{
	constructor(num) {
		super();
		for(let i = 0;i < num;i++){
			this.push(new Card(
				cardNames[newRandom(3)],
				suits[newRandom(3)],
				points[newRandom(12)]
			))
		}
	}
	remove(num){
		for(let i = 0;i < num;i++){
			this.shift()
		}
	}
}

// 玩家
class Person {
	constructor(player,nation,sex,name,hp,skill) {		
		this.skill = skill;
		this.hand = new Hand(player);
		this.body = {
			player:player,
			nation:nation,
			sex:sex,
			name:name,
			maxHp:hp,
			hp:hp,
		};
	}
	show(){
		
	}
	draw(num,library){
		for(let i = 0;i < num;i++){
			this.hand.add(library[0])
			library.shift()
		}
	}
	useCard (card,object){
		switch (card.name){
			case "sha":
				object.body.hp--;
				break;
			case "shan":
				this.body.hp++;
				break;
			case "tao":
				this.body.hp++;
				break;
			case "guo":
				object.hand.remove("random");
				break;
			default:
				break;
		}
		this.hand.remove(card);
	}	
}	


function playStart(){
	// 初始化对局
	var order = 1;
	var player1 = new Person("player1","Qun","male","LvBu",4,null);
	var player2 = new Person("player2","Qun","female","Diaochan",3,null);
	var library = new Library(50);
	
	[player1,player2].forEach(function(current){
		current.draw(4,library);
		current.hand.show();
	})
	
	
	// // 使用闭包把回合封装起来
	// function round() {
		
		
	// 	// 判别回合的主宾
	// 	if(order%2 == 1){
	// 		subject = player1
	// 		object = player2
	// 	}else{
	// 		subject = player2;
	// 		object = player1
	// 	}
		
	// 	// 检查血量
	// 	if(subject.body.hp < 1){
	// 		(prompt("游戏结束！是否要开始新的一局？") === "")?gameRestart():gameEnd();
	// 	}
		
	// 	// 摸牌
	// 	if(order === 1){
	// 		subject.draw(1,library)
	// 	}else{
	// 		subject.draw(2,library)
	// 	}
		
	// 	// 打牌
		
		
	// 	//弃牌
	// 	if(subject.hand.length > subject.body.hp){
	// 		for(let i = 0;i < (subject.hand.length - subject.body.hp);i++){
	// 			subject.hand.remove("random")
	// 		}
	// 	}
		
	// 	// 准备下一回合
	// 	order++;
	// }
	// return round
}

// 游戏开始
function gameStart () {
	$("#start").hide();
	$("#mainpage").show();
	// 测试playStart函数
	playStart();
	// var round = playStart()
	// while(1){
	// 	round()
	// }
}

// 重新游戏
function gameRestart(){
	// 清除当前所有数据
	
	$("#mainpage").hide();
	$("#start").show();
		
}
//结束对局
function gameEnd () {
	window.close();
}
























