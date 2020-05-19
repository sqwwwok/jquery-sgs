/*
 * @Date: 2019-11-09 07:55:43
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-10 10:24:48
 */
{
	// 解析配置信息
	const SUITS = config.suits || ["spade","daimond","club","heart"],
		POINTS = config.points || ["A",2,3,4,5,6,7,8,9,10,"J","Q","K"], 
		CARDS = config.cards || ["杀","闪","桃","过河拆桥"],
		PLAYERS = config.players || [
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
		],
		KURISU = config.kurisu,
		CARDEFFECT = config.cardeffect;
		
	$("#start").click(playStart);
	$("#restart").click(gameRestart);
	$("end").click(gameEnd);
	
	// 对局
	function playStart(){
		//新的回合
		function newRound() {
			// 回合开始阶段
			{
				if(order%2 === 1){
					[subject,object] = players
				}else{
					[object,subject] = players
				}
				subject.roundInfo = {};
				object.roundInfo = {};
				$("#"+object.player+" .finish").remove();			
				subject.hand.map((card)=>{card.cardButton.off("click")});
				subject.showTip("你的回合");
				object.showTip("对手的回合");
			}
	
			// 摸牌阶段
			{
				if(order === 1){
					subject.drawCard(1,library)
				}else{
					subject.drawCard(2,library)
				}
			}

			// 出牌阶段	 
			{
				let shaNum = 0;
				subject.showTip("你的出牌阶段");	
				subject.showOption("结束回合",abondonCard);
				subject.hand.map(function(card){
					// 处理subject出的杀
					function shaDeal(subject,object){
						if(!shaNum){
							shaNum++;
							object.shaTarget = true;
							subject.removeCard(card);
							shanDeal(object,subject);
						}else{
							subject.showTip("你已经出过杀了")
						}
					}
					function shaSettle(subject,object){
						if(object.shaTarget){
							object.shaTarget=false;
							object.minusHp(1);
							dyingSettle(object);
						}else{
							object.showTip("");
						}
					}
					/**
			* @Description: 注意，shanDeal的subject是出杀的一方
			* @Paraments: 
			* @Return: 
			*/			
					function shanDeal(object,subject){
						if(object.checkCard("闪")){
							object.showTip("你是否要出闪？")
							object.showOption("不出闪",shaSettle,subject,object)
							// bind "click" for object's 闪	
							object.hand.map((card)=>{
								if(card.name==="闪"){
									card.cardButton.off("click").click(()=>{
										if(object.shaTarget){
											object.shaTarget = false;
											object.removeCard(card);
											$("#"+object.player+"Select button.不出闪").remove();
											shaSettle(subject,object);
										}
									})
								}
							})	
						}else{
							shaSettle(subject,object);
						}
					}
					function taoDeal(subject,object){
						if(object.health() ==="full"){
							object.showTip("你的血量是满的")
						}else{
							object.healed(1);
							subject.removeCard(card);
						}
					}
					function guoDeal(subject,object){
						if(object.hand.length===0){
							subject.showTip("对手没有手牌了！")
						}else{
							subject.removeCard(card);
							object.removeCard("random");
						}
					}
					function dyingSettle(subject) {
						if(subject.health()==="dying"){
							if(subject.checkCard("桃")){
								subject.showTip("你快死了，是否出桃？");
								subject.showOption("不出桃",death);
								subject.hand.map((card)=>{
									if(card.name==="桃"){
										card.cardButton.off("click").click(()=>{
											taoDeal(subject,subject);
											dyingSettle(subject);
										});
										
									}
								})
							}else{
								death()
							}
						}else{
							return
						}
						function death() {
							subject.lose();
						}
					}
					
					if(!(card.name==="闪"
					||(card.name==="桃"&&subject.health()==="full")
					||(card.name==="过河拆桥"&&object.hand.length===0))){
						card.showCard("optional")
						card.cardButton.off("click").click(function(){
							switch (card.name) {
								case "杀":
									shaDeal(subject,object);	
									break;
								case "桃":
									taoDeal(subject,subject);
									break;
								case "过河拆桥":
									guoDeal(subject,object);
								default:
									break;
							}
						})
					}
				})
			}
	
			// 弃牌阶段
			function abondonCard(){
				abondon();
				function abondon(){
					let abondonNumber = subject.hand.length-subject.body.hp;
					if (abondonNumber<=0) {
						$("#"+subject.player+"Select button.结束回合").remove();
						subject.hand.map((card)=>{card.cardButton.off("click")});
						finishRound();
					}else{
						subject.showTip("弃牌阶段：你需要弃掉"+(abondonNumber)+"张牌");
						subject.hand.map((card)=>{
							card.cardButton.off("click").click(()=>{
								if(abondonNumber>0){
									subject.removeCard(card);
									abondon();
								}
							})
						})
					}
				}
				
			}
	
		}
		// 回合结束
		function finishRound(){
			if(subject.hand.length > subject.body.hp){
				for(let i = 0;i < (subject.hand.length - subject.body.hp);i++){
					subject.removeCard("random")
				}
			}
			order++;
			newRound()	
		}

		// 初始化html界面
		$("#start").hide();
		$("#mainpage").show();
		if(KURISU) {
			let kurisu = $("img#Kurisu");
			kurisu.show();
			kurisu.click(function(){
				kurisu.hide()
			});		
		};
		var subject,object,order = 1,library = new Library(50,CARDS,SUITS,POINTS),
		// 创建玩家列表并初始化它们的战斗区域
		players = PLAYERS.map((current)=>{
			var player = new Person(current);
			var playerName = player.player;
			// 创建每个玩家的box
			var playerBox = createDiv(playerName).addClass("player");	
			$("#playBox").append(playerBox);
			// 创建box中的分区
			["Body","Hand","Tip","Select"].map(
				description => playerBox.append(createDiv(playerName+description))
			);
			$('#'+playerName+'Hand').click = (event)=>{
				if(player.roundInfo.myTurn){
					switch (event.target.className) {
						case '杀':
							
							break;
						case '闪':
						
							break;
						case '桃':
						
							break;
						case '过河拆桥':
						
							break;
						default:
							break;
					}
				}
			}
			player.showBody();
			// 起手四张牌
			player.drawCard(4,library);
			return player;
		})
		newRound();
	}
	
	// 重新游戏
	function gameRestart(){
		location.reload();
	}
	//结束对局
	function gameEnd () {
		window.close();
	}	
}