
const MAX_HP = 100;
const HERO_ATTACK_MIN = 8;
const HERO_ATTACK_MAX = 15;
const ENEMY_ATTACK_MIN = 5;
const ENEMY_ATTACK_MAX = 14;
const HEAL_AMOUNT = 20;
const MAX_HEALS = 3;
const CRIT_CHANCE = 0.10;
const CRIT_MULTIPLIER = 1.5;

let heroHP = MAX_HP;
let enemyHP = MAX_HP;
let healsLeft = MAX_HEALS;
let isHeroDefending = false;
let isGameOver = false;
let isEnemyTurn = false;
let actionLog = [];
let enemyTimer = null;

const heroHpText = document.getElementById('heroHpText');
const heroHpBar = document.getElementById('heroHpBar');
const enemyHpText = document.getElementById('enemyHpText');
const enemyHpBar = document.getElementById('enemyHpBar');
const healsLeftCount = document.getElementById('healsLeftCount');
const gameMessage = document.getElementById('gameMessage');
const actionLogList = document.getElementById('actionLog');

const attackBtn = document.getElementById('attackBtn');
const defendBtn = document.getElementById('defendBtn');
const healBtn = document.getElementById('healBtn');
const restartBtn = document.getElementById('restartBtn');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showMessage(message, type = "info") {
    if (!gameMessage) return;

    gameMessage.textContent = message;
    gameMessage.className =
        `alert alert-${type} text-center py-2`;
}

function addLog(message) {
    actionLog.unshift(message);

    if (actionLog.length > 5) {
        actionLog.pop();
    }

    actionLogList.innerHTML = '';

    actionLog.forEach(log => {
        const li = document.createElement('li');
        li.textContent = log;
        actionLogList.appendChild(li);
    });
}

function updateUI() {
    heroHpText.textContent = heroHP;
    enemyHpText.textContent = enemyHP;
    healsLeftCount.textContent = healsLeft;

    heroHpBar.style.width = `${heroHP}%`;
    enemyHpBar.style.width = `${enemyHP}%`;

    attackBtn.disabled = isGameOver || isEnemyTurn;
    defendBtn.disabled = isGameOver || isEnemyTurn;
    healBtn.disabled = isGameOver || isEnemyTurn || healsLeft <= 0;

    if (isGameOver) {
        attackBtn.classList.add('d-none');
        defendBtn.classList.add('d-none');
        healBtn.classList.add('d-none');
        restartBtn.classList.remove('d-none');
    } else {
        attackBtn.classList.remove('d-none');
        defendBtn.classList.remove('d-none');
        healBtn.classList.remove('d-none');
        restartBtn.classList.add('d-none');
    }
}

function checkGameOver() {
    if (enemyHP <= 0) {
        enemyHP = 0;
        isGameOver = true;

        addLog("Ippon! You win!");

        updateUI();
        return true;
    }

    if (heroHP <= 0) {
        heroHP = 0;
        isGameOver = true;

        addLog("Ippon! Opponent wins!");

        updateUI();
        return true;
    }

    return false;
}

function executeEnemyTurn() {
    if (isGameOver) return;

    let enemyDamage = getRandomInt(
        ENEMY_ATTACK_MIN,
        ENEMY_ATTACK_MAX
    );

    if (isHeroDefending) {
        enemyDamage = Math.floor(enemyDamage / 2);

        addLog(
            `Opponent's attempt defended. ${enemyDamage} damage.`
        );

        isHeroDefending = false;
    } else {
        addLog(
            `Opponent executed an attempt. ${enemyDamage} damage.`
        );
    }

    heroHP = Math.max(0, heroHP - enemyDamage);

    isEnemyTurn = false;

    if (!checkGameOver()) {
    }

    updateUI();
}

function startEnemyTurn() {
    if (isGameOver || isEnemyTurn) return;

    isEnemyTurn = true;

    updateUI();

    enemyTimer = setTimeout(() => {
        enemyTimer = null;
        executeEnemyTurn();
    }, 600);
}

attackBtn.addEventListener('click', function() {
    if (isGameOver || isEnemyTurn) return;

    isHeroDefending = false;

    let damage = getRandomInt(
        HERO_ATTACK_MIN,
        HERO_ATTACK_MAX
    );

    const isCrit = Math.random() < CRIT_CHANCE;

    if (isCrit) {
        damage = Math.round(damage * CRIT_MULTIPLIER);

        addLog(
            `You executed Critical Attempt. ${damage} damage.`
        );
    } else {
        addLog(
            `You executed attempt. ${damage} damage.`
        );
    }

    enemyHP = Math.max(0, enemyHP - damage);

    if (checkGameOver()) return;

    updateUI();
    startEnemyTurn();
});

defendBtn.addEventListener('click', function() {
    if (isGameOver || isEnemyTurn) return;

    isHeroDefending = true;

    addLog(
        "Defended against opponent's attempt."
    );

    updateUI();
    startEnemyTurn();
});

healBtn.addEventListener('click', function() {
    if (isGameOver || isEnemyTurn) return;

    isHeroDefending = false;

    const oldHP = heroHP;

    heroHP = Math.min(
        MAX_HP,
        heroHP + HEAL_AMOUNT
    );

    const recovered = heroHP - oldHP;

    healsLeft--;

    addLog(
        `You recovered ${recovered} HP.`
    );

    updateUI();
    startEnemyTurn();
});

restartBtn.addEventListener('click', function() {

    if (enemyTimer !== null) {
        clearTimeout(enemyTimer);
        enemyTimer = null;
    }

    heroHP = MAX_HP;
    enemyHP = MAX_HP;
    healsLeft = MAX_HEALS;

    isHeroDefending = false;
    isGameOver = false;
    isEnemyTurn = false;

    actionLog = [];

    actionLogList.innerHTML = '';

    addLog(
        'Hajime! New match begins.'
    );
    updateUI();
});

addLog('Hajime! Match begins.');

updateUI();
