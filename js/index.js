var li_arr=$("li");
var liLength=li_arr.length;
var liWidth=li_arr.eq(0).width();  //数据块宽度
var oArr=[];
var lenArr=[];
function flow(level,vertical){ //level:水平距离，vertical:垂直距离
	var windowWidth=$(window).width();
	var column=Math.floor(windowWidth/liWidth); //列数
	var widthCound=liWidth*column+"px"; //ul总宽度
	$("ul").css("width",widthCound);	
	for(var i=0;i<liLength;i++){  //遍历数据块将高度存入数组
		lenArr.push($($("li")[i]).height());
	}	
	for(var i=0;i<column;i++){     //先排第一行
		$($("li")[i]).css("top",0);
		var width=liWidth*i+"px";
		$($("li")[i]).css("left",width);
		$($("li")[i]).css("opacity",1);
		oArr.push(lenArr[i]);
	}
	for(var i=column;i<liLength;i++){ //将其它数据块定位到最短的一列，然后更新该列高度
		//获取数组的最小值索引
		// var shortest =oArr[0];
		// var shortestKey = 0;
		// for (var j = 1; j < oArr.length; j++) {
		// 	if(shortest>oArr[j]){
		// 		shortest=oArr[j];
		// 		shortestKey=j;
		// 	}
		// }
		var shortestKey=minHeight(oArr);
		$($("li")[i]).css("top",oArr[shortestKey]+"px");
		$($("li")[i]).css("left",shortestKey*liWidth+"px");
		$($("li")[i]).css("opacity",1);
		oArr[shortestKey] += lenArr[i];
	}	
}

var intervalId=setInterval(function(){    //判断已有图片是否加载完
	if(li_arr.length==img_count){
		clearInterval(intervalId);
		flow();
	}
	//改变窗口大小重新布局
	var re;
	$(window).resize(function(){
		clearTimeout(re);
		re=setTimeout(function(){			
			flow();
		},100)
	})
	//滚动加载数据
	//兼容性，有的浏览器识别document，有的识别body


$(window).scroll(function(){

	var scrollTop=$(this).scrollTop()>$("body").scrollTop()
	?$(this).scrollTop():$("body").scrollTop();  
	var st=oArr[minHeight(oArr)];
	// alert($("body").scrollTop());  0
	// alert(st);                     732
	// alert($(window).height());     621
	if(scrollTop>=st-$(window).height()){
		$.ajax({
			type:"GET",
			dataType:"json",
			url:"../data.php",
			success:function(data){
				var newArr=data.data;
				var newLength=newArr.length;
				var htmlLi="";
				//追加li
				for(var i=0;i<newLength;i++){
					htmlLi+='<li><img src="'+newArr[i]["img"]+'" onload="img_load(this)"/><a href="#">图片标题'+i+'</a></li>';
				}
				$("#flow-box").append(htmlLi);
				var allLi=$("#flow-box").find("li");
				for(var i=liLength;i<allLi.length;i++){
					lenArr.push($(allLi[i]).height());				
				}
				for(var i=liLength;i<allLi.length;i++){
					var shortestKey=minHeight(oArr);
					$(allLi[i]).css("top",oArr[shortestKey]+"px");
					$(allLi[i]).css("left",liWidth*shortestKey+"px");
					$(allLi[i]).css("opacity",1);
					oArr[shortestKey]+=lenArr[i];
				}
				liLength=$("li").length;
			},
			error:function(){
				alert("error");
			}
		});
	}

});



},100);
function minHeight(oArr){
	var shortest=Math.min.apply(Math,oArr);
	var shortestKey=0;
	for(var j=0;j<oArr.length;j++){
		if(oArr[j] == shortest){
		shortestKey=j;
		}
	}
	return shortestKey;
}
	
