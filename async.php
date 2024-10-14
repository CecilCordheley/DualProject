<?php
    session_start();
    require_once "core.php";
    $library = [
        [
            "question.json", "question2.json", "question3.json", "question4.json"
        ],
        ["HarryPotter1.json", "harrypotter2.json"],
        ["serie.json"],
        ["test.json"],
        ["cinema.json", "cinema2.json"],
        ["musique.json"],
        ["buffy.json"]
    ];
    if(isset($_GET["act"])){
        switch($_GET['act']){
            case "isConnected":{
                if(file_exists("include/room.json")){
                    $content=file_get_contents("include/room.json");
                    $a=json_decode($content,true);
                    $player=$_GET["player"];
                    $connected=array_filter($a,function($el) use($player){
                        if($el["room"]==$_SESSION["room"]){
                            if(array_key_exists($player,$el["players"])){
                               return $el["players"][$player]==true;
                            }
                        }
                    });
                    if(count($connected)){
                        echo json_encode([
                            "connected"=>true
                        ]);
                    }else{
                        echo json_encode([
                            "connected"=>false
                        ]);
                    }
                }else{
                    echo json_encode([
                        "error"=>"file doesn't exist"
                    ]);
                }
                break;
            }
            case "setLib":{
                $index=rand(0,count($library[$_GET["theme"]])-1);
                $file=file_get_contents("../Library/".$library[$_GET["theme"]][$index]);
                $lib=json_decode($file,true);
                shuffle($lib);
                $_l=array_slice($lib,0,10);
                setLibrary($_SESSION["room"],$_l);
                break;
            }
        }
    }