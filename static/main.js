const CANCEL = document.getElementById("cancel");
const PLAY = document.getElementById("play");
const NEW = document.getElementById("new");

let betElements = document.querySelectorAll(".item-bet-number, .item-bet-color");
let chips = document.querySelectorAll(".betting-item");
let strategiesElements = document.querySelectorAll(".strategie-item");
let chipValue = 1;
let bets = [];
let balance = 100;
let history = [];
let totalBet = 0;

let strategieBet = { type: "Martingale", bet: { value: 0, bet: "" }, objectif: 0, iterations: 0 }
let strategieColorElements = document.querySelectorAll(".item-color-strategie");
let strategieColor;
let strategieObjectif;
let strategieIterations;
let strategieType = "Martingale";

let balanceHistory = []
let labels = []

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

const placeChip = (element, bet) => {
    element.innerHTML
        = `${element.getAttribute('id')}<div class="bet-chip-item ${bet.value >= 500 ? "xl" : bet.value >= 100 ? "l" : bet.value >= 50 ? "m" : bet.value >= 10 ? "sm" : bet.value >= 5 ? "s" : "xs"}">${bet.value}</div>`;
}

const placeBet = (bet) => {
    console.log(chipValue, balance);

    if (chipValue > balance)
        return;

    bet = { ...bet, value: chipValue };
    let existingBet = bets.find(b => b.bet === bet.bet);
    existingBet ? existingBet.value += chipValue : bets.push(bet);
    totalBet += chipValue;
    updateTotalBet();
    return existingBet ?? bet;
};

const updateTotalBet = () => {
    balance -= chipValue;
    document.getElementById('balance').innerText = balance;
    document.getElementById("total-bet").innerHTML = totalBet;
}

const removeAllBets = () => {
    betElements.forEach(element => {
        toggleActive(element, false)
        element.innerHTML = element.getAttribute("id");
    });
    bets = [];
    balance += totalBet
    document.getElementById('balance').innerText = balance;
    totalBet = 0;
    document.getElementById("total-bet").innerHTML = totalBet;
};

function updateBalance() {
    fetch('/get_balance')
        .then(response => response.json())
        .then(data => {
            balance = data.balance;
            balanceHistory.push(balance)
            labels.push(labels.length)
            balanceChart.update();
            document.getElementById('balance').innerText = balance;
        });
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
        updateBalance();
        removeAllBets();
    }, 4000);
};

const displayResult = (result) => {
    let displayHistory = document.getElementById("history");
    displayHistory.innerHTML = history.map(res => `<div class="history-item ${res.color == "B" ? "black" : res.color == "R" ? "red" : "green"}">${res.number}</div>`).join(" ");
};

betElements.forEach(element => {
    element.addEventListener("click", () => {
        let bet = { bet: element.getAttribute('id') };
        let updatedBet = placeBet(bet);
        placeChip(element, updatedBet);
        toggleActive(element, true);
    });
});

strategiesElements.forEach(element => {
    element.addEventListener("click", () => {
        strategiesElements.forEach(strategiesSelected => {
            strategiesSelected.classList.remove("primary");
        });

        element.classList.add("primary");
        strategieType = element.innerHTML;

        if (strategieType == "Martingale")
            document.querySelectorAll(".martingale").forEach(element => {
                element.style.display = "flex";
            });
        else
            document.querySelectorAll(".martingale").forEach(element => {
                element.style.display = "none";
            });

    });
});
strategieColorElements.forEach(element => {
    element.addEventListener("click", () => {
        strategieColorElements.forEach(elementSelected => {
            elementSelected.classList.remove("active");
        })

        element.classList.add("active");
        strategieColor = element.getAttribute("id");
    });
});

chips.forEach(chip => {
    chip.addEventListener("click", () => {
        chipValue = parseInt(chip.innerHTML);

        chips.forEach(chipSelected => {
            if (chip == chipSelected)
                toggleActive(chip, true);
            else
                toggleActive(chipSelected, false);
        });
    });
})

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
            updateResult(data.result);
        })
        .catch(error => console.error("Error sending bets:", error));
};

const sendNewGame = () => {
    fetch('/new', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            updateBalance();
        })
        .catch(error => console.error("Error sending bets:", error));
}

PLAY.addEventListener("click", () => {
    sendBets();
});
CANCEL.addEventListener("click", removeAllBets);
NEW.addEventListener("click", sendNewGame);

const sendMartingale = () => {
    fetch('/martingale', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(strategieBet)
    })
        .then(response => response.json())
        .then(data => {
            data.balance_history.forEach((balance, index) => {
                if (index < data.balance_history.length - 1) {
                    balanceHistory.push(balance);
                    labels.push(index + 1);
                }
            })
            updateBalance();
        })
        .catch(error => console.error("Error sending bets:", error));
}

const sendHardi = () => {
    fetch('/hardi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(strategieBet)
    })
        .then(response => response.json())
        .then(data => {
            data.balance_history.forEach((balance, index) => {
                if (index < data.balance_history.length - 1) {
                    balanceHistory.push(balance);
                    labels.push(index + 1);
                }
            })
            updateBalance();
        })
        .catch(error => console.error("Error sending bets:", error));
}

document.getElementById("play-strategie").addEventListener("click", () => {
    strategieBet.type = strategieType;
    strategieBet.bet.bet = strategieColor;
    strategieBet.bet.value = document.getElementById("strategie-mise").value;
    strategieBet.objectif = document.getElementById("strategie-objectif").value;
    strategieBet.iterations = document.getElementById("strategie-iterations").value;

    if (strategieType == "Martingale")
        sendMartingale();
    else
        sendHardi();
});


const ctx = document.getElementById('balanceChart').getContext('2d');
const balanceChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Évolution de la balance',
            data: balanceHistory,
            borderColor: '#57f287',
            backgroundColor: '#57f287CC',
            borderWidth: 2,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Tours'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Balance'
                },
                beginAtZero: true
            }
        }
    }
});

updateBalance();