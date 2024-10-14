<?php
session_start();
$p1 = "p0p0bot";
$p2 = "5ch00lw3b";
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Le Duel</title>
    <link rel="stylesheet" href="_css/main.css">
    <link rel="stylesheet" href="_css/compoment.css">
    <script src="_js/main.js"></script>
    <script src="_js/twitch.js"></script>
    <script src="_js/game.js"></script>
    <script src="_js/tmi.min.js"></script>
    <script src="_js/ChatBot.js"></script>
</head>

<body>
    <div class="deathMatch">
        <h3>Death Match</h3>
        <section player="">
            <span>P1</span>
            <ul></ul>
        </section>
        <section player="">
            <span>P2</span>
            <ul></ul>
        </section>
    </div>
    <div class="container">
        <header g_area="header">
            <div class="player" id="Plyr1">
                <span>
                    <?php echo $p1; ?>
                </span>
            </div>
            <h1>Le Duel des chats</h1>
            <div class="player" id="Plyr2">
                <span>
                    <?php echo $p2; ?>
                </span>
            </div>
        </header>
        <div id="manche" g_area="manche">
            <h3>index Manche</h3>
            <div>
                <section player="">
                    <span>P1</span>
                    <ul>
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                    </ul>
                </section>
                <section player="">
                    <span>P2</span>
                    <ul>
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                    </ul>
                </section>
            </div>
        </div>
        <main g_area="main">
            <div id="gain"></div>
            <div id="question"></div>
        </main>
        <div id="chat" g_area="chat">
            <h3>Chat</h3>
            <section></section>
        </div>
        <footer g_area="footer">
            Copyright &copy; Cecil Cordheley
            <?php echo date("Y"); ?>
        </footer>
        <aside g_area="console">
            <span id="console"></span>
            <div id="ctrl">
                <button id="start">Commencer</button>
                <button id="check">Vérifier</button>
                <button id="next">Question Suivante</button>
                <button id="startVote">Commencer les votes</button>
            </div>
        </aside>
    </div>
    <script>
        document.body.addEventListener("keyup", function (e) {
            if (e.keyCode == 27) {
                generateModule();
            }
        })
        document.querySelector(".deathMatch").style.display="none";
        var ctrl = {
            start: document.getElementById("start"),
            check: document.getElementById("check"),
            next: document.getElementById("next"),
            startVote: document.getElementById("startVote")
        }
        var chat = new Chat(document.querySelector("#chat section"));
        Object.keys(ctrl).forEach(function (key) {
            var element = ctrl[key];
            // Ici, tu peux appliquer ta fonction à chaque élément
            element.style.display = "none";
        });
        ctrl.startVote.onclick = function () {
            game.canVote = true;
            this.style.display = "none";
            ctrl.check.style.display = "block";
        }
        ctrl.start.style.display = "block";
        var game = new Game("Duel", document.getElementById("question"), "<?php echo $p1; ?>", "<?php echo $p2; ?>");
        var bot = game.getBot();
       
        bot.setCommand("!vote", function (arg, tags, channel) {
            if (game.canVote == false) {
                bot.message(`/me ${tags.username} Vous ne pouvez pas encore voter`, channel);
                return;
            }
            const vote = arg[0].toUpperCase();
            if (['A', 'B', 'C', 'D'].includes(vote)) {
                let p = game.getPlayer(channel.slice(1));
                if (!p.rep.includes(tags.username)) {
                    p.vote[vote].push(tags.username);
                    p.rep.push(tags.username);
                    chat.addMessage(`${tags.username} pour ${channel}`);
                    let prc = p.getPercent();
                    let msg = "";
                    for (i = 0; i < 4; i++) {
                        k = Object.keys(prc[i]);
                       msg += k + "=>" + prc[i][k] + "<br>";
                    }
                    bot.message(`/me ${msg}`, channel);
                } else {
                    bot.message(`/me ${tags.username} tu a déjà voté`, channel);
                }
            }
        });
        ctrl.check.style.display = "none";
        game.initialize();
        ctrl.start.onclick = function () {
            this.style.display = "none";
            game.nextManche();
            ctrl.startVote.style.display = "block";
        }
        ctrl.next.onclick = function () {
            this.style.display = "none";
            ctrl.check.style.display = "none";
            ctrl.startVote.style.display = "block";
            if (!game.nextQuestion()) {
                if (game.getWinner() != false) {
                    console.dir(game.getWinner().winner);
                    _alert(game.getWinner().winner.name + " a gagné la manche " + game.manche);
                    document.querySelectorAll("#manche>div section[player=\"" + game.getWinner().winner.name + "\"] ul li")[game.manche - 1].classList.add("win")
                } else {
                    _alert("Egalité",function(){
                        game.setDeathMatch();
                    });
                    return;
                    
                }
                if (game.nextManche() == false) {

                }

            }
        }
        ctrl.check.onclick = function () {
            this.style.display="none";
            if(game.index+1<5)
                game.console.innerHTML="Theme de la question "+game.currentQuery[game.index+1].theme;
         //   game.console.innerHTML += game.player[0].rep.length;
            let rep1 = (game.player[0].rep.length > 0) ? Object.keys(game.player[0].getReponse()) : "-";
            let rep2 = (game.player[1].rep.length > 0) ? Object.keys(game.player[1].getReponse()) : "-"
            document.querySelector("#gain_" + game.player[0].name + " .prct").innerHTML = rep1;
            document.querySelector("#gain_" + game.player[1].name + " .prct").innerHTML = rep2;
            setTimeout(function () {
                game.checkReponse();
                ctrl.next.style.display = "block";
            }, 3000);
        }
        test = function () {
            let _u = ["user1", "user2", "user3", "user4", "test1", "test2", "test4", "_player3"]
            for (i = 0; i < _u.length; i++) {
                let alpha = "ABCD";
                game.emulateReponse("<?php echo $p1; ?>", _u[i], alpha[getRandomInt(4)]);
            }
            for (i = 0; i < _u.length; i++) {
                let alpha = "ABCD";
                game.emulateReponse("<?php echo $p2; ?>", _u[i], alpha[getRandomInt(4)]);
            }
        }
    </script>
</body>

</html>