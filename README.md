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

DEMO:
==========
clone the whole project to web document root path. 

visit http://localhost/Vdatatable/index.html

the php return a json object:

'{"total":100,"total_page":10,"page":"1","data":[{"id":10,"name":"name_10","email":"name_10@github.com"},{"id":11,"name":"name_11","email":"name_11@github.com"},{"id":12,"name":"name_12","email":"name_12@github.com"},{"id":13,"name":"name_13","email":"name_13@github.com"},{"id":14,"name":"name_14","email":"name_14@github.com"},{"id":15,"name":"name_15","email":"name_15@github.com"},{"id":16,"name":"name_16","email":"name_16@github.com"},{"id":17,"name":"name_17","email":"name_17@github.com"},{"id":18,"name":"name_18","email":"name_18@github.com"},{"id":19,"name":"name_19","email":"name_19@github.com"}]}'



usage:
==========
	<link type="text/css" rel="stylesheet" href="index.css"/>
<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
<script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
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
