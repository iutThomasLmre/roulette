const CANCEL = document.getElementById("cancel");
const PLAY = document.getElementById("play");
const NEW_GAME = document.getElementById("new-game");

let elements = document.querySelectorAll(".item-bet-number, .item-bet-color");
let bets = [];
let balance = 100;
let history = [];

const MAP_WHEEL = [
    { number: 0, deg: 0 },
    { number: 32, deg: 9.7297297297 },
    { number: 15, deg: 19.4594594595 },
    { number: 19, deg: 29.1891891892 },
    { number: 4, deg: 38.9189189189 },
    { number: 21, deg: 48.6486486486 },
    { number: 2, deg: 58.3783783784 },
    { number: 25, deg: 68.1081081081 },
    { number: 17, deg: 77.8378378378 },
    { number: 34, deg: 87.5675675676 },
    { number: 6, deg: 97.2972972973 },
    { number: 27, deg: 107.027027027 },
    { number: 13, deg: 116.756756757 },
    { number: 36, deg: 126.486486486 },
    { number: 11, deg: 136.216216216 },
    { number: 30, deg: 145.945945946 },
    { number: 8, deg: 155.675675676 },
    { number: 23, deg: 165.405405405 },
    { number: 10, deg: 175.135135135 },
    { number: 5, deg: 184.864864865 },
    { number: 24, deg: 194.594594595 },
    { number: 16, deg: 204.324324324 },
    { number: 33, deg: 214.054054054 },
    { number: 1, deg: 223.783783784 },
    { number: 20, deg: 233.513513514 },
    { number: 14, deg: 243.243243243 },
    { number: 31, deg: 252.972972973 },
    { number: 9, deg: 262.702702703 },
    { number: 22, deg: 272.432432432 },
    { number: 18, deg: 282.162162162 },
    { number: 29, deg: 291.891891892 },
    { number: 7, deg: 301.621621622 },
    { number: 28, deg: 311.351351351 },
    { number: 12, deg: 321.081081081 },
    { number: 35, deg: 330.810810811 },
    { number: 3, deg: 340.540540541 },
    { number: 26, deg: 350.27027027 }
];

const toggleActive = (element, add) => {
    element.classList[add ? 'add' : 'remove']('active');
};

const placeBet = (bet) => {
    bet = { ...bet, value: 1 };
    let existingBet = bets.find(b => b.bet === bet.bet);
    existingBet ? existingBet.value++ : bets.push(bet);
    console.log(bets);
};

const removeAllBets = () => {
    elements.forEach(element => toggleActive(element, false));
    bets = [];
};

const updateBalance = () => {
    let displayBalance = document.getElementById("balance");
    displayBalance.innerHTML = balance;
}

const updateResult = (result) => {
    history.push(result);
    
    if (history.length > 5) {
        history.shift();
    }

    spinWheel(result);
};

const spinWheel = (result) => {
    let wheel = document.getElementById("wheel");
    let deg = MAP_WHEEL.find(w => w.number == result.number).deg;
    let totalRotation = -deg + (360 * 3);
    
    wheel.style.transition = "transform 4s ease-out";
    wheel.style.transform = `rotate(${totalRotation}deg)`;
    
    setTimeout(() => {
        wheel.style.transition = "none";
        wheel.style.transform = `rotate(${-deg}deg)`;
        displayResult(result);
        removeAllBets();
    }, 4000);
};

const displayResult = (result) => {
    let displayHistory = document.getElementById("history");
    displayHistory.innerHTML = history.map(res => `<div class="history-item ${res.color == "B" ? "black" : res.color == "R" ? "red" : "green"}">${res.number}</div>`).join(" ");
};

elements.forEach(element => {
    element.addEventListener("click", () => {
        toggleActive(element, true);
        let bet = { bet: element.innerHTML };
        let updatedBet = placeBet(bet);
        if (element.classList.contains("active")) {
            element.textContent = `${updatedBet.bet} (${updatedBet.value})`;
        }
    });
});

const sendBets = () => {
    fetch('/bet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bets)
    })
    .then(response => response.json())
    .then(data => {
        balance = data.balance + data.profit;
        updateBalance();
        updateResult(data.result);
    })
    .catch(error => console.error("Error sending bets:", error));
};

updateBalance();

PLAY.addEventListener("click", () => {
    sendBets();
});
NEW_GAME.addEventListener("click", () => {
    removeAllBets();
    sendNewGame();
});
CANCEL.addEventListener("click", removeAllBets);
