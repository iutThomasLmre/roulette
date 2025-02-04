const CANCEL_BET = document.getElementById("cancel-bet");
const PLACE_BET = document.getElementById("place-bet");
const NEW_GAME = document.getElementById("new-game");

let elements = document.querySelectorAll(".item-number, .item-color");
let bets = [];
let balance = 100;

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
    let displayResult = document.getElementById("result");
    displayResult.innerHTML = result;
}

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

const sendNewGame = () => {
    fetch('/new-game', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        balance = data.balance;
        updateBalance();
    })
    .catch(error => console.error(error));
}

updateBalance();

PLACE_BET.addEventListener("click", () => {
    sendBets();
    removeAllBets();
});
NEW_GAME.addEventListener("click", () => {
    removeAllBets();
    sendNewGame();
});
CANCEL_BET.addEventListener("click", removeAllBets);
