VDataTable
==========

A simple js table component based on jQuery.
I want it have some features below:
1.simple
2.pagination and loaded data from specific data source.
3.different color
4.multiple choose
5.each line has a single primary id like DBMS table.
6.i18N
7.reorder
8.showing the corresponding operations for each item when mouseover.


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
						'type':'checkbox'  //ID=>id 
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
						'type':'href',
						'title':'Email',
						'src':''
					}
			},
			lang:{
				nodata:'No data founded',
				first:'First',
				next:'Next',
				prev:'Previous',
				last:'Last'
			}
		});
	});
	function func1(){

	}

	function func2(data){
		
	}
	
</script>