
// Sauvegarder la fonction fetch originale
const originalFetch = window.fetch;
const blockedUrl="https://api.twitch.tv/kraken/chat/emoticon_images?emotesets=0,300374282"
window.fetch = async function(...args) {
    const url = args[0];  // URL de la requête
    
    console.log('Intercepted fetch request:', url);
    
    // Vérifier si l'URL correspond à une condition pour être annulée
    if (url==blockedUrl) {
        console.log('Blocking request to:', url);
        
        // Utiliser AbortController pour annuler la requête
        const controller = new AbortController();
        controller.abort();  // Annule la requête immédiatement
        
        // Retourner une promesse rejetée pour simuler une requête annulée
        return Promise.reject(new Error(`Fetch request to ${url} was canceled`));
    }

    // Si l'URL est acceptée, on exécute le fetch original
    try {
        const response = await originalFetch(...args);
        console.log('Fetch response:', response);
        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

class GameBot {
    constructor(username, channels, container, ignore = [], secret = 'je637klvvxqnfhjoomumuh6eygcr8c') {
        this.cmd = [];
        // Appel initial de la fonction 
        this.ignore = [];
        this.init = null;
        this.canVote=false;
        this.container = container;
        this.channel = channels[0];
        if (typeof tmi === 'object') {
            this.created = true;
            this.client = new tmi.Client({
                options: { debug: true },
                identity: {
                    username: username,
                    password: `oauth:${secret}`
                },
                channels: channels
            });
        }
        else
            console.error("No tmi library Found");
    }
    getCmd=function(){
        return this.cmd;
    }
    setInit(fnc) {
        this.init = fnc;
    }
    init = function () {
        this.init.call(this);
    }
    message(message,channel=undefined) 
    {
        let c=(channel!=undefined)?channel:this.channel;
        if (this.created)
            this.client.say(c, `${message}`);
        else
            console.error("GameBot can't post message : No instance of tmi client")

    }
    isIgnore(username) {
        return this.ignore.includes(username);
    }
    setIgnore(username) {
        this.ignore.push(username);
    }
    setCommand(cmd, callback) {
        
        if (typeof cmd == "string") {
            if (this.cmd[cmd.toLocaleLowerCase()] != undefined) {
                console.error(`${cmd} already exist in current commands`);
                return false;
            }
            this.cmd[cmd.toLocaleLowerCase()] = callback;
            console.info(`${cmd.toLocaleLowerCase()} a été incorporée.`)
            return;
        }
        cmd.forEach(element => {
            if (this.cmd[element] != undefined) {
                console.error(`${cmd.toLocaleLowerCase()} already exist in current commands`);
                return;
            }
            this.cmd[element.toLocaleLowerCase()] = callback;
        });
    }
    getBot = function () {
        return this.client;
    }
    readFile=async function(file){
        let data = {
            file: file
        }
        let response = await fetch('ajax.php?act=readFile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        });
        let result = await response.json();
        return (result);
    }
    writeFile = async function (file, msg) {
        let data = {
            file: file,
            message: msg
        }
        let response = await fetch('ajax.php?act=fileWrite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        });
        let result = await response.json();
        return (result.message);
    }
    openBot = function () {
        if (this.created) {
            this.client.connect();
            this.client.on('message', (channel, tags, message, self) => {

                if (self) return; // Ignore les messages du bot
                if (this.ignore.includes(tags.username)) {//Ignore les autres bots
                    return;
                }
                const args = message.split(' ');
                const command = args.shift().toLowerCase();
                
                    if (this.cmd.includes(command)) {//Ignore les commandes non prise en charge
                        return
                    }
            console.clear();//Raffraichi la console
            console.dir(this.cmd,command.toString());
            console.log(this.cmd.includes(command.toString()));
                    this.cmd[command].call(this, args, tags, channel);
                
            });
        } else {
            console.error("GameBot can't open, No instance of tmi client")
        }
    }

}