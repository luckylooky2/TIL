'use strict';

/*
// DOM access
const messageClass = document.querySelector('.message');
// const로 하면 수정할 때 error가 발생하기 때문에 Correct Number! 코드를 실행하지 않아서 test 1이 나타나게 된다
let messageText = document.querySelector('.message').textContent;

// DOM manipulation
messageClass.textContent = 'test 1'; // changed. stored inside of DOM element node
messageText = 'test 2'; // not changed. this variable is not part of DOM object

// 코드 순서에 따라 test 1 -> Correct Number! 로 수정된다
document.querySelector('.message').textContent = '🎉 Correct Number!';
document.querySelector('.guess').value = 10;
*/

document.querySelector('.check').addEventListener('click', e => {
  // string type
  const guess = Number(document.querySelector('.guess').value);
  if (guess <= 0) {
    document.querySelector('.message').textContent = '❌ Wrong Input!';
  } else {
    document.querySelector('.message').textContent = '🎉 Correct Number!';
  }
});

console.log(document.querySelector('.guess').value);
