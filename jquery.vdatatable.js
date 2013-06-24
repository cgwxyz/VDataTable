/*
@name: jQuery Plugin Template for Coding
*/
;(function($) {//[--jQuery Plugin Container

//declare the plugin's version ; use to check the plugin exists
$.VDataTable = $.VDataTable || {version:'0.1.0'};

//[--Plugin Define
var VDataTable = function(node,opts) {

    var me=this,$me=$(this);
    var $mine=$(node); //get the plugin's Operation jQuery DOM Element

    //Public Methods
    $.extend(me, {
        getKeyValue: function() {         
			return __getKeyValue__();
        },
		removeItem: function(id) {         
			return __removeItem__(id);
        },
		addItem: function(obj) {
			return __addItem__(obj);
        },
        options: function() {
            //return the preset options to users code
            //let users can be change options by later code
            return opts;
        }
    });

    //Private Variables ( Module Level )
    var m_var1, m_var2, m_var3;
	var curr_page = 1;
	var curr_item = '';
	var curr_key_id = '';
	var mouse_move_direct = 0;
	var prev_mouse_posy = 0;
	
    //init the plugin
    function __init__(){
		__initwrapper__();
    }
	
    __init__();
		
	function __initwrapper__(){
		$(opts.target).append('<ul id="'+opts.m_title_obj+'"></ul><ul id="'+opts.m_data_obj+'"></ul>');
		var tmp_id = '#'+opts.m_title_obj;
		$.each(opts.TitleBar,function(index,value){
			$('<li style="width:'+value.w+';text-align:'+value.align+';">'+value.title+'</li>').appendTo($(tmp_id));
		});
		__loadData__();
	}
	function __parseLang__(key,data){
		if(arguments.length==0){
			return '';
		}
		var target_word = opts.lang[key];
		if(arguments.length==2){
			if(target_word.indexOf('%%')!=-1){
				var str_arr = target_word.split('%%');
				return str_arr[0]+arguments[1]+str_arr[1];
			}else {
				return target_word;
			}
		}else if(arguments.length==3){
			if(target_word.indexOf('%%')!=-1){
				var str_arr = target_word.split('%%');
				return str_arr[0]+arguments[1]+str_arr[1]+arguments[2]+str_arr[2];
			}else {
				return target_word;
			}
		}
		return target_word;
	}
	function __loadData__(){
		var source_data = '{"total":20,"total_page":5,"data":[{"id":0,"name":"usera8askd65465","email":"ussd0@abc.com"},{"id":1,"name":"user1","email":"ussd1@abc.com"},{"id":2,"name":"user2","email":"ussd2@abc.com"},{"id":3,"name":"user3","email":"ussd3@abc.com"},{"id":4,"name":"user4","email":"ussd4@abc.com"},{"id":5,"name":"user5","email":"ussd5@abc.com"},{"id":6,"name":"user6","email":"ussd6@abc.com"},{"id":7,"name":"user7","email":"ussd7@abc.com"},{"id":8,"name":"user8","email":"ussd8@abc.com"},{"id":9,"name":"user9","email":"ussd9@abc.com"}]}';
		/*$.ajax({
			url:opts.source,
			type:'post',
			data:{ss:Math.random()},
			success:function(res){*/
			source_data = $.parseJSON(source_data);
				var tmp_id = '#'+opts.m_data_obj;
				$('.vdata_li').remove();
				var total = source_data.data.length;
				if(total==0){
					$('<li class="vdata_li">'+__parseLang__('nodata')+'</li>').appendTo($(tmp_id));
				}else{
					$.each(source_data.data,function(index,value){
						var unique_value = __initItem__(tmp_id,value);
						__initItemEventHandler__(unique_value);
					});
					__colorLine__();
					//show op bar
					__showOpBar__($(tmp_id));
					//show select bar
					$('<li class="vdata_select_li" id="vdata_select_li"></li>').appendTo($(tmp_id));
					__showSelectBar__();
					//show page bar
					$('<li class="vdata_pagebar_li" id="vdata_pagebar_li"></li>').appendTo($(tmp_id));
					__showPageBar__(source_data.total,source_data.total_page,curr_page);
				}
			/*}
		})*/
	}
	function __initItem__(parent_id,value){
		var unique_value = 0;
		$.each(value,function(key,val){
			if(key==opts.uniqueID){//unique ID
				unique_value = val;
			}
		});
		var str = '<li class="vdata_li" id="'+opts.prefix+'item_'+unique_value+'">';
		$.each(value,function(key,val){
			if(key==opts.uniqueID){//unique ID
				if(opts.TitleBar[key]['type']=='checkbox'){
					str += '<div style="float:left;width:10%"><input type="checkbox" id="'+opts.prefix+'key_'+unique_value+'" value="'+val+'" name="'+opts.prefix+'key[]"></div>';
				}else{
					str += '<div style="float:left;width:40%;word-wrap:break-word; overflow:hidden;"  id="'+opts.prefix+key+'_'+unique_value+'">'+val+'</div>';
				}
			}else{
				str += '<div style="float:left;width:45%;word-wrap:break-word; overflow:hidden;" id="'+opts.prefix+key+'_'+unique_value+'">'+val+'</div>';	
			}
		});
		str += '</li>';
		var tmp_item = $(str);
		tmp_item.appendTo($(parent_id));
		return unique_value;
	}
	function __initItemEventHandler__(unique_value){
		var tmp_id = '#'+opts.prefix+'item_'+unique_value;
		var tmp_item = $(tmp_id);
		//add click/mouseenter/mouseleave listener
		tmp_item.click(function(){
			var tmp_box_id = $(this).attr('id').split('_');
			tmp_box_id = '#'+opts.prefix+'key_'+tmp_box_id[2];
			$(tmp_box_id).attr('checked',!$(tmp_box_id).attr('checked'));
			$(this).toggleClass('getchecked');
		});
		/*tmp_item.on('mouseleave',function(){
							$('#op_bar').hide();
							$(this).toggleClass('yselected');
		});*/
		tmp_item.on('mousemove',function(e){
			if(e.pageY > prev_mouse_posy){
				mouse_move_direct = 1;//move downward
			}else{
				mouse_move_direct = 0;//move upward
			}
			prev_mouse_posy = e.pageY;
			if(mouse_move_direct == 1){
				$(this).off('mouseleave');
			}else{
				$(this).on('mouseleave',function(){
					$('#op_bar').hide();
					$(this).removeClass('yselected');
				});
			}
		});

		tmp_item.on('mouseenter',function(e){
			//__doDebug__("curr item is:"+curr_item);
			if(curr_item){//set previous status
				$(curr_item).removeClass('yselected');
			}
			curr_item = '#'+$(this).attr('id');//save as previous
			//__doDebug__("save curr item is:"+curr_item);
				
			$(this).toggleClass('yselected');
					
			//get position
			var tmp_pos = $(this).position();
					
			$('#op_bar').on('mouseleave',function(){
				$(this).hide();
				//__doDebug__("go to remove curr item is:"+curr_item);	
				$(curr_item).removeClass('yselected');
				//re open
				/*$(curr_item).on('mouseleave',function(){
					$('#op_bar').hide();
					$(this).removeClass('yselected');
				});*/
			}).on('mouseenter',function(){
				//$(curr_item).off('mouseleave');
			}).css('position','absolute')
				.css('left',tmp_pos.left+'px')
				.css('top',tmp_pos.top+25+'px')
				.css('width',$(this).css('width'))
				.show();
		});
	}
	function __colorLine__(){
		$('.vdata_li').each(function(index){
			if( index%2 == 0 )
				$(this).addClass('spec');
			else{
				$(this).removeClass('spec');
			}
		});
	}
	
	function __doDebug__(str){
		//$('#debugbox').html($('#debugbox').html()+'<p>'+str+'</p>');
	}
	
	function __getKeyValue__(){
		if(curr_item){
			var tmp_arr = curr_item.split('_');
			return tmp_arr[tmp_arr.length-1];
		}else{
			return false;
		}
	}
	
	function __showOpBar__(parent_node){
		var tmp_obj = $('<div id="op_bar"></div>');
		var tmp_label = $('<span>&nbsp;&nbsp;请选择操作:&nbsp;&nbsp;</span>');
		tmp_label.appendTo(tmp_obj);
		$.each(opts.op,function(index,value){
			$('<a href="javascript:void(0)" title="'+value.desc+'" onclick="return '+value.callback+'()">'+value.content+'</a>').appendTo(tmp_obj);
		});
		tmp_obj.appendTo(parent_node).hide();
	}
	
	function __showPageBar__(total,total_page,curr_page){
		var first_page = '<a href="javascript:'+opts.pageCallback+'(1)">首页</a>';
		var last_page = '<a href="javascript:'+opts.pageCallback+'('+total_page+')">末页</a>';
		var up_page = '';
		var next_page = '';

		var next = curr_page+1;
		var up = curr_page-1;

		if(curr_page<total_page && curr_page>1){
			first_page = '<a href="javascript:'+opts.pageCallback+'(1)">首页</a>';
			next_page = '<a href="javascript:'+opts.pageCallback+'('+next+')">下一页</a>';
			up_page = '<a href="javascript:'+opts.pageCallback+'('+up+')">上一页</a>';
			last_page = '<a href="javascript:'+opts.pageCallback+'('+total_page+')">末页</a>';
		}else if(curr_page>=total_page-1 && curr_page>1){
			first_page = '<a href="javascript:'+opts.pageCallback+'(1)">首页</a>';
			next_page = '下一页';
			up_page = '<a href="javascript:'+opts.pageCallback+'('+up+')">上一页</a>';	
			last_page = '末页';
		}else if(curr_page == 1 && total_page > 1){
			first_page = '首页';
		 	next_page = '<a href="javascript:'+opts.pageCallback+'('+next+')">下一页</a>';
			up_page = '上一页';
			last_page = '<a href="javascript:'+opts.pageCallback+'('+total_page+')">末页</a>';
		}else{
			up_page = '上一页';
			next_page = '下一页';
		}
		$('#vdata_pagebar_li').html('记录总数:'+total+'&nbsp;['+first_page+'|'+up_page+'|'+next_page+'|'+last_page+']&nbsp;第'+curr_page+'/'+total_page+'页');
	}
	function __showSelectBar__(){
		var tmp_all = $('<a href="javascript:void(0)">全选</a>');
		tmp_all.bind('click',{msg:1},__getSelected);
		var tmp_revert = $('<a href="javascript:void(0)">反选</a>');
		tmp_revert.bind('click',{msg:2},__getSelected);
		var tmp_cancel = $('<a href="javascript:void(0)">取消</a>');
		tmp_cancel.bind('click',{msg:3},__getSelected);
		
		tmp_all.appendTo($('#vdata_select_li'));
		tmp_revert.appendTo($('#vdata_select_li'));
		tmp_cancel.appendTo($('#vdata_select_li'));
	}
	function __getSelected(event){
		var tmp_name=opts.prefix+'key[]';
		switch(event.data.msg){
			case 1:
				$("input:checkbox[name='"+tmp_name+"']").each(function(){$(this).attr('checked',true);$(this).parent().parent().addClass('getchecked');});
			break;
			case 2:
				$("input:checkbox[name='"+tmp_name+"']").each(function(){$(this).attr('checked',!$(this).attr('checked'))});
			break;
			case 3:
				$("input:checkbox[name='"+tmp_name+"'][checked]").each(function(){$(this).attr('checked',false);$(this).parent().parent().removeClass('getchecked');});	
			break;
		}
	}
	function __addItem__(obj){
		var tmp_box_id = '#'+opts.prefix+'item_'+obj.id;
		if($(tmp_box_id)){
			alert("同样键值的记录已经存在，不允许添加");
		}else{
			var tmp_id = '#'+opts.m_data_obj;
			var unique_value = __initItem__(tmp_id,obj);
			__initItemEventHandler__(unique_value);
			__colorLine__();
		}
	}
	function __removeItem__(key){
		var tmp_box_id = '#'+opts.prefix+'item_'+key;
		$(tmp_box_id).remove();
		__colorLine__();
	}
};//--]Plugin Define

//jQuery Plugin Implementation
$.fn.VDataTable = function(conf) {

    //return existing instance // let users can use the Public Methods
    //Usage: var obj = $('#id').VDataTable({ <options> }).data("VDataTable");
    var el = '';
	el = this.eq(typeof conf == 'number' ? conf : 0).data("VDataTable");
	if(typeof el == 'object'){el = undefined;}
	//$('#box').append('<p>el is'+el+',type is'+typeof el+'</p>');
	if (el) { return el; }

    //setup default options
    var opts = {
		w:'100%',
		h:'auto',
		m_title_obj:'vtable_title',
		m_data_obj:'vtable_data',
		target:'',
		ctrl:[],
		lang:{
			nodata:'No data founded',
			first:'First',
			next:'Next',
			prev:'Previous',
			last:'Last'
		},
		source:'',//Ajax data source
        uniqueId:'',//the unique field name,
        prefix:'vt_',//add before wach item
		TitleBar:{},//Title & data defintion
		reorderAble:false,
        api:true,
		overlayBgColor: 		'#000',		// (string) Background color to overlay; inform a hexadecimal value like: #RRGGBB. Where RR, GG, and BB are the hexadecimal values for the red, green, and blue values of the color.
		overlayOpacity:			0.8,
		containerBorderSize:	0,
		containerResizeSpeed:	100
    };

    //if no users options then use the default options
    $.extend(opts, conf);

    // install the plugin for each items in jQuery
    this.each(function() {
        el = new VDataTable(this, opts);
        $(this).data("VDataTable", el);
    });

    //api=true let users can immediate use the Public Methods
    return opts.api ? el: this;

};

})(jQuery);//--]jQuery Plugin Container