document.addEventListener('DOMContentLoaded', initializeGame);

let gold = 0;
let money = 0;
let energy = 100;
let taxRate = 1;
let missedPayments = 0;
let taxIncreases = 0;
const maxTaxIncreases = 6; // Limit for tax rate increases
let currentQuestionIndex = 0;
let taxInterval, taxRateInterval, gameEndTimer;

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

function initializeGame() {
    setupGameHTML();
    startTaxation();
    setTimeout(() => {
        alert("The Almoravids are attacking! Sell your gold now before the Ghana Empire collapses!");
    }, 450000);
    gameEndTimer = setTimeout(() => {
        alert("The Ghana Empire has collapsed, you have no one to sell your gold to anymore.");
        endGame();
    }, 480000); // End game after 8 minutes
}

function setupGameHTML() {
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = `
        <h1>Trans-Saharan Trade Game</h1>
        <div id="game">
            <div id="resources">
                <p>Gold: <span id="gold">${gold}</span></p>
                <p>Money: <span id="money">${money}</span></p>
                <p>Energy: <span id="energy">${energy}</span></p>
            </div>
            <div id="actions">
                <button id="buyGold" onclick="buyGold()">Buy Gold</button>
                <button id="sellGold" onclick="sellGold()">Sell Gold</button>
                <button id="mineGold" onclick="mineGold()">Mine for Gold</button>
                <button id="earnEnergy" onclick="showQuestion()">Earn Energy</button>
            </div>
            <div id="quiz" style="display:none;">
                <p id="question"></p>
                <div id="answers"></div>
            </div>
        </div>
    `;
    updateResources();
}

function buyGold() {
    if (money >= 50) {
        gold += 1;
        money -= 50;
        updateResources();
    } else {
        alert("Not enough money to buy gold!");
    }
}

function sellGold() {
    if (gold > 0) {
        gold -= 1;
        money += 50;
        updateResources();
    } else {
        alert("You have no gold to sell!");
    }
}

function mineGold() {
    if (energy >= 20) {
        energy -= 20;
        const goldMined = Math.floor(Math.random() * 3) + 1;
        gold += goldMined;
        alert(`You mined ${goldMined} gold!`);
        updateResources();
    } else {
        alert("Not enough energy to mine!");
    }
}

function showQuestion() {
    const questionObj = questions[currentQuestionIndex];
    document.getElementById('question').textContent = questionObj.question;
    let answersHtml = questionObj.answers.map((answer, index) => 
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
    taxInterval = setInterval(applyTax, 30000);
    taxRateInterval = setInterval(() => {
        if (taxIncreases < maxTaxIncreases) {
            taxRate++;
            taxIncreases++;
            alert(`Tax rate increased to ${taxRate}.`);
        }
    }, 60000);
}

function applyTax() {
    if (gold >= taxRate) {
        gold -= taxRate;
        alert(`King Cabral has taken ${taxRate} gold as tax.`);
    } else {
        missedPayments++;
        if (missedPayments >= 2) {
            alert("You cannot pay King Cabral's gold tax. Game Over.");
            clearTimeout(gameEndTimer); // Cancel the scheduled game end
            endGame();
            return;
        }
        alert("You can't afford the gold tax. King Cabral is unhappy. Collect more gold or face the consequences.");
    }
    updateResources();
}

function endGame() {
    clearInterval(taxInterval);
    clearInterval(taxRateInterval);
    let playerName = prompt("Game Over! Enter your name for the scoreboard:", "Player Name");
    if (playerName) {
        saveScore(playerName, money);
        showScores();
    }
}

function saveScore(playerName, score) {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push({ playerName, score });
    localStorage.setItem('scores', JSON.stringify(scores));
}

function showScores() {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    let scoresHTML = '<h2>Scoreboard</h2>';
    scores.forEach((entry, index) => {
        scoresHTML += `<p>${index + 1}. ${entry.playerName} - ${entry.score}</p>`;
    });
    document.getElementById('gameContainer').innerHTML = scoresHTML;
}

function updateResources() {
    document.getElementById('gold').textContent = gold;
    document.getElementById('money').textContent = money;
    document.getElementById('energy').textContent = energy;
}
