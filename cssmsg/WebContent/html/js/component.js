$(function() {
	
	$("#morphsearch").hide();

	$("#selectButton").on("click", function() {
		var firstIndex=0;       /* 开始位置 */
		var  defaultLength=1;    /*默认长度*/
		 var cutLength=2;     /* 每次添加长度 */
		var nowIndex=0;
		var keyWord = $(".morphsearch-form #search").val();
		if (!keyWord) {
//			alert("请输入关键字")
             $("#list-details").empty();
             $(".morphsearch-form #search").val("");
		}else{
			if($("#list-details")){
				$("#list-details").empty();
			}
			var url = serverUrl + "desktop_search/dirsearch.action";
			$.ajax({
	    		url: url,
	/*     		url: serverUrl + "dirAppStore.action", */
	    		dataType:'json',
	    		type: 'post',
	    		data:{gwQ:keyWord},
	    		success: function (data) {
	    			if(data.result==0){
	    				var res=JSON.parse(data.msg)[0];
	    				var contnetSum=res.content.length; /* 数据总长度 */
	    				var arrLength=res.content.slice(firstIndex,defaultLength)
	    				nowIndex=nowIndex+defaultLength
	    				$("#list-details").append("<h3>当前搜索结果:"+res.appName+"</h3>")
	    				for(var i=0;i<arrLength.length;i++){
	    					$("#list-details").append('<div id="list-details-for"><a class="list-content" onclick=openApp("'+arrLength[i].link+'")><ul id="list-details-title"><li class="list-content-left">'+arrLength[i].title+'</li><li class="list-content-middle" title="'+arrLength[i].content+'">'+arrLength[i].content+'</li><li class="list-content-right">'+arrLength[i].createTime+'</li></ul></a><div class="list-content-kong"></div></div>'); 
	    				}
	    				$("#list-details").append("<div type='button' class='more-list'><a href='javascript:;'>查看更多</a></div>")
	    				var moreBtn=$(".more-list a")
	    				var contentWidth=$(".list-content-middle").width();
	    							moreBtn.on('click',function(){
	    								if(moreBtn.html()=="查看更多"){
	    								var arrLength=res.content.slice(firstIndex,nowIndex+cutLength);
	    								nowIndex=nowIndex+cutLength
	    								if(nowIndex<=contnetSum){
	    									$("div").remove("#list-details-for");
	    									for(var i=0;i<arrLength.length;i++){
	    										$("#list-details").find(".more-list").before('<div id="list-details-for"><a class="list-content" onclick=openApp("'+arrLength[i].link+'")><ul id="list-details-title"><li class="list-content-left">'+arrLength[i].title+'</li><li class="list-content-middle" title="'+arrLength[i].content+'">'+arrLength[i].content+'</li><li class="list-content-right">'+arrLength[i].createTime+'</li></ul></a><div class="list-content-kong"></div></div>'); 
	    								      }
	    									sliceText(contentWidth);
	    							      }
	    								if(nowIndex>contnetSum){
	    									$("div").remove("#list-details-for");
	    									arrLength=res.content.slice(firstIndex,res.content.length)
	    									for(var i=0;i<arrLength.length;i++){
	    										$("#list-details").find(".more-list").before('<div id="list-details-for"><a class="list-content" onclick=openApp("'+arrLength[i].link+'")><ul id="list-details-title"><li class="list-content-left">'+arrLength[i].title+'</li><li class="list-content-middle" title="'+arrLength[i].content+'">'+arrLength[i].content+'</li><li class="list-content-right">'+arrLength[i].createTime+'</li></ul></a><div class="list-content-kong"></div></div>') 
	    								      }
	    									$(".more-list").find("a").html("收起")
	    								}
	    							  }else if(moreBtn.html()=="收起"){	
	    									$("div").remove("#list-details-for");
	    									arrLength=res.content.slice(firstIndex,defaultLength)
	    									for(var i=0;i<arrLength.length;i++){
	    										$("#list-details").find(".more-list").before('<div id="list-details-for"><a class="list-content" onclick=openApp("'+arrLength[i].link+'")><ul id="list-details-title"><li class="list-content-left">'+arrLength[i].title+'</li><li class="list-content-middle" title="'+arrLength[i].content+'">'+arrLength[i].content+'</li><li class="list-content-right">'+arrLength[i].createTime+'</li></ul></a><div class="list-content-kong"></div></div>') 
	    								      }
	    									$(".more-list").find("a").html("查看更多")
	    									nowIndex=3;
	    									sliceText(contentWidth);
	    							 }
	    				})
	    			}
	    		}
			})
		}
	});
	$("#search").bind("keydown", function(e){
		if(e.which == 13){
			$("#selectButton").trigger("click");
			return false;
		}
	});
	function sliceText(contentWidth){
		var maxwidth=""
		$(".list-content-middle").each(function(){
			if(contentWidth=="1290"){
				 maxwidth=165;
				if($(this).text().length>maxwidth){
					$(this).text($(this).text().substring(0,maxwidth));
					$(this).html($(this).text().substring(0,maxwidth-3)+'...');
			    }
			}else{
				 maxwidth=109;
				if($(this).text().length>maxwidth){
					$(this).text($(this).text().substring(0,maxwidth));
					$(this).html($(this).text().substring(0,maxwidth-3)+'...');
			    }
			}
	    })
	}
	
	/*数据*/
	/*var jsonSearch={
			"result":0,
			"msg":[
			        {
			        	"appname":"新闻",
			        	"content":[
	        	                    {
			        		          "title":"中软1号",
			        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多ghjdsddasdasd大叔大婶多都是啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊 ",
			        		          "createTime":"2018-09-14 14:33:06",
			        		          "link":"http://10.13.1.207:8080/fulltexthttp"
	        						},
	        						{
	  		        		          "title":"中软2号",
	  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多",
	  		        		          "createTime":"2018-09-14 14:33:06",
	  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
	          						},
	          						{
	  		        		          "title":"中软3号",
	  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多",
	  		        		          "createTime":"2018-09-14 14:33:06",
	  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
	          						},
	          						{
	  		        		          "title":"中软4号",
	  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多",
	  		        		          "createTime":"2018-09-14 14:33:06",
	  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
	          						},
	          						{
	  		        		          "title":"中软5号",
	  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多",
	  		        		          "createTime":"2018-09-14 14:33:06",
	  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
	          						},
	          						{
	  		        		          "title":"中软6号",
	  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多",
	  		        		          "createTime":"2018-09-14 14:33:06",
	  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
	          						},
	          						{
	  		        		          "title":"中软7号",
	  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多",
	  		        		          "createTime":"2018-09-14 14:33:06",
	  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
	          						},
	          						{
		  		        		          "title":"中软8号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多ghjdsddasdasd 大叔大婶多都是啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软8号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软8号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软8号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软8号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软8号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软8号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软8号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软28号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软18号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软18号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软18号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软18号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软18号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软18号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软18号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软18号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软18号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软18号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软18号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软18号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软18号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					},
	          						{
		  		        		          "title":"中软18号",
		  		        		          "content":"中国软件快乐撒可独立思考了澳康达阿斯顿撒多所哈哈返回房间自学成才宣传册撒大声地撒多撒多撒多撒多所多撒多撒多所多所大所大所大所多 ",
		  		        		          "createTime":"2018-09-14 14:33:06",
		  		        		          "link":"http://10.13.1.207:8080/fulltexthttp"
		          					}
	          						
	        	                   ],
			        	
			             }
			       
			       
	                     ]
	                 } */
	
});