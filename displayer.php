<?php
//Ici je récupère la config du jeu
$config=json_decode(file_get_contents("include/config.json"),true);
//Vérifier si il y a la chaine en paramètre
if(!isset($_GET["channel"])){
    echo "<pre>Pas de chaine passé en paramètre</pre>";
    exit();
}
//Vérifier si la chaine est une de celle autorisée
if(!in_array($_GET["channel"],$config["allowedChannel"])){
    echo "<pre>Ce n'est pas une chaîne autorisée</pre>";
    exit();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dsiplayer Dual</title>
    <script src="_js/main.js"></script>
    <script src="_js/game.js"></script>
    <script src="_js/tmi.min.js"></script>
    <script src="_js/ChatBot.js"></script>
    <script src="_js/twitch.js"></script>
    <style>
        @keyframes marquee {
    0% {
        transform: translateX(0%);
    }

    100% {
        transform: translateX(-100%);
    }
}
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Calibri;
        }
        body{
            background: linear-gradient(#AA6, #336, #AA6);

            height: 100vh;
        }
        .container{
            width: 975px;
            aspect-ratio: 16/9;
            margin: 0 auto;
            border: 1px solid #000;
            padding: 5px;
            display: grid;
            grid-template-areas: 'header question'
                 'scrolling scrolling';
        }
        #question ol li.selected{
            background: #AA6;
        }

        .container header{
            height: 100%;
        }
        .container header img{
            width: 250px;
            height: 250px;
            clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 65% 74%, 25% 100%, 25% 49%);
        }
       
        .container #question {
            width: 100%;
            
            font-size: 2em;
        }
        #question p{
            background:#336;
            color: #FFF;
        }
        #question ol{
            list-style: upper-alpha;
            display: flex;
            flex-wrap: wrap;
        }
        #question ol li{
            width: 45%;
            background: #7f34ff;
            list-style-position: inside;
            margin: 3px;
            color: #FFF;
            font-size: .9em;
        }
        #question ol li.good{
            background:#55F
        }
        #question ol li span{
            float: right;
        }
        .scrolling {
    width: 100%;
    height: 25px;
    background: #3338;
    position: relative;
    overflow: hidden;
}
        .scrolling span{
            font-size: 1rem;
            display: inline-block;
    width: 150%;
    padding-left: 100%;
            animation: marquee 60s linear infinite;
        }
    </style>
</head>
<body>
<div class="container">
    <header g_area="header"></header>
    <div id="question" g_area="question">
        <p>Le duel commence bientôt</p>
        <ol></ol>
    </div>
    <div class="scrolling" g_area="scrolling">
        <span>les votes sont mise à jour toute les 7 secondes</span>
    </div>    
</div>
<script>
    let question = null;
    let rep={A:0,B:0,C:0,D:0};
    let user=[];
    getLiveInformation("<?php echo $_GET["channel"]; ?>").then((data) => {
                let img = document.createElement("img");
                img.src = (data.channel.profile_image_url);
                document.querySelector(".container header").appendChild(img);
    });
    function setPercent(){
        let sum=Object.entries(rep).reduce((car,el)=>{
            car+=el;
        },0);
        console.log(sum);
    }
    async function getVote(){
        const url = "ajax.php?act=getVote&channel=<?php echo $_GET["channel"]; ?>";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erreur réseau : ${response.status}`);
            }
            const reponse = await response.json();
            if (reponse.result === "OK") {
                displayVote(JSON.parse(reponse.data));
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            // Afficher un message utilisateur ou prendre une autre action
        }
    }
    function displayVote(vote){
        console.log(JSON.stringify(vote));
        let votes=Object.entries(vote);
        console.dir(votes);
        let sum=Object.entries(vote).reduce((acc, [key, users])=>{
            acc+=users.length;
            return acc;
        },0);
        
        let ref=["A","B","C","D"];
        let i=0;
        for(i=0;i<4;i++){
           
            if(votes[i][1].length>0){
                console.log(votes[i][1]);
                let span=document.querySelector("li[NameRep="+ref[i]+"] span");
                let prc=(votes[i][1].length/sum)*100;
                span.innerHTML=prc+" %";
            }else{
                document.querySelector("li[NameRep="+ref[i]+"] span").innerHTML="0%"
            }
        }
        getReponse(vote)
        
       
    }
    async function getData() {
        const url = "ajax.php?act=getCurrentQuestion";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erreur réseau : ${response.status}`);
            }
            const reponse = await response.json();
            if (reponse.result === "ok")
            if(question==null || reponse.data.question !== question.question) {
                question = reponse.data;
                displayQuestion(question);
            }
            if(reponse.data.displayRep){
                document.querySelectorAll("#question ol li")[question.reponse].classList.add("good");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            // Afficher un message utilisateur ou prendre une autre action
        }
    }
    /** 
     * Determine la réponse sélectionnée par les votes
     * @param {Object} vote 
     * @return {int}/{bool}
     * */
    function getReponse(vote) {
    // Transforme l'objet votes en tableau de paires [clé, tableau d'utilisateurs]
    let votes = Object.entries(vote);
    let sum=Object.entries(vote).reduce((acc, [key, users])=>{
            acc+=users.length;
            return acc;
        },0);
    console.log("sum :",sum);
    if(sum===0)
        return false;
    // Calcule le nombre de votes par clé
    let votesBy = votes.reduce((acc, [key, users]) => {
        acc[key] = users.length;
        return acc;
    }, {});
    
    // Transforme l'objet en tableau de paires [clé, nombre de votes]
    let sortedVotes = Object.entries(votesBy).sort((a, b) => b[1] - a[1]);

   
    document.querySelector("#question ol li[NameRep="+sortedVotes[0][0]+"]").classList.add("selected");
      // Renvoie la clé avec le plus grand nombre de votes
      return sortedVotes[0][0];
}
    function displayReponse(timeOut, rep) {
        let i = 0;
        let displayRep = setInterval(function () {
            if (i < 4) {
                rep[i].style.opacity = 1;
                i++
            } else {
                clearInterval(displayRep);
                clearTimeout(timeOut);
            }
        }, 1000)
    }
    function displayQuestion(question) {
        const q = document.querySelector("#question p");
        const o = document.querySelector("#question ol");

        // Effacer le contenu précédent
        q.innerHTML = question.question;
        o.innerHTML = ""; // Réinitialiser la liste des choix
        let rep=["A","B","C","D"];
        // Ajouter les nouveaux choix
        question.choix.forEach((el,index) => {
            const li = document.createElement("li");
            li.setAttribute("NameRep",rep[index]);
            const span = document.createElement("span");
            span.textContent = "0 %";
            li.textContent = el;
            li.appendChild(span);
            o.appendChild(li);
        });
        let repSelector=document.querySelectorAll("#question ol li");
      /*  repSelector.forEach(el => {
                el.style.opacity = 0;
            })
            var timeOutQuestion = setTimeout(() => {
                displayReponse(timeOutQuestion, repSelector);
            }, 2000);*/
    }

    // Appel initial
    getData();

    // Mise à jour périodique
    setInterval(getData,5000);
    setInterval(getVote,7000);
</script>

</body>
</html>