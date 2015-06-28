

var background = chrome.extension.getBackgroundPage(); 

// 这里的document代表了popup.html的文档流，所以也是注册这个页面中的dom事件
document.addEventListener('DOMContentLoaded', function(){
	var divs = document.querySelectorAll('div');
	for(var i=0; i<divs.length; i++){
		divs[i].addEventListener('click', function(e){
			if (e.target.id == "on"){
				chrome.tabs.insertCSS(null,{file:"highlight111.css"});
				chrome.tabs.executeScript(null,{code:"var trackingNumberResult = findTrackingNumber(); trackingNumberResult", allFrames: false}, 
												function(results){ console.log(results);
																	if(results > 0){
																	Tasks.init_list();
																	} 
																});
												
			}else if (e.target.id == "off"){
				chrome.tabs.executeScript(null,{code:"$('body').unhighlight();", allFrames: false});
			}else if (e.target.id == "find"){
				background.updateStatus("1ZAF95450307573509");
			}else if (e.target.id == "inquiry"){
				var list = background.trackingNumberList;
				alert(list[0].carrier);
			}
			
		});		
	}
});




//--------------------------------------

var $=function(id){return document.getElementById(id);}

var Tasks = {
	show:function(obj){
		obj.className='';
		return this;
	},
	hide:function(obj){
		obj.className='hide';
		return this;
	},
	////存储dom
	$addItemDiv:$('addItemDiv'),
	$addItemInput:$('addItemInput'),
	$txtTaskTitle:$('txtTaskTitle'),
	$taskItemList:$('taskItemList'),
	////指针
	index:window.localStorage.getItem('Tasks:index'),
	////初始化
	init:function(){
		if(!Tasks.index){
			window.localStorage.setItem('Tasks:index',Tasks.index=0);
		}
		////*注册事件*/
		////打开添加文本框
		Tasks.$addItemDiv.addEventListener('click',function(){
			Tasks.show(Tasks.$addItemInput).hide(Tasks.$addItemDiv);
			Tasks.$txtTaskTitle.focus();
		},true);
		////回车添加
		Tasks.$txtTaskTitle.addEventListener('keyup',function(ev){
			var ev=ev || window.event;
			if(ev.keyCode==13){
				var task={
					id:0,
					task_item:$('txtTaskTitle').value,
					add_time:new Date(),
					is_finished:false
				};
				Tasks.Add(task);
				Tasks.AppendHtml(task);
				Tasks.$txtTaskTitle.value='';
				Tasks.hide(Tasks.$addItemInput).show(Tasks.$addItemDiv);
			}
			ev.preventDefault();
		},true);
		////Esc取消
		Tasks.$txtTaskTitle.addEventListener('keyup',function(ev){
			var ev=ev || window.event;
			if(ev.keyCode==27){//esc
				Tasks.$txtTaskTitle.value='';
				Tasks.hide(Tasks.$addItemInput).show(Tasks.$addItemDiv);
			}
		},true);
		////初始化数据
		Tasks.init_list();
	},
	
	
	init_list:function(){
	
		if(window.localStorage.length-1){
			var task_list=[];
			var key;
			for(var i=0,len=window.localStorage.length;i<len;i++){
				key=window.localStorage.key(i);
				if(/task:\d+/.test(key)){
					task_list.push(JSON.parse(window.localStorage.getItem(key)));
				}
			}
			for(var i=0,len=task_list.length;i<len;i++){
				Tasks.AppendHtml(task_list[i]);
				trackingNumberList.push()
			}
		}
	},
	

	////增加
	Add:function(task){
		////更新指针
		window.localStorage.setItem('Tasks:index', ++Tasks.index);
		task.id=Tasks.index;
		window.localStorage.setItem("task:"+ Tasks.index, JSON.stringify(task));
	},
	////修改
	Edit:function(task){
		window.localStorage.setItem("task:"+ task.id, JSON.stringify(task));
	},
	////删除
	Del:function(task){
		window.localStorage.removeItem("task:"+ task.id);
	},
	AppendHtml:function(task){
		var oDiv=document.createElement('div');
		oDiv.className='taskItem';
		oDiv.setAttribute('id','task_' + task.id);
		var addTime=new Date(task.add_time);
		var timeString=addTime.getMonth() + '-' + addTime.getDate() + ' ' + addTime.getHours() + ':' + addTime.getMinutes() + ':' + addTime.getSeconds();
		oDiv.setAttribute('title',timeString);
		var oLabel=document.createElement('label');
		oLabel.className= task.is_finished ? 'off' : 'on';
		var oSpan=document.createElement('span');
		oSpan.className='taskTitle';
		var oText=document.createTextNode(task.task_item);
		oSpan.appendChild(oText);
		oDiv.appendChild(oLabel);
		oDiv.appendChild(oSpan);
		
		////注册事件
		oDiv.addEventListener('click',function(){
			if(!task.is_finished){
				task.is_finished=!task.is_finished;
				var lbl=this.getElementsByTagName('label')[0];
				lbl.className= (lbl.className=='on') ? 'off' : 'on';
				Tasks.Edit(task);
			}else{
				if(confirm('是否确定要删除此项？\r\n\r\n点击确定删除，点击取消置为未完成。')){
					Tasks.Del(task);
					Tasks.RemoveHtml(task);
				}else{
					task.is_finished=!task.is_finished;
					var lbl=this.getElementsByTagName('label')[0];
					lbl.className= (lbl.className=='on') ? 'off' : 'on';
					Tasks.Edit(task);
				}
			}
		},true);
		Tasks.$taskItemList.appendChild(oDiv);	
	},
	RemoveHtml:function(task){
		var taskListDiv=Tasks.$taskItemList.getElementsByTagName('div');
		for(var i=0,len=taskListDiv.length;i<len;i++){
			var id=parseInt(taskListDiv[i].getAttribute('id').substring(5));
			if(id==task.id){
				Tasks.$taskItemList.removeChild(taskListDiv[i]);
				break;
			}
		}
	}
}


Tasks.init();






