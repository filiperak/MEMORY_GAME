import {imgArrSrc} from './img.js'

const gameBord = document.querySelector('#game-bord');

const username = document.querySelector('#username');
const scoreBord = document.querySelector('.score-bord');
const timer = document.querySelector('#timer');
const errorMesage = document.querySelector('#inp-invalid');
const startGameBtn = document.querySelector('#start-game');
const gameWonMsg = document.querySelector('#game-won');
const newGameBtn = document.querySelector('#new-game-btn');
const seeResultBtn = document.querySelector('#see-result-btn');
const scoreTableDiv = document.querySelector('.score-table');

let inpBord = 0;
let cardMatched = 0;
let timerVal = 0;
let timeInterval = null;

let userScoreObj = { };
let userARRAY = JSON.parse(localStorage.getItem('USERDATA'));

if (!userARRAY) {
    userARRAY = [];
    localStorage.setItem('USERDATA', JSON.stringify(userARRAY));
}
console.log(userARRAY);


const doubleArr = (arr) => [...arr, ...arr];

const randomArr = (arr) => {
    for(let i = arr.length -1; i > 0; i--){
        let random = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[random]] = [arr[random], arr[i]];
    }
    return arr;
};


const timerFunc = () => {
    timerVal++;
    timer.innerHTML = timerVal;
}

const generateCards = (inpVal) => {
    let cardData = randomArr(doubleArr(randomArr(imgArrSrc).slice(0, (inpVal/2))));


    cardData.forEach((elem,ind) => {
        let card = document.createElement('div');
        let face = document.createElement('img');
        let back = document.createElement('div');
        card.classList.add('card');
        face.classList.add('face');
        back.classList.add('back');

        face.src = elem.src;
        card.setAttribute('name',elem.name);
        gameBord.classList.add(`inputValue${Number(inpVal)}`);

        card.appendChild(face);
        card.appendChild(back);
        gameBord.appendChild(card);

        card.addEventListener('click',(e) => {
            card.classList.toggle('flipCard');
            checkCard(e)
        })

    });
}

const checkCard = (e) => {
    let clicked = e.target;
    clicked.classList.add('flipCard2');
    let flippedCard = document.querySelectorAll('.flipCard2');
    
    if(flippedCard.length == 2){
        if(flippedCard[0].getAttribute('name') == flippedCard[1].getAttribute('name')){
            flippedCard.forEach(elem => {

                elem.classList.remove('flipCard2')
                elem.style.pointerEvents = 'none';
                cardMatched++;
            });
            
            if(cardMatched == inpBord){
                setTimeout(() => gameWonMsg.classList.toggle('hidden'),2000);
                clearInterval(timeInterval);
                timeInterval === null;
                userScoreObj.time = timerVal;
                userARRAY.push(userScoreObj);
                localStorage.setItem('USERDATA',JSON.stringify(userARRAY));
                console.log(userARRAY);
                createScoreTable(userARRAY,inpBord);

            }
        }else{
            flippedCard.forEach(elem => {
                elem.classList.remove('flipCard2');
                setTimeout(() => elem.classList.remove('flipCard'),1000)
            });
        }
    }
}

seeResultBtn.addEventListener('click',() => {
    gameWonMsg.classList.toggle('hidden');
});

newGameBtn.addEventListener('click', () => {
    gameWonMsg.classList.toggle('hidden');
    timerVal = 0;
    timer.innerHTML = 0;
    cardMatched = 0;
    gameBord.innerHTML = '';
    generateCards(inpBord);
    //checkCard();
    timeInterval = setInterval(timerFunc, 1000);
});

startGameBtn.addEventListener('click', () => {
    const userVal = username.value;
    gameBord.innerHTML = '';

    if (userVal.trim() !== "") {
        const bordSizeInput = document.querySelector('input[name="dificulty-level"]:checked');
        userScoreObj.username = userVal;

        console.log(userScoreObj);

        if (bordSizeInput) {
            let bordSizeVal = Number(bordSizeInput.value);
            inpBord = bordSizeVal;
            userScoreObj.dificulty = bordSizeVal;
            errorMesage.classList.add('hidden')

            //checkCards
            generateCards(bordSizeVal);
            if (timeInterval === null || timeInterval === undefined) {
                timeInterval = setInterval(timerFunc, 1000);
            }
            //timeInterval = setInterval(timerFunc, 1000);

            
        
        }else{
            errorMesage.innerHTML = 'please select dificulty level'
            errorMesage.classList.toggle('hidden');
        }
    } else {
        errorMesage.classList.toggle('hidden');
    }
});

const scoreBordBtn = document.querySelectorAll('.score-bord-btn')
scoreBordBtn.forEach(elem => {
    elem.addEventListener('click', (e) => {
        //scoreTableDiv.innerHTML = '';
        //let iterator = 1;
        //let selectedDificultyScores = [];
        console.log(e.target.id);
        
        let targetId = e.target.id;

        let data = JSON.parse(localStorage.getItem('USERDATA'));
        createScoreTable(data,targetId);
    });
    
});
const createScoreTable = (d,target) => {
    scoreTableDiv.innerHTML = '';
    let selectedDificultyScores = [];
    let iterator = 1;

    let scoreTable = document.createElement('table');
    let thInfo = document.createElement('tr');
    let tdMesto = document.createElement('td')
    tdMesto.innerText = `MESTO`;
    let tdkorisnickoIme = document.createElement('td')
    tdkorisnickoIme.innerText = `KORISNICKO IME`;
    let tdVreme = document.createElement('td')
    tdVreme.innerText = `VREME`;
    thInfo.append(tdMesto,tdkorisnickoIme,tdVreme)
    scoreTable.appendChild(thInfo);

    for(let i = 0; i < d.length; i++){
        if(d[i].dificulty == target){
            console.log(d[i]);
            selectedDificultyScores.push(d[i])
        }
    }
    let selectedDificultyScoresSorted = selectedDificultyScores.sort((a, b) => a.time - b.time).slice(0,5);
    selectedDificultyScoresSorted.forEach(elem => {
        let tabRow = document.createElement('tr');
        let tdIndex = document.createElement('td');
        tdIndex.innerText = `${iterator}.`;
        let tdUser = document.createElement('td');
        tdUser.innerText = elem.username;
        let tdTime = document.createElement('td');
        tdTime.innerText = elem.time;
        tabRow.append(tdIndex,tdUser,tdTime);
        scoreTable.appendChild(tabRow);
        iterator++
    });
    scoreTableDiv.appendChild(scoreTable)
}
createScoreTable(userARRAY,16);

let restartBtn = document.querySelector('#restart-btn');
restartBtn.addEventListener('click', () => {
    location.reload(true);
})