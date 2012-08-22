<?php 
//only accept POST call
if (!isset($_POST)){
    header( '400 Bad Request');
    exit();
}

try{

    //get commit information
    $url="https://api.github.com/repos/cheungyang/herokuToys/commits";
    $str=get($url);
    $json=json_decode($str, true);
    $commit_info=$json[0];
    $commit_time=$commit_info["commit"]["committer"]["date"];
    $dir="../../../artifacts/herokuToys";

    //save files
    foreach($_POST as $name => $content){
        savefile($dir."/".$commit_time."/".$name, $content);
    }
    savefile($dir."/".$commit_time."/commit_info.json", json_encode($commit_info));
    savefile($dir."/pushflag", "1", 0777);

    header( '200 OKAY' );
    return ("0");

} catch(Exception $e){

    header( '500 Internal Server Error');
    echo $e->getMessage();

}


function savefile($filename, $content, $mode=false){
    $dir=dirname($filename);
    if (!file_exists($dir)){
        mkdir($dir, 0777, true);
    }
    $fh=fopen($filename, "w");
    fwrite($fh, $content);
    fclose($fh);
    if ($mode!==false){
        chmod($filename, $mode);
    }
}

function get($url){
    $ch = curl_init(); 
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
    $output = curl_exec($ch); 
    curl_close($ch);
    return $output;
}
?>
