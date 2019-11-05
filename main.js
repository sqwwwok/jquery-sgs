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
	constructor(name,suit,point) {
			this.owner=null;
			this.object=null;
			this.name=name;
			this.suit=suit;
			this.point=point;
			// "fixed","notchosen","chosen"
			this.chosen="fixed";
			this.effect= ()=>{
				switch (this.name){
					case "sha":
						return function () {
							
						}
						break;
					case"shan":
						break;
					case"tao":
						break;
					case"guo":
						break;
					default:
						break;
				}
			}
			this.cardButton=$("<button></button>")
					.addClass("this.name")
					.attr("type","button")
					.css("background-color",this.chosen==="fixed"?"gray":"white")
					.text(this.name+" "+this.suit+this.point)
	}
}

// 手牌
class Hand extends Array{
	constructor(person) {
		super();
		this.owner = person
	}

	// 把button添加到html中
	showCards(){
		this.map(function(current){
			$("#" + this + "Hand").append(current.cardButton)
		},this.owner.body.player)
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
		this.body = {
			player:player,
			nation:nation,
			sex:sex,
			name:name,
			maxHp:hp,
			hp:hp,
		};
		this.skill=skill
		this.hand = new Hand(this);
	}
	draw(num,library){
		for(let i = 0;i < num;i++){
			library[0].owner = this;
			this.hand.push(library[0]).showCards();
			library.shift();
		}
	}	
	remove(card){
		if(card === 'random'){
			card = this.hand(newRandom(this.hand.length-1))
		}
		card.owner = card.object = card.cardButton = null;
		this.hand.splice(this.hand.indexOf(card),1).showCards()
	}
	useCard(card){
		switch (card.name){
			case "sha":
				if
				break;
			case"shan":
				break;
			case"tao":
				break;
			case"guo":
				break;
			default:
				break;
		}
	}
}	


function playStart(){
	// 初始化对局
	var order = 1;
	var player1 = new Person("player1","Qun","male","LvBu",4,null);
	var player2 = new Person("player2","Qun","female","Diaochan",3,null);
	var library = new Library(50);
	[player1,player2].forEach(function(current){
		current.hand.draw(4,library);
		current.hand.showCards();
	})
	
	
	// // 使用闭包把回合封装起来
	function round() {
		
		
		// 判别回合的主宾
		order%2 === 1?player1.object = player2:player2.object = player1
		
	// 	// 检查血量
	// 	if(subject.body.hp < 1){
	// 		(prompt("游戏结束！是否要开始新的一局？") === "")?gameRestart():gameEnd();
	// 	}
		
		// 摸牌
		if(order === 1){
			subject.hand.draw(1,library)
		}else{
			subject.hand.draw(2,library)
		}
		
	// 	// 打牌
		
		
	// 	//弃牌
		if(subject.hand.length > subject.body.hp){
			for(let i = 0;i < (subject.hand.length - subject.body.hp);i++){
				subject.hand.remove("random")
			}
		}
		
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
	// 清除当前所有数据***
	
	
	$("#mainpage").hide();
	$("#start").show();	
}
//结束对局
function gameEnd () {
	window.close();
}
























