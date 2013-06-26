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
		loadDataByPage: function(page) {
			return __loadData__(page);
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
	var numPat = new RegExp('^[0-9]+$','i'); 
    //init the plugin
    function __init__(){
		__initwrapper__();
    }
	
    __init__();
		
	function __initwrapper__(){
		$mine.append('<ul id="'+opts.m_title_obj+'"></ul><ul id="'+opts.m_data_obj+'"></ul><ul id="'+opts.m_ctrl_obj+'"></ul>');
		var tmp_id = '#'+opts.m_title_obj;
		$.each(opts.TitleBar,function(index,value){
			var tmp_obj = $('<li style="width:'+value.w+';text-align:'+value.align+';"></li>');
			tmp_obj.appendTo($(tmp_id));
			if(value.hasOwnProperty('display') && !value.display)
				tmp_obj.html('&nbsp;');
			else
				tmp_obj.html(value.title);
		});
		//show op bar
		__showOpBar__($(tmp_id));
		//show select bar		
		var ctrl_id = '#'+opts.m_ctrl_obj;
		//$(ctrl_id).html('');
		$('<li class="vdata_select_li" id="vdata_select_li"></li>').appendTo($(ctrl_id));
		__showSelectBar__();
		//show page bar
		$('<li class="vdata_pagebar_li" id="vdata_pagebar_li"></li>').appendTo($(ctrl_id));
		__loadData__(curr_page);
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
	function __loadData__(page){
		$('#op_bar').hide();
		$.ajax({
			url:opts.source,
			type:opts.request_way,
			data:{page:page,pagelimit:opts.pagelimit,ss:Math.random()},
			success:function(res){
				source_data = $.parseJSON(res);
				var tmp_id = '#'+opts.m_data_obj;
				$('.vdata_li').remove();
				var total = source_data.data.length;
				if(total==0){
					$('<li class="vdata_li">'+__parseLang__('nodata')+'</li>').appendTo($(tmp_id));
				}else{
					$.each(source_data.data,function(index,value){
						var unique_value = __initItem__(tmp_id,value,0);
						__initItemEventHandler__(unique_value);
					});
					__colorLine__();
					__showPageBar__(source_data.total,source_data.total_page,page);
				}
			}
		});
	}
	function renderItem(render,key,data){
		return render.replace('%key%',key).replace('%%',data);
	}
	function __initItem__(parent_id,value,default_insert_way){
		var unique_value = 0;
		var unique_key = '';
		$.each(value,function(key,val){
			if(key==opts.uniqueID){//unique ID
				unique_value = val;
				unique_key = key;
			}
		});
		if(unique_key == ''){
			alert("没有找到主键，请检查数据样式");
			return false;
		}
		var tmp_line = $('<li class="vdata_li" id="'+opts.prefix+'item_'+unique_value+'"></li>');
		if(default_insert_way == 0)
			tmp_line.appendTo($(parent_id));
		else
			tmp_line.prependTo($(parent_id));
		
		$.each(opts.TitleBar,function(key,val){
				var key_bak = opts.uniqueID+'_bak';
				var tmp_item = $('<div id="'+opts.prefix+key+'_'+unique_value+'"></div>');
				if(key == opts.uniqueID){//unique ID only display as checkbox
					tmp_item.html('<input type="checkbox" id="'+opts.prefix+'key_'+unique_value+'" value="'+val+'" name="'+opts.prefix+'key[]">');
					tmp_item.css('float','left').css('width',opts.TitleBar[key].w);
				}else{
					tmp_item.css('float','left').css('overflow','hidden').css('width',opts.TitleBar[key].w);
					var tmp_val = (key == key_bak)?unique_value:value[key];
					if(opts.TitleBar[key].hasOwnProperty('render')){//go to render
						tmp_item.html(renderItem(opts.TitleBar[key]['render'],unique_value,tmp_val));
					}else{//normal html
						tmp_item.html(tmp_val);
					}
				}
				if(opts.TitleBar[key].hasOwnProperty('data-align')){
					tmp_item.css('textAlign',opts.TitleBar[key]['data-align']);
				}
				tmp_item.appendTo(tmp_line);
		});	
		return unique_value;
	}
	function __initItemEventHandler__(unique_value){
		var tmp_id = '#'+opts.prefix+'item_'+unique_value;
		var tmp_item = $(tmp_id);
		
		var tmp_check_id = '#'+opts.prefix+'key_'+unique_value;
		
		$(tmp_check_id).change(function(){
			if(this.checked){
				tmp_item.addClass('getchecked');
			}else{
				tmp_item.removeClass('getchecked');
			}
		});
		
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
			if(curr_item){//set previous status
				$(curr_item).removeClass('yselected');
			}
			curr_item = '#'+$(this).attr('id');//save as previous
			$(this).toggleClass('yselected');
			//get position
			var tmp_pos = $(this).position();
					
			$('#op_bar').on('mouseleave',function(){
				$(this).hide();
				$(curr_item).removeClass('yselected');
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
		var first_page = '<a href="javascript:'+opts.pageCallback+'(1)">'+opts.lang.first+'</a>';
		var last_page = '<a href="javascript:'+opts.pageCallback+'('+total_page+')">'+opts.lang.last+'</a>';
		var up_page = '';
		var next_page = '';

		var next = curr_page+1;
		var up = curr_page-1;

		if(curr_page<total_page && curr_page>1){
			first_page = '<a href="javascript:'+opts.pageCallback+'(1)">'+opts.lang.first+'</a>';
			next_page = '<a href="javascript:'+opts.pageCallback+'('+next+')">'+opts.lang.next+'</a>';
			up_page = '<a href="javascript:'+opts.pageCallback+'('+up+')">'+opts.lang.prev+'</a>';
			last_page = '<a href="javascript:'+opts.pageCallback+'('+total_page+')">'+opts.lang.last+'</a>';
		}else if(curr_page>=total_page-1 && curr_page>1){
			first_page = '<a href="javascript:'+opts.pageCallback+'(1)">'+opts.lang.first+'</a>';
			next_page = opts.lang.next;
			up_page = '<a href="javascript:'+opts.pageCallback+'('+up+')">'+opts.lang.prev+'</a>';	
			last_page = opts.lang.last;
		}else if(curr_page == 1 && total_page > 1){
			first_page = opts.lang.first;
		 	next_page = '<a href="javascript:'+opts.pageCallback+'('+next+')">'+opts.lang.next+'</a>';
			up_page = opts.lang.last;
			last_page = '<a href="javascript:'+opts.pageCallback+'('+total_page+')">'+opts.lang.last+'</a>';
		}else{
			up_page = opts.lang.prev;
			next_page = opts.lang.next;
		}
		$('#vdata_pagebar_li').html('记录总数:'+total+'&nbsp;['+first_page+'&nbsp;|&nbsp;'+up_page+'&nbsp;|&nbsp;'+next_page+'&nbsp;|&nbsp;'+last_page+']&nbsp;第'+curr_page+'/'+total_page+'页');
	}
	function __showSelectBar__(){
		var tmp_all = $('<a href="javascript:void(0)">'+opts.lang.all+'</a>');
		tmp_all.bind('click',{msg:1},__getSelected);
		var tmp_revert = $('<a href="javascript:void(0)">'+opts.lang.revert+'</a>');
		tmp_revert.bind('click',{msg:2},__getSelected);
		var tmp_cancel = $('<a href="javascript:void(0)">'+opts.lang.cancel+'</a>');
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
				$("input:checkbox[name='"+tmp_name+"']").each(function(){
					$(this).attr('checked',!$(this).attr('checked'));
					$(this).parent().parent().toggleClass('getchecked');
				});
			break;
			case 3:
				$("input:checkbox[name='"+tmp_name+"']").each(function(){$(this).parent().parent().removeClass('getchecked');});
				$("input:checkbox[name='"+tmp_name+"'][checked]").each(function(){$(this).attr('checked',false);});
			break;
		}
	}
	function __addItem__(obj){
		var tmp_box_id = '#'+opts.prefix+'item_'+obj.id;
		if($(tmp_box_id).length > 0){
			alert("同样键值的记录已经存在，不允许添加");
		}else{
			var tmp_id = '#'+opts.m_data_obj;
			var unique_value = __initItem__(tmp_id,obj,1);
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
		m_title_obj:'vtable_title',
		m_data_obj:'vtable_data',
		m_ctrl_obj:'vtable_ctrl',
		ctrl:[],
		lang:{
			nodata:'No data founded',
			first:'First',
			next:'Next',
			prev:'Previous',
			last:'Last'
		},
		source:'',//Ajax data source
		request_way:'get',
		request_param:{},
        uniqueId:'',//the unique field name,
        prefix:'vt_',//add before wach item
		TitleBar:{},//Title & data defintion
        api:true
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