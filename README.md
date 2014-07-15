VDataTable
---------------------
A simple js table component based on jQuery.

I want it have some features below:
  - simple
  - pagination and loaded data from specific data source.
  - different color
  - multiple choose
  - each line has a single primary id like DBMS table.
  - i18N
  - reorder
  - showing the corresponding operations for each item when mouseover.

usage:
==========
	<link type="text/css" rel="stylesheet" href="index.css"/>
	<script src="./jquery-1.10.1.min.js" type="text/javascript" language="javascript" charset="utf-8"></script>
	<script src="./jquery.vdatatable.js" type="text/javascript" language="javascript" charset="utf-8"></script>
	<script type="text/javascript" language="javascript" charset="utf-8">
	var mytable = 0;
	$(document).ready(function(){
		mytable = $('#shower').VDataTable({
			m_title_obj:'vtable_title',
			m_data_obj:'vtable_data',
			uniqueID:'id',
			pagelimit:10,
						item_height:'',//optional
			pageCallback:'showUserList',
			op:[
				{
					'content':'Edit',
					'desc':'edit this item',
					'callback':'func1'
				},{
					'content':'Del',
					'desc':'Delete this item',
					'callback':'func2'
				}
			],
			TitleBar:{//Title & data defintion
					'id':{
						'title':'ID',  //ID=>id 
						'w':'10%',
						'align':'left',
						'display':false,//do not display in title
						'data-align':'center'//the position of data displaying
					},
					'name':{
						'title':'Name',//with default view
						'w':'40%',
						'align':'left',
						'type':'html'  //ID=>id 
					},
					'email':{
						'title':'Email',
						'w':'50%',
						'align':'left',
						'title':'Email',
						'format':resetFormart,//a external function,invoke it before render
						'render':'<a href="javascript:void(0)" click="dotest(\'%key%\')">%%</a>'
					}
			},
			lang:{
				nodata:'No data founded',
				first:'First',
				next:'Next',
				prev:'Previous',
				last:'Last',
				choose_op:'Please choose:',
				total:'Total:',
				page:'Page',
				showing:'Showing',
				all:'All',
				revert:'Revert',
				cancel:'Cancel'
			}
		});
	});
	function func1(){

	}

	function func2(data){
		
	}
	function resetFormat(data){
		return data;
	}
</script>
