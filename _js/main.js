window.addEventListener("load", function () {
    document.querySelectorAll("[g_area]").forEach(el => {
        el.style["grid-area"] = el.getAttribute("g_area");
        /*  var extractBtn=document.getElementById("ExecExtract");
          var ctrlExtact=document.getElementById("extractCtrl");
          extractBtn.style.display="none";
          ctrlExtact.style.display="none";*/
    });
});
/**
 * créer la structure initiale d'un module
 * @returns HTMLElement
 */
function createModule() {
    let d = document.createElement("div");
    d.classList.add("module");
    return d;
}
/**
 * Affiche un PopIn donnant accès aux nombres de votes 
 * @returns 
 */
function generateModule() {
    if (document.getElementById("modulePopIn") != undefined) {
        return false;
    }
    let modul = createModule();
    modul.setAttribute("id", "modulePopIn");
    modul.style.position = "absolute"; // Pour permettre le positionnement
    modul.style.top = "100px"; // Position initiale
    modul.style.left = "100px"; // Position initiale
    let h = document.createElement("div")
    h.classList.add("header");
    let title = document.createElement("h3");
    title.innerHTML = "SubControl";
    h.appendChild(title);
    //Close Button
    let close = document.createElement("button");
    close.innerHTML = "X";
    close.onclick = function () {
        modul.remove();
    }
    h.appendChild(close);
    modul.appendChild(h);
    //Contenu effectif du module
    let container = document.createElement("div");
    container.classList.add("container");
    container.innerHTML = "Votes pour " + game.player[0].name + "<br>";
    let P1 = game.player[0].getPercent();
    let alpha = "ABCD";
    for (i = 0; i < 4; i++) {
        k = Object.keys(P1[i]);
        container.innerHTML += k + "=>" + P1[i][k] + "<br>";
    }
    container.innerHTML += "Votes pour " + game.player[1].name + "<br>";
    let P2 = game.player[1].getPercent();
    for (i = 0; i < 4; i++) {
        k = Object.keys(P2[i]);
        container.innerHTML += k + "=>" + P2[i][k] + "<br>";
    }
    modul.appendChild(container);
    document.body.appendChild(modul);
    let isDragging = false;
    let offsetX, offsetY;
    h.addEventListener("mousedown", function (e) {
        isDragging = true;
        offsetX = e.clientX - modul.getBoundingClientRect().left;
        offsetY = e.clientY - modul.getBoundingClientRect().top;
    });

    document.addEventListener("mousemove", function (e) {
        if (isDragging) {
            modul.style.left = (e.clientX - offsetX) + "px";
            modul.style.top = (e.clientY - offsetY) + "px";
        }
    });

    document.addEventListener("mouseup", function () {
        isDragging = false;
    });
}
function _alert(msg, onclose, css) {
    var _overlay = document.createElement("div");
    _overlay.classList.add("overlay");
    var _m = document.createElement("div");
    if (css != undefined) {
        for (let _v in css) {
            _m.style[Object.keys(_v)] = _v;
        }
    }
    _m.innerHTML = msg;
    _overlay.appendChild(_m);
    _overlay.onclick = function () {
        this.remove();
        if (onclose != undefined)
            onclose();
    }
    document.body.prepend(_overlay);



}
class SubConsole {
    constructor() {
        this.module = createModule();
        this.module.style.position = "absolute"; // Pour permettre le positionnement
        this.module.style.top = "100px"; // Position initiale
        this.module.style.left = "100px"; // Position initiale
    }
    generate() {
        let h = document.createElement("div")
        h.classList.add("header");
        let title = document.createElement("h3");
        title.innerHTML = "Console";
        h.appendChild(title);
        let modul=this.module;
        //Close Button
        let close = document.createElement("button");
        close.innerHTML = "X";
        close.onclick = function () {
            modul.remove();
        }
        h.appendChild(close);
        this.module.appendChild(h);
        let container = document.createElement("div");
        container.classList.add("container");
        //Input de la console
        let input = document.createElement("input");
        input.type = "text";
        container.appendChild(input);
        //button trigger
        let trigger = document.createElement("button");
        trigger.innerHTML = "exec";
        trigger.style.width = "25%";
        trigger.onclick = function () {
            let r = "";
            if (input.value != undefined)
                r = eval(input.value);
            result.innerHTML = r || "";
        }
        container.appendChild(trigger);
        //Result
        let result = document.createElement("div");
        container.appendChild(result);
        this.module.appendChild(container);
        document.body.appendChild(this.module);
        let isDragging = false;
        let offsetX, offsetY;
        
        h.addEventListener("mousedown", function (e) {
            isDragging = true;
            offsetX = e.clientX - modul.getBoundingClientRect().left;
            offsetY = e.clientY - modul.getBoundingClientRect().top;
        });
       
        document.addEventListener("mousemove", function (e) {
            if (isDragging) {
                modul.style.left = (e.clientX - offsetX) + "px";
                modul.style.top = (e.clientY - offsetY) + "px";
            }
        });

        document.addEventListener("mouseup", function () {
            isDragging = false;
        });
    }

}
class Chat {
    constructor(container) {
        this.container = container;
    }
    addMessage = function (msg) {
        let span = document.createElement("span");
        span.innerHTML = msg;
        this.container.appendChild(span);
    }
    clear(){
        this.container.innerHTML="";
    }
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
async function setLib(idTheme) {
    fetch("async.php?act=setLib&theme=" + idTheme);
}
async function isConnected(player, fnc) {
    fetch("async.php?act=isConnected&player=" + player)
        .then((response) => response.text())
        .then((result) => {
            let r = JSON.parse(result);
            fnc.call(this, r);
        });
}
function getLink() {
    let alpha = "ABDCEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let r = "";
    for (i = 0; i < 8; i++) {
        r += alpha[getRandomInt(alpha.length - 1)];
    }
    return r;
}