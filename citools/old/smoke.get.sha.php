<?php 
try{

    error_reporting(-1);

    //get commit information
    $url="https://api.github.com/repos/cheungyang/herokuToys/commits";
    $str=get($url);
    $json=json_decode($str, true);
    $sha=$json[0]["commit"]["tree"]["sha"];
    echo $sha;

} catch(Exception $e){

    echo ""; //$e->getMessage();

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
