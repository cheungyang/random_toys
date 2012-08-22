<?php 
//get commit information
$baseurl="./workspace/builds";
$artifacturl="./workspace/artifacts";
$logurl="./logs";
    
//variables
if ( isset($_SERVER['argc']) && $_SERVER['argc']==4 ) {
    $projname=isset($argv[1])? $argv[1]: "tdd_toy";
    $env=isset($argv[2])? $argv[2]: "int";
    $machine=isset($argv[3])? $argv[3]: "ci1";
} else if ( isset($_GET["proj"]) ){
    $projname=isset($_GET["proj"])? $_GET["proj"]: "tdd_toy";
    $env=isset($_GET["env"])? $_GET["env"]: "int";
    $machine=isset($_GET["machine"])? $_GET["machine"]: "ci1";
} else {
    echo "syntax to run at cli: {$argv[0]} <projname> <int|prod> <ci1|ci2...>\n";
    exit();
}

//only accept POST call or cli call
if (!isset($_POST) && !isset($_SERVER['argc'])){
    header( '400 Bad Request');
    exit();
}

try{

    $url="https://api.github.com/repos/cheungyang/{$projname}/commits";
    $str=get($url);
    $json=json_decode($str, true);
    
    //TODO: do not only get the first one; get the one related to current project
    $commit_info=$json[0];
    $commit_time=$commit_info["commit"]["committer"]["date"];
    $dir="{$artifacturl}/{$projname}/{$env}";

    //save files
    foreach($_POST as $name => $content){
        savefile("{$dir}/{$commit_time}/{$name}", $content);
    }
    savefile("{$dir}/{$commit_time}/commit_info.json", json_encode($commit_info));

    //log push operation
    $logfilename="push|{$projname}|{$env}|{$machine}|".time();
    savefile("{$logurl}/{$logfilename}", "1", 0777);

    header('200 OKAY');
    return "0";

} catch(Exception $e){

    header('500 Internal Server Error');
    echo $e->getMessage();
    return "1";
    
}

function savefile($filename, $content, $mode=false){
    $dir=dirname($filename);
    if (!file_exists($dir)){
        mkdir($dir, 0777, true);
    }
    $fh=fopen($filename, "w");
    if ($fh){
        fwrite($fh, $content);
        fclose($fh);
        if ($mode!==false){
            chmod($filename, $mode);
        }
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
