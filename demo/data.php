<?php
    $page = $_GET['page'];
    $per_page = $_GET['pagelimit'];
    $page = $page >= 1 ? ($page-1) : $page;
    $total = 100;
    $start = $page * $per_page;
    $end = $start + $per_page;
    $data = array();
    $data['total'] = $total;
    $data['total_page'] = ceil($total/$per_page);
    $data['page'] = $page;
    
    for($i = $start; $i < $end; $i++){
        $data['data'][] = array('id'=>$i, 'name'=>'name_'.$i, 'email'=>'name_'.$i.'@github.com');
    }
    echo json_encode($data);


