<?php 
//get log diretory
$currentbase=dirname(realpath(__FILE__));
$logdir=$currentbase."/logs";

//cli case
if ( isset($_SERVER['argc']) && $_SERVER['argc']==5 ) { 
    $op=isset($argv[1])? $argv[1]: "push";
    $projname=isset($argv[2])? $argv[2]: "tdd_toy";
    $env=isset($argv[3])? $argv[3]: "int";
    $machine=isset($argv[4])? $argv[4]: "ci1";
}
/* else {
    echo "manual-run syntax is: {$argv[0]} <push> <proj> <int|prod> <ci1|ci2...>\n";
    exit();
}*/

//manual run
if (isset($op)){
    operationByOp($op, $projname, $env, $machine);
}
//read files in log
elseif ($h=opendir($logdir)){
    while (false !== ($entry = readdir($h))){
        if ($entry != "." && $entry != ".."){
            echo "[OPERATION] processing request {$entry}...\n";
            list($op, $projname, $env, $machine, $ts)  = explode("|", $entry);
            //echo "op:{$op}, proj:{$projname}, env:{$env}, machine:{$machine}, base:{$base}\n";
            $status = operationByOp($op, $projname, $env, $machine);

            //delete log file
            if ($status==0){
                echo "[OPERATION] deleting file {$logdir}/{$entry}...";
                unlink($logdir."/".$entry);
            }
        }
    }
} else {
    echo "[FAILED] cannot open log directory {$logdir} for reading\n";
    exit();
}



function operationByOp($op, $projname, $env, $machine){
    if ($op == "push"){
        echo "[OPERATION] deploying code to Heroku...\n";
        $status =  deployHeroku($projname, $env, $machine);                
        if ($status==0){
            $status = operationByOp("sha", $projname, $env, $machine);
        }
        return $status;
    }
    elseif ($op == "sha") {
        echo "[OPERATION] committing sha key to git...\n";
        return commitSha($projname, $env);                
    }    
    else {
        echo "[NOOP]\n";
        return -1;
    }
}

function deployHeroku($projname, $env, $machine){
    //get commit information
    $currentbase=dirname(realpath(__FILE__));
    $basedir="/workspace/builds";
    $artifactdir="/workspace/artifacts";
    $logdir="/logs";
    $base="{$currentbase}{$basedir}";

    ob_start();
    passthru("cd {$base} && rm -Rf {$projname} && git clone git@github.com:cheungyang/{$projname}.git && cd {$base}/{$projname} && heroku accounts:set {$machine} && heroku maintenance:on --app {$machine} && git remote add heroku git@heroku.{$machine}:{$machine}.git && git push heroku master && heroku maintenance:off --app {$machine}", $result);
    $log = ob_get_contents();
    ob_end_clean();
    //echo "result: {$result}\n";
    //echo "log   : {$log}\n";
    if ($result!=0){
        echo "[FAILED][deployHeroku] (code {$result})\n";
    } else {
        echo "[SUCCESS][deployHeroku] (code {$result})\n";
    }
    return $result;
}

function commitSha($projname, $env){
    //get commit information
    $currentbase=realpath(".");
    $basedir="/workspace/builds";
    $artifactdir="/workspace/artifacts";
    $logdir="/logs";

    $base="{$currentbase}{$basedir}";
    $projname="{$projname}-smoke";
    $sha=getCommitSha($projname);

    ob_start();
    passthru("cd {$base} && rm -Rf {$projname} && git clone git@github.com:cheungyang/{$projname}.git", $result);
    savefile("{$base}/{$projname}/commit_sha", $sha); 
    passthru("cd {$base}/{$projname} && git add commit_sha && git commit -m \"auto commit for sha {$sha}\" && git push origin", $result);
    $log = ob_get_contents();
    ob_end_clean();
    //echo "result: {$result}\n";
    //echo "log   : {$log}\n";
    if ($result!=0){
        echo "[FAILED][commitSha] (code {$result})\n";
    } else {
        echo "[SUCCESS][commitSha] (code {$result})\n";
    }
    return $result;
}

function getCommitSha($projname){
    $url="https://api.github.com/repos/cheungyang/{$projname}/commits";
    $str=get($url);
    $json=json_decode($str, true);
    
    //TODO: do not only get the first one; get the one related to current project
    $commit_info=$json[0];
    $sha=$commit_info["commit"]["tree"]["sha"];
    return $sha;
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
