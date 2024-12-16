<?php

ini_set('display_errors', 1);
function checkFile($filename){
    if(!file_exists($filename)){
        echo json_encode(["error"=>0,"messsage"=>"$filename doesn't exist"]);
        return false;
    }else{
        return true;
    }
}
    if(isset($_GET["act"])){
        switch ($_GET["act"]){

            case "getVote":{
                if(!file_exists("include/vote.json")){
                    echo json_encode(["error"=>0,"messsage"=>`include/vote.json doesn't exist`]);
                    return;
                }
                if(!isset($_GET["channel"])){
                    echo json_encode(["error"=>1,"messsage"=>`channel parameters missing`]);
                    return;
                }
                $vote=json_decode(file_get_contents("include/vote.json"),true);
                echo json_encode(value: ["result"=>"OK","data"=>json_encode($vote[$_GET["channel"]])]);
                break;
            }
            case "updateVote":{
                $json_data = json_decode(file_get_contents('php://input'), true);
                if(!file_exists("include/vote.json")){
                    echo json_encode(["error"=>0,"messsage"=>`include/vote.json doesn't exist`]);
                    return;
                }
                $config=json_encode($json_data);
                $data=[];
                $data[$json_data["player1"]["name"]]=$json_data["player1"]["votes"];
                $data[$json_data["player2"]["name"]]=$json_data["player2"]["votes"];
                $config=json_encode($data);
                if(file_put_contents("include/vote.json",$config)){
                    echo json_encode(["result"=>"OK"]);
                }else{
                    echo json_encode(["error"=>1,"message"=>"vote.json cannot be updated !"]);
                }
                break;
            }
            case "getCurrentQuestion":{
                if(!file_exists("include/config.json")){
                    echo json_encode(["error"=>0,"messsage"=>`include/config.json doesn't exist`]);
                    return;
                }
                $config=json_decode(file_get_contents("include/config.json"),true);
                if(!file_exists("include/library.json")){
                    echo json_encode(["error"=>0,"messsage"=>`include/library.json doesn't exist`]);
                    return;
                }
              
               if($config["deathMatch"]){
                $lib=json_decode(file_get_contents("include/deathMatch.json"),true);
                $data= $lib[$config["indexQuestion"]];
               }else{
                $lib=json_decode(file_get_contents("include/library.json"),true);
                $data= $lib["manche{$config["indexManche"]}"][$config["indexQuestion"]];
               }
               $data["displayRep"]=$config["hasRep"];
                echo json_encode(["result"=>"ok","data"=>$data]);
                break;
            }
            case "update":{
                /*Variable POST */
                $json_data = json_decode(file_get_contents('php://input'), true);
                if(!file_exists("include/config.json")){
                    echo json_encode(["error"=>0,"messsage"=>`include/config.json doesn't exist`]);
                    return;
                }
                $data=json_decode(file_get_contents("include/config.json"),true);
                $data["indexManche"]=$json_data["indexManche"];
                $data["indexQuestion"]=$json_data["indexQuestion"];
                $data["deathMatch"]=$json_data["deathMatch"];
                $data["hasRep"]=$json_data["rep"];
                if(file_put_contents("include/config.json",json_encode($data))){
                    echo json_encode(["result"=>"OK"]);
                }else{
                    echo json_encode(["error"=>1,"message"=>`error while writting in config file`]);
                }
                break;
            }
            case "fileWrite":{
                $json_data = json_decode(file_get_contents('php://input'), true);
                if(!file_exists($json_data["file"])){
                    echo json_encode(["error"=>0,`{$json_data["file"]} doesn't exist`]);
                    return;
                }
                $file=file_get_contents($json_data["file"]);
                $file=$json_data["message"];
                $return = file_put_contents($json_data["file"],$file);
                if($return)
                    echo json_encode(["result"=>"OK"]);
                else
                    echo json_encode(["error"=>1,`cannot write in the file`]);
                break;
            }
            case "readFile":{
                $json_data = json_decode(file_get_contents('php://input'), true);
                if(!file_exists($json_data["file"])){
                    echo json_encode(["error"=>0,`{$json_data["file"]} doesn't exist`]);
                    return;
                }
                $file=file_get_contents($json_data["file"]);
                echo json_encode(["result"=>"OK","data"=>$file]);
                break;
            }
        }
    }else{
        echo "No act parameters";
    }