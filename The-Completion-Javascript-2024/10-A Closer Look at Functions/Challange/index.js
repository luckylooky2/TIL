'use strict';

const poll = {
  question: 'What is your favorite programming language?',
  options: ['0: Javascript', '1: Python', '2: Rust', '3: C++'],
  answers: new Array(4).fill(0),
};

poll.displayResults = function (type = 'array') {
  if (type === 'string') {
    console.log(`Poll results are ${this.answers.join(', ')}`);
  } else if (type === 'array') {
    console.log(this.answers);
  }
};

poll.registerNewAnswer = function () {
  const input = Number(prompt(`${this.question}\n${this.options.join('\n')}`));

  if (input >= 0 && input <= 3) {
    this.answers[input]++;
  }

  this.displayResults();
};

const button = document
  .querySelector('button')
  .addEventListener('click', poll.registerNewAnswer.bind(poll));

poll.displayResults.call({ answers: [5, 1, 2] }, 'string'); // Poll results are 5, 1, 2
poll.displayResults.call({ answers: [5, 1, 2] }); // [5, 1, 2]
poll.displayResults.call({ answers: [1, 2, 3, 4, 5] }, 'string'); // Poll results are 1, 2, 3, 4, 5
