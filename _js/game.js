class Player {
    constructor(name, container) {
        this.name = name;
        this.container = container;
        this.score = 0;
        this.vote = {
            "A": [],
            "B": [],
            "C": [],
            "D": []
        },
            this.rep = []
    }
    reset() {
        this.vote = {
            "A": [],
            "B": [],
            "C": [],
            "D": []
        },
            this.rep = [];
        document.querySelectorAll(".prct").forEach(el => {
            el.innerHTML = "";
        })
    }
    getPercent() {
        const v = this.vote;
        let k = "ABCD";
        let prct = [{ "A": 0 }, { "B": 0 }, { "C": 0 }, { "D": 0 }]
        let tot = Object.keys(v).reduce(function (carry, el) {
            //console.dir(v);
            carry += v[el].length;
            return carry;
        }, 0);
        prct.forEach((el, i) => {
            let key = k[i];  // Lettre correspondante à la réponse
            el[key] = Math.round((v[key].length / tot) * 100);
        });
        prct.sort(function (a, b) {
            if (Object.values(a) > Object.values(b))
                return -1;
            if (Object.values(b) > Object.values(a))
                return 1;
            return 0;
        })
        return prct;
    }
    getReponse() {
        return this.getPercent()[0]
    }
}
class Game {
    constructor(name, container, player1, player2) {
        this.console = document.getElementById("console");
        this.container = container;
        this.lib = [];
        this.currentQuery = [],
        this.deathMatch=[],
        this.index = 0;
        this.manche = 0;
        this.canVote = false;
        this.player = [
            new Player(player1, "Plyr1"),
            new Player(player2, "Plyr2")
        ]
        this.bot = new GameBot("GAMEBOT", [player1, player2]);
        this.name = name
    }
    /*
    checkReponse() {
       

        setTimeout(() => {
            let alpha = "ABCD";
            this.console.innerHTML=this.player[0].rep.length;
            if (this.player[0].rep.length==0 && alpha.indexOf(Object.keys(this.player[0].getReponse())) == this.currentQuery[this.index].reponse) {
                this.player[0].score++;
                document.querySelectorAll("#gain_" + this.player[0].name + " ul li:not([class])")[0].classList.add("good")
            } else {
                document.querySelectorAll("#gain_" + this.player[0].name + " ul li:not([class])")[0].classList.add("bad")
            }
            if (this.player[1].rep.length==0 != false && alpha.indexOf(Object.keys(this.player[1].getReponse())) == this.currentQuery[this.index].reponse) {
                this.player[1].score++;
                document.querySelectorAll("#gain_" + this.player[1].name + " ul li:not([class])")[0].classList.add("good")
            } else {
                document.querySelectorAll("#gain_" + this.player[1].name + " ul li:not([class])")[0].classList.add("bad")
            }
        }, 2000)
    }*/
    checkReponse() {
        document.querySelectorAll(".current ol li")[this.currentQuery[this.index].reponse].classList.add("answer");
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        delay(2000).then(() => {
            let alpha = "ABCD";
         //   this.console.innerHTML = this.player[0].rep.length;

            // Joueur 1
            if (this.player[0].rep.length > 0 && alpha.indexOf(Object.keys(this.player[0].getReponse())) == this.currentQuery[this.index].reponse) {
                this.player[0].score++;
                document.querySelectorAll("#gain_" + this.player[0].name + " ul li:not([class])")[0].classList.add("good");
            } else {
                document.querySelectorAll("#gain_" + this.player[0].name + " ul li:not([class])")[0].classList.add("bad");
            }

            // Joueur 2
            if (this.player[1].rep.length > 0 && alpha.indexOf(Object.keys(this.player[1].getReponse())) == this.currentQuery[this.index].reponse) {
                this.player[1].score++;
                document.querySelectorAll("#gain_" + this.player[1].name + " ul li:not([class])")[0].classList.add("good");
            } else {
                document.querySelectorAll("#gain_" + this.player[1].name + " ul li:not([class])")[0].classList.add("bad");
            }
        });

    }
    setDeathMatch(){
        document.querySelector(".deathMatch").style.display="flex";
        console.dir(this.deathMatch);
    }
    getDeathMatch=async function(){
        const url = ("include/deathMatch.json")
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        this.deathMatch = await response.json();
    }
    getWinner() {
        if (this.player[0].score > this.player[1].score) {
            return { "winner": this.player[0] }
        }
        if (this.player[0].score < this.player[1].score) {
            return { "winner": this.player[1] }
        }
        return false;
    }
    getQuizz = async function () {
        const url = ("include/library.json")
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        this.lib = await response.json();
    }
    getPlayer = function (channel) {
        return this.player.filter(el => {
            return el.name == channel;
        })[0];
    }
    getBot = function () { return this.bot; }
    initialize = function () {
        this.getQuizz();
        this.getDeathMatch();
        this.player.forEach((el, index) => {
            document.querySelectorAll('#manche>div section')[index].setAttribute("player", el.name)
            document.querySelectorAll('#manche>div section')[index].children[0].innerText = el.name;
            document.querySelectorAll('.deathMatch>section')[index].setAttribute("player", el.name)
            document.querySelectorAll('.deathMatch>section')[index].children[0].innerText = el.name;
            getLiveInformation(el.name).then((data) => {
                let img = document.createElement("img");
                img.src = (data.channel.profile_image_url);
                document.getElementById(el.container).appendChild(img);
            });
        })
        this.bot.openBot();
    }
    generateGain() {
        let c = document.getElementById("gain");
        c.innerHTML = "";
        this.player.forEach((p, i) => {
            let div = document.createElement("div");
            div.setAttribute("id", "gain_" + p.name);
            let name = document.createElement("span");
            name.innerHTML = p.name;
            div.appendChild(name);
            //créer la liste des gains
            let ul = document.createElement("ul");
            for (let i = 0; i < 5; i++) {
                ul.innerHTML += "<li></li>";
            }
            div.appendChild(ul)
            let prct = document.createElement("span");
            prct.classList.add("prct");
            div.appendChild(prct);
            c.appendChild(div);
        });
    }
    emulateReponse(channel, user, vote) {
        let p = this.getPlayer(channel);
        p.vote[vote].push(user);
    }
    nextManche() {

        if (this.nextManche + 1 > 3) {
            return false;
        }
        this.generateGain();
        this.manche++;
        document.querySelector('#manche>h3').innerText = `Manche ${this.manche}`
        this.index = -1;
        this.currentQuery = this.getQuestions();
        if (this.currentQuery == undefined) {
            return false;
        }
        this.player[0].score = 0;
        this.player[1].score = 0;
        this.player.forEach(p => {
            this.bot.message("/me vous allez pouvoir répondre à l'aide des commande !vote ou !rep suivi de la réponse A,B,C ou D", p.name)
        })
        this.container.innerHTML = "";
        this.currentQuery.forEach(el => {
            let divQuestion = document.createElement("div"); //container de la question
            divQuestion.classList.add("questionElement");
            let contentQuestion = document.createElement("p"); //Contenu de la question elle même
            contentQuestion.innerHTML = el.question;
            divQuestion.appendChild(contentQuestion);
            let listReponse = document.createElement("ol");
            el.choix.forEach(r => {
                let li = document.createElement("li");
                li.innerHTML = r
                listReponse.appendChild(li);
            });
            divQuestion.appendChild(listReponse);
            this.container.appendChild(divQuestion);
        });
        this.questionContainer = document.querySelectorAll(".questionElement");
        this.console.innerHTML="Theme de la question "+this.currentQuery[this.index+1].theme;
        this.nextQuestion();
    }
    getQuestions() {
        return this.lib[`manche${this.manche}`];
    }
    nextQuestion() {

        if (this.index + 1 == 5) {
            return false;
        }

        this.questionContainer.forEach(el => {

            el.classList.remove("current");
        });
        this.player.forEach(p => {
            p.reset();
        })
        this.canVote = false;
        this.index++;
        this.questionContainer[this.index].classList.add("current");
        let rep = document.querySelectorAll(".questionElement.current ol li");
        rep.forEach(el => {
            el.style.opacity = 0;
        })
        var timeOutQuestion = setTimeout(() => {
            this.displayReponse(timeOutQuestion, rep);
        }, 2000);
        return true;
    }
    displayReponse(timeOut, rep) {
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
}