const CANCEL_BET = document.getElementById("cancel-bet");
const PLACE_BET = document.getElementById("place-bet");

let elements = document.querySelectorAll(".item-number, .item-color");
let bets = [];

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

CANCEL_BET.addEventListener("click", removeAllBets);
PLACE_BET.addEventListener("click", removeAllBets);
