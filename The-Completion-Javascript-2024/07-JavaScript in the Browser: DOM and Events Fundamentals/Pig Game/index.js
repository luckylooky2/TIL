'use strict';

const player1 = document.querySelector('.player--0');
const player2 = document.querySelector('.player--1');
let isP1Turn = true;

const passTurnTo = function (player) {
  isP1Turn = !isP1Turn;
  let from, to;
  if (player === 'p1') {
    from = player2;
    to = player1;
  } else {
    from = player1;
    to = player2;
  }
  // 이 부분도 공통 로직에 포함
  from.querySelector('.current-score').textContent = 0;
  to.classList.add('player--active');
  from.classList.remove('player--active');
  // 더 쉬운 방법
  // to.classList.toggle('player--active');
  // from.classList.toggle('player--active');
};

const init = function () {
  player1.querySelector('.score').textContent = 0;
  player1.querySelector('.current-score').textContent = 0;
  player2.querySelector('.score').textContent = 0;
  player2.querySelector('.current-score').textContent = 0;
  isP1Turn = true;
  player1.classList.add('player--active');
  player2.classList.remove('player--active');
  player1.classList.remove('player--winner');
  player2.classList.remove('player--winner');
  document.querySelector('.dice').classList.add('hidden');
  document.querySelector('.btn--roll').disabled = false;
  document.querySelector('.btn--hold').disabled = false;
};

const finish = function () {
  document.querySelector('.dice').classList.add('hidden');
  document.querySelector('.btn--roll').disabled = true;
  document.querySelector('.btn--hold').disabled = true;
};

// Starting conditions
init();

// Rolling dice functionality
document.querySelector('.btn--roll').addEventListener('click', () => {
  // 1. Generating a random dice roll
  const random = Math.floor(Math.random() * 6) + 1;

  // 2. Display dice
  document.querySelector('.dice').classList.remove('hidden');
  // element.attribute 형식으로 속성 값을 수정할 수 있음
  document.querySelector('.dice').src = `dice-${random}.png`;
  const curr = isP1Turn ? player1 : player2;

  // 3. Check for rolled 1
  if (random === 1) {
    // Switch to next player
    passTurnTo(isP1Turn ? 'p2' : 'p1');
  } else {
    // Add dice to current score
    curr.querySelector('.current-score').textContent =
      Number(curr.querySelector('.current-score').textContent) + random;
  }
});

document.querySelector('.btn--hold').addEventListener('click', () => {
  const curr = isP1Turn ? player1 : player2;
  // 1. Add current score to active player's score
  curr.querySelector('.score').textContent =
    Number(curr.querySelector('.score').textContent) +
    Number(curr.querySelector('.current-score').textContent);

  // 2. Check if player's score is >= 100
  if (Number(curr.querySelector('.score').textContent) >= 100) {
    // Finish game
    curr.classList.add('player--winner');
    curr.classList.remove('player--active');
    finish();
  }

  // Switch to next player
  passTurnTo(isP1Turn ? 'p2' : 'p1');
});

document.querySelector('.btn--new').addEventListener('click', () => {
  init();
});
