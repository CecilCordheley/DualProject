<?php
    function generateRoom($player1,$player2){
        $alpha="ABDCEFGHIJKLMNOPQRSTUVWXYZ012345689";
        $id="";
        for($i=0;$i<4;$i++){
            $id.=rand(0,strlen($alpha)-1);
        }
        if(file_exists("include/room.json")){
            $content=file_get_contents("include/room.json");
            $room=[
                "room"=>$id,
                "lib"=>[],
                "players"=>[$player1=>false,
                $player2=>false
                ],
               
            ];
            $a=json_decode($content,true);
            $a[]=$room;
            $content=json_encode($a);
            file_put_contents("include/room.json",$content);
            return $id;
        }
    }
    function setLibrary($id,$lib){
        if(file_exists("include/room.json")){
            $content=file_get_contents("include/room.json");
            $a=json_decode($content,true);
            array_walk($a,function(&$el) use($id,$lib){
                if($el["room"]==$id){
                    $el["lib"]=$lib;
                }
            });
            $content=json_encode($a);
            file_put_contents("include/room.json",$content);
        }
    }
    function connectRoom($id,$player){
        if(file_exists("include/room.json")){
            $content=file_get_contents("include/room.json");
            $a=json_decode($content,true);
            array_walk($a,function(&$el) use($id,$player){
                if($el["room"]==$id){
                    echo array_key_exists($player,$el["players"]);
                    if(array_key_exists($player,$el["players"])){
                        $el["players"][$player]=true;
                    }
                }
            });
            $content=json_encode($a);
            file_put_contents("include/room.json",$content);
        }
    }