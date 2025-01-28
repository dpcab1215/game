document.addEventListener('DOMContentLoaded', () => {
    setupWelcomeScreen();
});

let gold = 0;
let money = 0;
let energy = 100;
let taxRate = 10; // Initial tax rate (percentage)
let missedPayments = 0;
let taxationInterval = 45000; // Tax interval (45 seconds)
let currentQuestionIndex = 0;
let taxInterval, gameEndTimer;

const questions = [
    { question: "What was a major export of the Ghana Empire?", answers: ["Salt", "Gold", "Silk", "Spices"], correct: 1 },
    { question: "Which animal was crucial for Trans-Saharan trade?", answers: ["Horse", "Elephant", "Camel", "Lion"], correct: 2 },
    { question: "Which empire succeeded the Ghana Empire?", answers: ["Roman Empire", "Mali Empire", "Ottoman Empire", "British Empire"], correct: 1 },
    { question: "What was a significant import into the Ghana Empire?", answers: ["Tea", "Horses", "Silk", "Spices"], correct: 2 },
    { question: "What material was considered valuable in North Africa and exchanged for gold?", answers: ["Salt", "Silk", "Spices", "Ivory"], correct: 0 },
    { question: "What was the actual name of the Ghana Empire?", answers: ["Zimbabwe", "Mali", "Ghana", "Wagadou"], correct: 3 },
    { question: "What was the title for the king of the Ghana Empire?", answers: ["Ghana", "Emperor", "Sultan", "Caliph"], correct: 0 },
    { question: "Which of the following was NOT traded along the Trans-Saharan trade routes?", answers: ["Gold", "Islam", "Salt", "Horses"], correct: 3 },
    { question: "The Saharan Desert is the ____ desert in the world.", answers: ["largest", "second largest", "third largest", "fourth largest"], correct: 1 },
    { question: "What would you call a good that is bought and sold around the world?", answers: ["capital", "commodity", "culture", "vegetable"], correct: 1 },
    { question: "What was the name of the explorer who used the Trans-Saharan trade routes to go explore Asia?", answers: ["Christopher Columbus", "Vasco de Gama", "Ibn Battuta", "Marco Polo"], correct: 2 },
    { question: "What was the name for the traditional West African storytellers who passed down history by word of mouth?", answers: ["ghanas", "gladiators", "orators", "griots"], correct: 3 },
    { question: "What was the capital of the Ghana Empire?", answers: ["Kumbi Saleh", "Timbuktu", "Cairo", "Accra"], correct: 0 },
    { question: "What was the nickname for the Ghana Empire?", answers: ["Land of Gods", "Land of Salt", "Land of Gold", "Land of Water"], correct: 2 },
    { question: "Which of the following words means that power in the Ghana Empire was passed down to the king's sister's first son?", answers: ["patrilineal", "monarchy", "patriarchal", "matrilineal"], correct: 3 },
    { question: "What religion did many merchants adopt in the Ghana Empire?", answers: ["Islam", "Judaism", "Hinduism", "Buddhism"], correct: 0 },
    { question: "What is one written source that we have on the Ghana Empire?", answers: ["European Explorer Marco Polo", "Arab Historian al-Bakri", "Chinese General Sun Tzu", "African King Tunka Manin"], correct: 1 },
    { question: "Which civilization led to the downfall of the Ghana Empire?", answers: ["Byzantine Empire", "Almoravid Dynasty", "Songhai Empire", "Abbasid Caliphate"], correct: 1 },
    { question: "What is one king from the Ghana Empire that we have historical accounts about?", answers: ["Mansa Musa", "Ibn Battuta", "Ismail I", "Tunka Manin"], correct: 3 },
    { question: "True or false: Most people living in the Ghana Empire converted to Islam.", answers: ["True", "False"], correct: 1 },
];

function setupWelcomeScreen() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div id="welcomeScreen">
            <h1>Welcome to the Trans-Saharan Trade Game!</h1>
            <p>You are a merchant in the Ghana Empire. Mine and sell gold while managing your resources. Beware of King Cabral's taxes and the Almoravids!</p>
            <button onclick="initializeGame()">Start Game</button>
        </div>
    `;
}

function initializeGame() {
    setupGameHTML();
    startTaxation();
    gameEndTimer = setTimeout(() => {
        alert("The Almoravids are attacking! Sell your gold now before the Ghana Empire collapses!");
        setTimeout(() => endGame("The Ghana Empire has collapsed, you have no one to sell your gold to anymore."), 30000);
    }, 450000); // Warning at 7 minutes, game ends at 8 minutes
}

function setupGameHTML() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div id="resources">
            <p>Gold: <span id="gold">0</span></p>
            <p>Money: <span id="money">0</span></p>
            <p>Energy: <span id="energy">100</span></p>
        </div>
        <div id="buttonRows">
            <div id="actionRowTop">
                <button id="mineGold" onclick="mineGold()">Mine for Gold</button>
                <button id="earnEnergy" onclick="showQuestion()">Earn Energy</button>
            </div>
            <div id="actionRowBottom">
                <button id="sellGold" onclick="sellGold()">Sell Gold</button>
            </div>
        </div>
        <div id="quiz" style="display:none;">
            <p id="question"></p>
            <div id="answers"></div>
        </div>
    `;
    updateResources();
}

function mineGold() {
    if (energy >= 20) { // Mining requires 20 energy
        energy -= 20;
        const goldMined = Math.floor((Math.random() * 3 + 1) * 1.5); // 50% more gold
        gold += goldMined;
        alert(`You mined ${goldMined} gold!`);
        updateResources();
    } else {
        alert("Not enough energy to mine!");
    }
}

function sellGold() {
    if (gold > 0) {
        money += 50; // Earn money for one gold sold
        gold -= 1;
        alert("You sold 1 gold for 50 money!");
        updateResources();
    } else {
        alert("You have no gold to sell!");
    }
}

function showQuestion() {
    const questionObj = questions[currentQuestionIndex];
    document.getElementById('question').textContent = questionObj.question;
    const answersHtml = questionObj.answers.map((answer, index) =>
        `<button onclick="selectAnswer(${index}, ${questionObj.correct})">${answer}</button>`
    ).join('');
    document.getElementById('answers').innerHTML = answersHtml;
    document.getElementById('quiz').style.display = 'block';
}

window.selectAnswer = function(selected, correct) {
    if (selected === correct) {
        alert("Correct! You've earned 10 energy.");
        energy += 10;
    } else {
        alert("Wrong answer.");
    }
    document.getElementById('quiz').style.display = 'none';
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    updateResources();
};

function startTaxation() {
    let baseTaxAmount = 1; // Minimum tax starts at 1 gold

    setTimeout(() => {
        taxInterval = setInterval(() => {
            applyTax(baseTaxAmount);
            baseTaxAmount += 1; // Increment base tax over time
        }, taxationInterval); // Collect taxes every 30 seconds
    }, 60000); // Delay taxation by 1 minute
}

function applyTax(baseTaxAmount) {
    const taxAmount = Math.max(Math.floor(gold * (taxRate / 100)), baseTaxAmount);
    if (gold >= taxAmount) {
        gold -= taxAmount;
        alert(`King Cabral has taken ${taxAmount} gold (${taxRate}%) as tax.`);
    } else {
        missedPayments++;
        if (missedPayments === 1) {
            alert("You couldn't pay the full tax. King Cabral is not happy! Gather more gold to avoid his wrath.");
        } else if (missedPayments >= 2) {
            endGame("You have faced the wrath of King Cabral. The game is over.");
        }
    }
    updateResources();
}

function endGame(gameOverMessage) {
    clearInterval(taxInterval);
    clearTimeout(gameEndTimer); // Ensure the game timer stops

    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <div id="endScreen">
            <h1>Game Over</h1>
            <p>${gameOverMessage}</p>
            <p>Thanks for playing!</p>
            <button onclick="restartGame()">Restart Game</button>
        </div>
    `;
}

function restartGame() {
    gold = 0;
    money = 0;
    energy = 100;
    taxRate = 10;
    missedPayments = 0;
    clearInterval(taxInterval);
    clearTimeout(gameEndTimer);
    initializeGame();
}

function updateResources() {
    document.getElementById('gold').textContent = gold;
    document.getElementById('money').textContent = money;
    document.getElementById('energy').textContent = energy;
}
