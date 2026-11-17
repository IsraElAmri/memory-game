
const celebrities = [
    { name: "Albert Einstein", image: "einstein.jpg" },
    { name: "Lewis Hamilton", image: "hamilton.jpg" },
    { name: "Nelson Mandela", image: "mandela.jpg" },
    { name: "Lando Norris", image: "norris.jpg" },
    { name: "Mahatma Gandhi", image: "gandhi.jpg" },
    { name: "Steve Jobs", image: "jobs.jpg" },
    { name: "Martin Luther King", image: "king.jpg" },
    { name: "Christian von Koenigsegg", image: "koenigsegg.jpg" },
    { name: "Horacio Pagani", image: "pagani.jpg" },
    { name: "Elon Musk", image: "musk.jpg" },
    { name: "Barack Obama", image: "obama.jpg" },
    { name: "Carlos Sainz", image: "sainz.jpg" },
    { name: "Michael Jordan", image: "jordan.jpg" },
    { name: "Cristiano Ronaldo", image: "ronaldo.jpg" },
    { name: "Max Verstappen", image: "verstappen.jpg" },
    { name: "Brad Pitt", image: "pitt.jpg" }
];

let timeLeft = 60;
let score = 0;
let timer;
let isMemorizationPhase = true;
let currentPerson = "";
let cards = [];

const cardsContainer = document.getElementById('cards-container');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const currentPersonDisplay = document.getElementById('current-person');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const memorizationNotice = document.getElementById('memorization-notice');
const memorizationTimeDisplay = document.getElementById('memorization-time');
const performanceMessage = document.getElementById('performance-message');

function initGame() {

    timeLeft = 60;
    score = 0;
    isMemorizationPhase = true;
    cards = [];

    timeDisplay.textContent = timeLeft;
    memorizationTimeDisplay.textContent = timeLeft;
    scoreDisplay.textContent = score;
    currentPersonDisplay.textContent = "-";

    memorizationNotice.style.display = 'block';

    gameOverScreen.style.display = "none";

    shuffleCards();
    createCards();

    startTimer();
}

function shuffleCards() {

    const shuffled = [...celebrities];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    cards = shuffled;
}

function createCards() {

    cardsContainer.innerHTML = "";

    cards.forEach((celebrity, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;

        const cardImage = document.createElement('img');
        cardImage.className = 'card-image';
        cardImage.src = `images/${celebrity.image}`;
        cardImage.alt = celebrity.name;
        cardImage.onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZTwvdGV4dD48dGV4dCB4PSIxMDAiIHk9IjEyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==';
        };

        const cardName = document.createElement('div');
        cardName.className = 'card-name';
        cardName.textContent = celebrity.name;

        card.appendChild(cardImage);
        card.appendChild(cardName);

        card.addEventListener('click', handleCardClick);

        cardsContainer.appendChild(card);
    });
}

function startTimer() {
    clearInterval(timer);

    timer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        
        if (isMemorizationPhase) {
            memorizationTimeDisplay.textContent = timeLeft;
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            if (isMemorizationPhase) {

                endMemorizationPhase();
            }
        }
    }, 1000);
}

function endMemorizationPhase() {
    isMemorizationPhase = false;
    
    memorizationNotice.style.display = 'none';

    const allCards = document.querySelectorAll('.card');
    allCards.forEach((card) => {
        card.classList.add('masked');
    });

    selectRandomPerson();
}

function selectRandomPerson() {
    const randomIndex = Math.floor(Math.random() * cards.length);
    currentPerson = cards[randomIndex].name;
    currentPersonDisplay.textContent = currentPerson;
    currentPersonDisplay.style.color = '#ff6b6b';
    currentPersonDisplay.style.fontWeight = 'bold';
}

function handleCardClick(event) {

    if (isMemorizationPhase) return;

    const card = event.currentTarget;
    const cardIndex = parseInt(card.dataset.index);
    const selectedPerson = cards[cardIndex].name;

    if (selectedPerson === currentPerson) {

        card.classList.remove('masked');
        card.classList.add('show-temp');
        card.style.boxShadow = '0 0 25px #4CAF50';
        
        setTimeout(() => {

            card.classList.remove('show-temp');
            card.classList.add('masked');
            card.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
            
            score++;
            scoreDisplay.textContent = score;
            scoreDisplay.style.color = '#4CAF50';
            
            setTimeout(() => {
                scoreDisplay.style.color = '';
            }, 500);

            selectRandomPerson();
        }, 1000);
        
    } else {

        card.style.boxShadow = '0 0 25px #ff6b6b';
        setTimeout(() => {
            endGame();
        }, 500);
    }
}

function endGame() {
    clearInterval(timer);

    let message = "";
    if (score >= 12) {
        message = "Performance exceptionnelle! Vous avez une mémoire incroyable!";
    } else if (score >= 8) {
        message = "Très bon score! Votre mémoire est excellente!";
    } else if (score >= 5) {
        message = "Bon jeu! Continuez à vous entraîner!";
    } else {
        message = "Ne vous découragez pas! La pratique rend parfait!";
    }
    
    performanceMessage.textContent = message;

    finalScoreDisplay.textContent = score;
    gameOverScreen.style.display = "flex";
}

restartButton.addEventListener('click', initGame);

window.addEventListener('load', initGame);