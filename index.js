var userState = {
    score: 0,
    posicion: 0,
    quitzUsed: []
}
const states = [
    { code: 0, description: "sin Iniciar" },
    { code: 1, description: "welcome" },
    { code: 2, description: "Inicio" },
    { code: 3, description: "lanzando dados" },
    { code: 4, description: "selecionado actividad" },
    { code: 5, description: "selecionado respuesta" },

]
var stateNowGAME = {
    code: 0,
    description: ""
}
var msgD = document.getElementById("msg");
var dadoD = document.getElementById("dado");
var infoUser = document.getElementById("info_User");

const quitzs = [
    { quest: "Cuanto es 10 + 10", resp: ["1", "20", "10"], answer: 2 },
    { quest: "Cuanto es 20 + 10", resp: ["1", "30", "10"], answer: 2 },
    { quest: "Cuanto es 30 + 10", resp: ["1", "40", "10"], answer: 2 },
    { quest: "Cuanto es 40 + 10", resp: ["1", "50", "10"], answer: 2 },
    { quest: "Cuanto es 50 + 10", resp: ["1", "60", "10"], answer: 2 },
    { quest: "Cuanto es 60 + 10", resp: ["1", "70", "10"], answer: 2 },
    { quest: "Cuanto es 70 + 10", resp: ["1", "80", "10"], answer: 2 },
    { quest: "Cuanto es 80 + 10", resp: ["1", "90", "10"], answer: 2 },
    { quest: "Cuanto es 90 + 10", resp: ["1", "100", "10"], answer: 2 },
    { quest: "Cuanto es 110 + 10", resp: ["1", "120", "10"], answer: 2 },
]


// helper
function getRandomNumber(max, min) {
    return Math.floor(Math.random() * (max - 1 - min)) + min;
}

function nextState() {
    if (stateNowGAME == states[states.length - 1]) {
        stateNowGAME = states[2];
    } else {
        stateNowGAME = states[stateNowGAME.code + 1]
    }
    console.log(stateNowGAME, states)
}


function msg(arrayMessage = [], tiempo, content = msgD, lastMsg = false) {
    return new Promise(
        (res) => {
            let n = 0;
            let _i = setInterval(() => {
                if (n > arrayMessage.length - 1) {
                    clearInterval(_i)
                    if (!lastMsg) {
                        content.innerHTML = ""
                    };
                    res(true)
                    return;
                }
                content.innerHTML = arrayMessage[n]
                n++;
            }, tiempo)
        }
    )
}

function validateQuitzRepiter() {
    let quitzRepited = true;
    let randon
    while (quitzRepited) {
        randon = getRandomNumber(quitzs.length, 0)
        quitzRepited = userState.quitzUsed.includes(randon)
    }
    return randon
}

function validateAnswerQuizt(resp) {
    let lastQuitz = userState.quitzUsed[userState.quitzUsed.length - 1]
    if (resp == quitzs[lastQuitz].answer) {
        msgD.innerHTML = "<p>respuesta correcta</p>"
        userState.score += 100;
        updateUser();
    } else {
        msgD.innerHTML = "<p>respuesta incorrecta</p>"
    }
    nextState();
    startGame()
}

function selectPlayer() {
    return msg(["Selecione un jugador"], 3000);
}

function welcome() {
    return msg([
        "Hola esto es un juego de escalera",
        "consite en que tires un dado ",
        "solo preciona tirar dado y iniciara el juego",
        "listo o no comensaremos en ...."
    ]
        , 3000);

}

function selecionarActividad() {
    // generar actividad,
    msgD.innerHTML = ` 
        <h3>seleciona actividad</h3>
        <p>ejercio</p>
        <p>tomar quist</p>
    `
}

function updateUser() {
    infoUser.innerHTML = `
    <p>Posicion  ${userState.posicion}</p>
    <p>puntaje ${userState.score}</p>
    `
}

function loadTime() {
    return msg([5, 4, 3, 2, 1, 'start'], 1000);
}



function getQuitz() {
    let quitz = validateQuitzRepiter()
    userState.quitzUsed.push(quitz)
    console.log(quitz)
    let resp = ""
    for (let x = 0; x <= quitzs[quitz].resp.length - 1; x++) {
        resp += `<p> ${x + 1}) ${quitzs[quitz].resp[x]}</p> </br>`
    }
    msgD.innerHTML = ` 
        <h3>seleciona la repuesta correcta</h3>
        <h3>${quitzs[quitz].quest}</h3>
        <div style="border:2px solid red">
            ${resp}
        </div>
    `
}

function getEjercicio() { }


//lazar dados
async function lanzarDado() {
    let _arr = []
    for (_x = 1; _x <= 6; _x++) {
        _arr.push(getRandomNumber(6, 1))
    }
    await msg(_arr, 500, dadoD)
    // cargar posicion
    userState.posicion = +_arr[_arr.length - 1]
    updateUser()
    nextState();
    selecionarActividad()
}

// eventos

function eventoLanzarDado() {
    if (stateNowGAME.code == 3) {
        lanzarDado()
    }
}

function eventoBrazoDerecho() {
    if (stateNowGAME.code == 4) {
        getEjercicio()
        nextState()
    } else if (stateNowGAME.code == 5) {
        validateAnswerQuizt(1)
    }
}

function eventoBrazoIzquierdo() {
    if (stateNowGAME.code == 4) {
        getQuitz()
        nextState()
    } else if (stateNowGAME.code == 5) {
        validateAnswerQuizt(2)
    }
}
// load game
function startGame() {
    if (stateNowGAME.code == 2) {
        return msg(["lanza los dados"], 3000)
    }
}

async function loadGame() {

    //selecionar jugador
    await selectPlayer()
    nextState()
    //bienbenida
    await welcome()
    //tiempo de inicio
    await loadTime()
    nextState()
    // start game
    await startGame()
    nextState()
}


//iniciar juego

loadGame()