
(function($){  

	 var methods = {
		 init : function( options ){
				var $this = $(this);
				var opts = $.extend({}, $.fn.nm8.defaults, options);
				window.aniMatrix = new Array(1);
				$this.data('animationSwitch',true);
				$.ajax({
					type: "GET",
					url: opts.screenplay,
					dataType: "xml",
					
					error:function (xhr, ajaxOptions, thrownError){
						alert(xhr.status);
						alert(thrownError);
					},
					
					success: function(xml) {
						$this.data('screenplay' , xml);
						$this.data('current' , 0);
						
						$(xml).find('stageconfig').each(function(){												
							$this.nm8('createStage',$(this).attr('width'), $(this).attr('height'),$(this).attr('border'));
						});	
						
						$(xml).find('style').each(function(){												
							$("<style type='text/css'>"+ $(this).text() +"</style>").appendTo("head");
						});

						$(xml).find('inventory item').each(function(){
							var itemId = $(this).attr('id');							
							//$this.nm8('addItem',itemId,$(this).text(),1, $(this).attr('width'),$(this).attr('height'), $(this).attr('startTop'), $(this).attr('startLeft'), $(this).attr('layer'),$(this).attr('onClick'));
							$this.nm8('addItem',itemId,$(this).text(),$(this).attr('hide'), $(this).attr('width'),$(this).attr('height'),$(this).attr('top'), $(this).attr('left'),$(this).attr('layer'),$(this).attr('onClick'),$(this).attr('parentID'));

						});
						
						$this.nm8('start');							

					}
				});			
 				
		 },
		 
		 start: function(){
			$(this).nm8('runScene',1); 
		 },
		 
		 runScene : function (id){
			var $this = $(this);
		 	var xml = $this.data('screenplay');	
			var delay = 0;
					
			if($this.data('current')){
				$(xml).find('scenes scene[id='+$this.data('current')+'] exit').each(function(){					
					$this.nm8('runActions',$(this), $this.data('current'));
					delay = $(this).attr('timeframe');	
				});				
			}
						
			$this.data('current', id );
			
			if(delay){
				setTimeout(function(){				
					$(xml).find('scenes scene[id='+id+'] init').each(function(){
						$this.nm8('runActions',$(this), id);	
					});				
				},delay);			
			} else {
				$(xml).find('scenes scene[id='+id+'] init').each(function(){
					$this.nm8('runActions',$(this), id);	
				});				
			}			
		
		 },
		 
		 runActions : function (itemActions, sceneId){			 	
			var $this = $(this);	
			function passThrough(subAction,sceneId){				
				$this.nm8('runActions',subAction,sceneId)	
			}			
				
			//console.log("runActions",itemActions,sceneId);
			$(itemActions).children('action').each(function(){	
				var $act = $(this);
				var itemID = $act.attr('itemID');
				//console.log("runActions",$act.attr('itemID'));
				switch($act.attr('name')){
					
					case "wait":
						//console.log('wait');						
						var myTimeout = setTimeout(function(){
								//clean up any timer functions on scene change								
								if($this.data('current') != sceneId){
									clearTimeout(myTimeout);
								} else{
									passThrough($act,sceneId);	
								}
							},$act.attr('delay'));						
						break;

					case "repeat":
						//console.log('repeat');						
						var count    = $act.attr('count');	
						//console.log(count)
						if(count){
							var myTimeouts = new Array(1);
							for(var i = 0; i < count; i++){
								//console.log(i)
								myTimeouts[i] = setTimeout(function(){
										//clean up any timer functions on scene change								
										if($this.data('current') != sceneId){
											clearTimeout(myTimeouts[i]);
										} else{
											passThrough($act,sceneId);	
										}
									},($act.attr('every') * i));								
								
							}
						} else {
						
							passThrough($act,sceneId);
							
							//clean up any timer functions on scene change							
							var myInterval = setInterval(function(){							
									if($this.data('current') != sceneId){
										 clearInterval(myInterval);
									} else{
										passThrough($act,sceneId);
									}
								},$act.attr('every'));
						}
						break;

					case "nextScene":
						//console.log("nextScene");							
						$this.nm8('nextScene');
						break;
					
					case "prevScene":
						//console.log("prevScene");						
						$this.nm8('prevScene');
						break;

					case "runScene":
						//console.log("runScene**");	//console.log($act);						
						$this.nm8('runScene',$act.attr('sceneId'));
						break;

					case "changeClass":											
						$this.nm8('changeClass',itemID,$act.attr('className'));
						break;

					case "show":						
						$this.nm8('showItem',itemID,$act.attr('speed'),$act.attr('effect'));
						break;
					
					case "hide":
						//console.log("HIDE");						
						$this.nm8('hideItem',itemID,$act.attr('speed'),$act.attr('effect'));
						break;

					case "openWindow":
						//console.log("openWindow");						
						$this.nm8('openWindow',$act.attr('href'),$act.attr('name'),$act.attr('opts'));
						break;


					case "shake":											
						$this.nm8('shakeItem',itemID,$act.attr('duration'),$act.attr('step'));
						break;
					
					case "bounce":											
						$this.nm8('bounceItem',itemID,$act.attr('duration'),$act.attr('step'));
						break;

					case "alterProperties":											
						$this.nm8('alterProperties',itemID,$act.attr('details'),$act.attr('animate'),$act.attr('duration'),$act.attr('easing'));
						break;

					case "move":											
						$this.nm8('moveItemTo',itemID,$act.attr('top'),$act.attr('left'),$act.attr('animate'),$act.attr('duration'),$act.attr('easing'));
						break;
						
					case "scrollH":
						//console.log('scrollItemHorizontal');
						$this.nm8('scrollItemHorizontal',itemID,$act.attr('direction'),$act.attr('duration'),$act.attr('step'));
						break;
						
					case "scrollV":
						$this.nm8('scrollItemVertical',itemID,$act.attr('direction'),$act.attr('duration'),$act.attr('step'));
						break;	
																										
					default:
						//console.log('Could not find:'+ $act.attr('name'));
				}
					
			});					
		 },			 
		 
		addItem : function( id, payload,hide,width,height, top, left, zindex, onClick, parentID ){			
			var $this = $(this);			
			var parentID = (parentID==null)? '#lens' : '#' + parentID + '_payload' ;
			hide = (hide==null)? 0 : hide ;
			top = (top==null)? 0 : top ;
			left = (left==null)? 0 : left ;
			strDisplay = "";			
			
			if(hide==1){
				strDisplay = "display:none;"
			}
			
			$(parentID).append("<div id='"+id+"' style='position:absolute;width:"+width+"px;height:"+height+"px;top:"+top+"px; left:"+left+"px; z-index:"+zindex+";'><div id='"+id+"_a' style='position:relative;'><div id='"+id+"_b' style='position:relative;'><div id='"+id+"_payload' style='"+strDisplay+"position:relative;'>"+payload+"</div></div></div></div>")
			
			$('#'+id+'_payload').unbind("click").click(function(e){					
				$this.nm8('runItemActions','click',id);
				return false;						
			});
			
		},

		 runItemActions : function (type,id){
			var $this = $(this);
		 	var xml = $this.data('screenplay');				
					
			$(xml).find('inventory item[id='+id+'] '+type+'').each(function(){					
				$this.nm8('runActions',$(this), $this.data('current'));						
			});				

		 },


		 
		prevScene:function(){
			var $this = $(this);	
			sceneID = $this.data('current' )-1;
			//console.log('run' + sceneID);
			$this.nm8('runScene',sceneID); 	 
		},

		nextScene:function(){
			var $this = $(this);				
			sceneID = $this.data('current' )+1;
			//console.log('run' + sceneID);
			$this.nm8('runScene',sceneID); 	 
		},		 
		 

		 scrollItemHorizontal: function (id,dir, duration,step){			
			id = '#'+id
			//console.log("scrollItemHorizontal",  id,dir, duration,step);
			var maxLeft = (0-10) - $(id).width();
			var maxRight = $('#lens').width() + 10;
			var $this = $(this);
			setInterval( function() {
				$this.nm8('horizontalMoveItem',id,  maxLeft, maxRight, step, dir );
			} ,duration);	
			
		},


		 changeClass: function (id, className){
			//console.log('changeClass',id, className);			
			id = '#'+id;
			$(id).attr('class', className);
		
		},

		 showItem: function (id, speed, effect){
			//console.log('showItem',id, speed, effect);			
			id = '#'+id+'_payload';
			$(id).show(effect,{},speed );//jqueryUI implementation			
		},

		 hideItem: function (id, speed, effect){
			//console.log('hideItem',id, speed, effect);			

			id = '#'+id+'_payload';
			$(id).hide(effect,{},speed);	//jqueryUI implementation		
		},


		 openWindow: function (href, name, opts){
			name = (name==null)? '' : name ;
			opts = (opts==null)? '' : opts ;
			
			//console.log('openWindow',href, name, opts);	
			

			
			window.open(href,name, opts);	
		},



		 horizontalMoveItem: function (id, maxLeft, maxRight, stepPx, dir){	
		 	var $this = $(this);		
			if($this.data('animationSwitch')){
				var currLeft =  $(id).css("left").replace(/[^0-9/-]/g, ''); 
				var newLeft = currLeft + stepPx;
				
				if(dir == "RTL"){
					newLeft = 1 * currLeft - stepPx;					
					if(newLeft <= maxLeft ){
						newLeft = maxRight;						
					}
				} else {
					newLeft = 1 * currLeft + 1 * stepPx;
					//console.log("nl:" + newLeft);
					if(newLeft >= maxRight ){
						newLeft = maxLeft;
							
					}
				}							
				
				$(id).css("left", newLeft+"px");
			}
		},



		 verticalMoveItem: function (id, maxTop, maxBottom, stepPx, dir){	
		 	var $this = $(this);
			//console.log(maxTop)	;	
			if($this.data('animationSwitch')){
				var currTop =  $(id).css("top").replace(/[^0-9/-]/g, ''); 
				var newTop = currTop + stepPx;
				
				if(dir == "up"){
					newTop = 1 * currTop - stepPx;
					if(newLeft <= maxTop ){newLeft = maxBottom;}
				} else {
					newTop = 1 * currTop + 1 * stepPx;
					
					if(newTop >= maxBottom ){newTop = maxTop;}
				}							
				//console.log(maxTop + " " + newTop)	;	
				$(id).css("top", newTop+"px");
			}
		},


		moveItemTo: function (id, top, left, animate, duration, easing){			
			var $this = $(this);
			$this.nm8('alterProperties',id,'{"top":"'+top+'","left":"'+left+'"}', animate, duration, easing );
		},

		alterProperties: function (id, details, animate, duration, easing){	
			//console.log("alterProperties",id, details, animate, duration, easing);
			id = '#'+id;
			animate = (animate==null)? 0 : animate ;
			duration = (duration==null)? 1 : duration ;
			easing = (easing==null)? "swing" : easing ;
			details = jQuery.parseJSON(details);
			if(animate==1){
				//console.log("changeCSS", 'animated');
				$(id).animate(details, duration, easing);	
			} else {				
				$(id).css(details)
			}
		},



		 scrollItemVertical: function (id,dir, duration,step){			
			id = '#'+id;
			var maxTop = (0-10) - $(id).height();
			var maxBottom = $('#lens').height() + 10;
			
			var $this = $(this);
			setInterval( function() {
				$this.nm8('verticalMoveItem',id,  maxTop, maxBottom, step, dir );
			} ,duration);	
			
		},
		
		bounceItem: function(id,duration,height){
			id = '#'+id+"_a";	
			//console.log(id,duration,height);
			var $this = $(this);
			$this.nm8('bounceItemStep',id, Math.floor(duration/2), height);
			setInterval( function() {
				$this.nm8('bounceItemStep',id, Math.floor(duration/2), height);
			} ,duration);	
		},
				
		bounceItemStep: function (id, duration, height){
			var $this = $(this);
			//console.log("step",id,duration,height);
			if($this.data('animationSwitch')) $(id).animate({top:"-="+height+"px"},duration).animate({top:"+="+height+"px"},duration);			
		},


		shakeItem: function(id,duration,width){
			//console.log(id,duration,width)	;	
			id = '#'+id+"_b";
			var $this = $(this);		
			$this.nm8('shakeItemStep',id, Math.floor(duration/2), width);
			setInterval( function() {
				$this.nm8('shakeItemStep',id, Math.floor(duration/2), width);
			} ,duration);	
		},
				
		shakeItemStep: function (id, duration, width){
			var $this = $(this);
			//console.log(id,duration,width)	;	
			if($this.data('animationSwitch')){
				//console.log('animationSwitch')	;	
				 $(id).animate({left:"-="+width+"px"},duration).animate({left:"+="+width+"px"},duration);			
			}
		},		
				 
		 createStage :	function( w, h, b ){
			$(this).empty();			
			var outH = (h * 1 + (b * 2));
			var outW = (w* 1  + (b * 2));		
			$(this).append("<div class='outer' style='width:"+outW+"px;height:"+outH+"px;'><div id='lens' style='top:"+ b +"px;left:"+ b +"px;width:"+ w +"px;height:"+ h +"px;'></div></div>");	
		}		 
	  };


	$.fn.nm8 = function(method) { 
		if ( methods[method] ) {
		  return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
		  return methods.init.apply( this, arguments );
		} else {
		  $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		} 

		var thisID = '#' + $(this).attr('id');		
     
	};  


	// plugin defaults - added as a property on our plugin function
	$.fn.nm8.defaults = {		
		screenplay: ''
	};	
	
})(jQuery);