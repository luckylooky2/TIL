'use strict';

const btns = document.querySelectorAll('.show-modal');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const handleOpenModal = () => {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
const handleCloseModal = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// Q) map은 사용불가? NodeList는 Array가 아니기 때문
// NodeList -> Array -> Object (x)
// NodeList -> Object
// Array -> Object
// https://developer.mozilla.org/en-US/docs/Web/API/NodeList

// NodeList에는 Array와 독립적으로 forEach 메서드가 존재한다

for (let i = 0; i < btns.length; i++) {
  btns[i].addEventListener('click', handleOpenModal);
}

document
  .querySelector('.close-modal')
  .addEventListener('click', handleCloseModal);
document.querySelector('.overlay').addEventListener('click', handleCloseModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    handleCloseModal();
  }
});

// Q) 이벤트 버블링, 캡쳐링 순서
