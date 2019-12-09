var config = {
    suits:["spade","daimond","club","heart"], 
    points:["A",2,3,4,5,6,7,8,9,10,"J","Q","K"], 
    cards:["杀","闪","桃","过河拆桥"],
    playerNumber:2
}

 /**
  * @Description: 返回0-maxnum(包括maxnum)的一个伪随机整数
  * @Paraments: 
  * @Return: 
  */
 function newRandom (maxnum){
	return Math.floor(Math.random()*(maxnum + 1))
}