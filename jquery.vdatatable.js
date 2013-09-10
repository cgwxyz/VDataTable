/*
@name: jQuery VDataTable plugins
@author: cgwxyz[cgwxyz@gmail.com]
@
*/
;(function($) {//[--jQuery Plugin Container

$.VDataTable = $.VDataTable || {version:'0.1.1'};

var VDataTable = function(node,opts) {

    var me=this,$me=$(this);
    var $mine=$(node); //get the plugin's Operation jQuery DOM Element

    //Public Methods
    $.extend(me, {
        getKeyValue: function() {    
            return __getKeyValue__();
        },
        loadDataByPage: function(page) {
            return __loadData__(page);
        },
        getSelected: function() {
            return __getSelected__();
        },
        getCurrValue: function() {
            return curr_value;
        },
        getSpecValue: function(key) {
            return m_data_holder[curr_value][key];
        },
        refresh:function(){
            return __refresh_();
        },
        addExtraParam:function(obj){
            return __addExtraParam__(obj);
        },
        resetExtraParam:function(){
            return __resetExtraParam__();
        },
        addLine: function(obj,addToTop) {//addToTop 0/1
            return __addLine__(obj,addToTop);
        },
        removeLine: function(id) {
            return __removeLine__(id);
        },
        updateLine: function(id,obj) {
            return __updateLine__(obj);
        },
        options: function() {
            //return the preset options to users code
            //let users can be change options by later code
            return opts;
        }
    });

    //Private Variables ( Module Level )
    var curr_page = 1;//default page parameter
    var curr_item = '';//save the id of current line after mouseenter;
    var curr_value = '';//save key value of current line.
    var mouse_move_direction = 0;//save previous the direction of mouse move 
    var prev_mouse_posy = 0;//save previous mouse position
    var extra_param = {};//save previous mouse position
    var m_data_holder = {};
    //init the plugin
    function __init__(){
        __initwrapper__();
    }
    
    __init__();
        
    function __initwrapper__(){
        $mine.append('<ul id="'+opts.m_title_obj+'"></ul><ul id="'+opts.m_data_obj+'"></ul><ul id="'+opts.m_ctrl_obj+'"></ul>');
        var tmp_id = '#'+opts.m_title_obj;
        //init titlebar
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
    function __addExtraParam__(obj){
        __resetExtraParam__();
        $.each(obj,function(key,value){
                extra_param[key] = value;
        });
    }
    function __resetExtraParam__(){
        extra_param = {};
    }
    function __refresh_(){
        __loadData__(curr_page);
    }
    function __loadData__(page){
        $('#op_bar').hide();
        
        var request_param = {};
        if(opts.hasOwnProperty('request_param')){
            $.each(opts.request_param,function(key,value){
                request_param[key] = value;
            });
        }
        $.each(extra_param,function(key,value){
            request_param[key] = value;
        });
        request_param['page'] = page;
        request_param['pagelimit'] = opts.pagelimit;
        request_param['ss'] = Math.random();
        
        $.ajax({
            url:opts.source,
            type:opts.request_way,
            data:request_param,
            success:function(res){
                source_data = $.parseJSON(res);
                var tmp_id = '#'+opts.m_data_obj;
                $('.vdata_li').remove();//empty data area.
                var total = source_data.data.length;
                if(total==0){
                    $('<li class="vdata_li">'+__parseLang__('nodata')+'</li>').appendTo($(tmp_id));
                }else{
                    m_data_holder = {};
                    $.each(source_data.data,function(index,value){
                        var unique_value = __initLine__(tmp_id,value,0);
                        m_data_holder[unique_value] = value;
                        __initLineEventHandler__(unique_value);
                    });
                    __colorLine__();
                    __showPageBar__(source_data.total,source_data.total_page,page);
                }
            }
        });
    }
    
    function renderItem(render,key,value,key,key_bak){
        var tmp_val = (key == key_bak)?unique_value:value[key];
        render = render.replace('%%',tmp_val).replace('%key%',key);
        $.each(value,function(key,val){//fill with corresponding value
            var tmp_key = '%'+key+'%';
            render = render.replace(tmp_key,val);
        });
        return render;
    }
    
    function __initLine__(parent_id,value,default_insert_way){
        var unique_value = 0;
        var unique_key = '';
        $.each(value,function(key,val){
            if(key==opts.uniqueID){//unique ID
                unique_value = val;
                unique_key = key;
            }
        });
        if(unique_key == ''){
            alert("No primary key founded,please check the data format");
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
                    tmp_item.html('<input type="checkbox" id="'+opts.prefix+'key_'+unique_value+'" value="'+unique_value+'" name="'+opts.prefix+'key[]">');
                    tmp_item.css('float','left').css('width',opts.TitleBar[key].w);
                }else{
                    tmp_item.css('float','left').css('overflow','hidden').css('width',opts.TitleBar[key].w);
                    var tmp_val = (key == key_bak)?unique_value:value[key];
                    if(opts.TitleBar[key].hasOwnProperty('format')){//invoke format function
                        if(opts.TitleBar[key].hasOwnProperty('format_param'))//send whole line data to it
                            tmp_val = opts.TitleBar[key]['format'](tmp_val,value,opts.TitleBar[key]['format_param']);
                        else
                            tmp_val = opts.TitleBar[key]['format'](tmp_val);
                    }
                    if(opts.TitleBar[key].hasOwnProperty('render')){//go to render
                        tmp_item.html(renderItem(opts.TitleBar[key]['render'],unique_value,value,key,key_bak));
                    }else{//normal html
                        if(tmp_val.length<1)
                            tmp_item.html('&nbsp;');
                        else
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
    function __initLineEventHandler__(unique_value){
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
                mouse_move_direction = 1;//move downward
            }else{
                mouse_move_direction = 0;//move upward
            }
            prev_mouse_posy = e.pageY;
            if(mouse_move_direction == 1){
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
            
            //save the value of curr item.
            var tmp_arr = $(this).attr('id').split('_');
            var tmp_checkbox = '#'+opts.prefix+'key_'+tmp_arr[tmp_arr.length-1];
            curr_value = $(tmp_checkbox).val();
            //get position
            var tmp_pos = $(this).position();
            var tmp_height = opts.item_height||$(this).height();
                    
            $('#op_bar').on('mouseleave',function(){
                $(this).hide();
                $(curr_item).removeClass('yselected');
            }).css('position','absolute')
                .css('left',tmp_pos.left+'px')
                .css('top',tmp_pos.top+tmp_height+'px')
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
        var tmp_label = $('<span>&nbsp;&nbsp;'+opts.lang.choose_op+'&nbsp;&nbsp;</span>');
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
        $('#vdata_pagebar_li').html(opts.lang.total+total+'&nbsp;['+first_page+'&nbsp;|&nbsp;'+up_page+'&nbsp;|&nbsp;'+next_page+'&nbsp;|&nbsp;'+last_page+']&nbsp;'+opts.lang.showing+'<input type="hidden" id="vdatatable_totalpage" value="'+total_page+'"><input type="text" id="vdatatable_currpage" maxlength="10" value="'+curr_page+'"/>/'+total_page+opts.lang.page);
        $('#vdatatable_currpage').keyup(function(event){
            if(event.which == 13){
                var tmp_page = parseInt($(this).val());
                var total_page = parseInt($('#vdatatable_totalpage').val());
                if(tmp_page>total_page){
                    tmp_page = total_page;
                }else if(tmp_page<1){
                    tmp_page = 1;
                }
                curr_page = tmp_page;
                __loadData__(curr_page);
            }
        });

    }
    function __showSelectBar__(){
        var tmp_all = $('<a href="javascript:void(0)">'+opts.lang.all+'</a>');
        tmp_all.bind('click',{msg:1},__setSelected__);
        var tmp_revert = $('<a href="javascript:void(0)">'+opts.lang.revert+'</a>');
        tmp_revert.bind('click',{msg:2},__setSelected__);
        var tmp_cancel = $('<a href="javascript:void(0)">'+opts.lang.cancel+'</a>');
        tmp_cancel.bind('click',{msg:3},__setSelected__);
        
        tmp_all.appendTo($('#vdata_select_li'));
        tmp_revert.appendTo($('#vdata_select_li'));
        tmp_cancel.appendTo($('#vdata_select_li'));
    }
    function __setSelected__(event){
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
    function __getSelected__(){
        var tmp_name=opts.prefix+'key[]';
        var tmp_data = [];
        $("input:checkbox[name='"+tmp_name+"'][checked]").each(function(){
            tmp_data.push($(this).val());
        });
        return tmp_data;
    }
    function __addLine__(obj,addToTop){
        var tmp_box_id = '#'+opts.prefix+'item_'+obj.id;
        if($(tmp_box_id).length > 0){
            alert("The primary key has existed");
        }else{
            var tmp_id = '#'+opts.m_data_obj;
            var unique_value = __initLine__(tmp_id,obj,addToTop);
            __initLineEventHandler__(unique_value);
            __colorLine__();
        }
    }
    function __updateLine__(obj){
        if(obj.hasOwnProperty(opts.uniqueID)){
            var tmp_box_id = '#'+opts.prefix+'item_'+obj[opts.uniqueID];
            if($(tmp_box_id).length > 0){
                var unique_value = obj[opts.uniqueID];
                var key_bak = opts.uniqueID+'_bak';
                $.each(opts.TitleBar,function(key,val){
                    if(key !=opts.uniqueID  && key !=key_bak){
                        var tmp_key = '#'+opts.prefix+key+'_'+obj[opts.uniqueID];
                        var tmp_val = obj[key];
                        if(val.hasOwnProperty('format')){
                            if(val.hasOwnProperty('format_param')){//send whole line data to it
                                tmp_val = val['format'](tmp_val,unique_value,val['format_param']);
                            }else{
                                tmp_val = val['format'](tmp_val);
                            }
                        }
                        if(val.hasOwnProperty('render')){
                            $(tmp_key).html(renderItem(val.TitleBar[key]['render'],unique_value,tmp_val));
                        }else{
                            $(tmp_key).html(tmp_val);
                        }
                    }
                });
                return true;
            }else{
                alert("No matched data founded");
                return false;
            }
        }else{
            alert("No primary key founded,please verify the new data");
            return false;
        }
    }
    function __removeLine__(key){
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
        source:'',//Ajax data source
        request_way:'get',
        request_param:{},
        uniqueId:'',//the unique field name,
        prefix:'vt_',//add before wach item
        TitleBar:{},//Title & data defintion
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
            last:'Last',
            choose_op:'choose operation:'
        },
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
