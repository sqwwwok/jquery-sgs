var suits = config.suits || ["spade","daimond","club","heart"],
	points = config.points || ["A",2,3,4,5,6,7,8,9,10,"J","Q","K"], 
	cardNames = config.cards || ["杀","闪","桃","过河拆桥"],
	configPlayers = config.players || [
        {
            playerName:"sqwww",
            nation:"群",
            sex:"男",
            name:"吕布",
            hp:4,
            skill:null
        },
        {
            playerName:"sqwwwok",
            nation:"群",
            sex:"女",
            name:"貂蝉",
            hp:3,
			skill:null
		}
	];

 /**
  * @Description: 返回0-maxnum(包括maxnum)的一个伪随机整数
  * @Paraments: 
  * @Return: 
  */
 function newRandom (maxnum){
	return Math.floor(Math.random()*(maxnum + 1))
}


/**
 * @Description: 返回一个有 id 的 div 元素的jQuery对象
 * @Paraments: idString(String)
 * @Return: jQuery
 */
function createDiv(idString) {
    return $(document.createElement("div")).attr("id",idString)
}

// 卡牌
class Card {
	constructor(name,suit,point) {
			this.owner=null;
			this.object=null;
			this.name=name;
			this.suit=suit;
			this.point=point;
			this.description="fixed";
			this.cardButton=$("<button></button>")
				.attr("type","button")
				.text(this.name+" "+this.suit+this.point)
	}
	/**
  * @Description: 
  * @Paraments: "fixed","chosen",optional"
  * @Return: cardButton(DOM)
  */
	showCard(description){
		this.description=description;
		switch (description) {
			case "fixed":
				this.cardButton.css("background-color","gray")
				break;
			case "chosen":
				this.cardButton.css("background-color","black")
				break;
			case "optional":
				this.cardButton.css("background-color","white")
				break;
			default:
				throw new Error("card description is "+description)
		}
		return this.cardButton
	}
}

// 手牌
class Hand extends Array{
	constructor(person) {
		super();
		this.owner = person
	}
}

// 随机牌库
class Library extends Array{
	constructor(num) {
		super();
		for(let i = 0;i < num;i++){
			this.push(new Card(
				cardNames[newRandom(cardNames.length-1)],
				suits[newRandom(suits.length-1)],
				points[newRandom(points.length-1)]
			))
		}
	}
}

// 玩家
class Person {
	constructor({playerName,nation,sex,name,hp,skill}) {
		this.player = playerName;
		this.body = {
			nation:nation,
			sex:sex,
			name:name,
			maxHp:hp,
			hp:hp,
		};
		this.skill=skill;
		this.hand = new Hand(this)
	}
	health(){
		if(this.body.maxHp===this.body.hp){
			return "full"
		}else if(this.body.hp > 0){
			return "notfull"
		}else if(this.body.hp <= 0)
			return "dying"
	}
	minusHp(num){
		this.body.hp-=num;
		this.showBody();
		this.showTip("你失去了"+num+"点体力");
	}
	healed(num){
		this.body.hp+=num;
		this.showBody();
		this.showTip("你恢复了"+num+"点体力");
	}

	/**
  * @Description: move (number) cards from library into hand
  * @Paraments: Number,Library
  * @Return: 
  */
	drawCard(num,library){

		for(let i = 0;i < num;i++){
			if(library.length===0){library=new Library(50)}
			library[0].owner = this;
			this.hand.push(library[0]);
			library.shift();
			if(!library.length){
				library = new Library(50);
			}
		}
		this.showHand();
	}
    /**
     * @Description: 检查手牌有无此类型的牌,对应的牌会高亮显示
     * @Paraments: 卡牌的名称(String)
     * @Return: Boolean 
     */    
    checkCard(cardName){
        let result=false;
        this.hand.map(function(card){
            if(card.name===cardName){
                card.showCard("optional");
                result = true;
            }
        })
        return result

	}
	/**
  * @Description: 
  * @Paraments: Card Object or "random"
  * @Return: 
  */
	removeCard(card){
		if(card === 'random'){
			card = this.hand[newRandom(this.hand.length-1)]
		}
		//清除card
		this.hand.splice(this.hand.indexOf(card),1);
		card.cardButton.remove();
		card = null;
	}

	showBody(){
		$("#"+this.player+"Body").text(JSON.stringify(this.body));
	}
	showHand(){
		this.hand.map(function(current){
			$("#" + this.player + "Hand")
				.append(
					current.showCard("fixed")
					.off("click")
					.click(()=>{this.showTip("这不是你的回合！")}
				))
		},this)
	}
	showTip(string){
		$("#"+this.player+"Tip").text(string)
	}
	/**
  * @Description: provide a once button for subject
  * @Paraments: buttonName,clickFunction,...clickParaments
  * @Return: null
  */
	showOption(description,clickFunc,...rest){
		$("#"+this.player+"Select").append(
			$("<button class=description>"+description+"</button>")
			.addClass(description).click(
				function(){
					this.remove();
					clickFunc.apply(this,rest);
				}
			))
	}


	lose(){
		alert(this.player+'输了，游戏结束！');
		// 游戏结束，数据清理
		gameRestart();
		
	}
}

