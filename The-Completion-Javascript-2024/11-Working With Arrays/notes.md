### `slice`, `splice` 메서드

```js
const arr = ['a', 'b', 'c', 'd', 'e'];

console.log(arr.slice(2)); // ['c', 'd', 'e']
console.log(arr.slice(2, 4)); // ['c', 'd']
console.log(arr.slice(-2)); // ['d', 'e']
console.log(arr.slice(-1)); // ['e']
console.log(arr.slice(1, -2)); // ['b', 'c']
console.log(arr.slice()); // ['a', 'b', 'c', 'd', 'e']
console.log(arr.slice([...arr])); // ['a', 'b', 'c', 'd', 'e']
```
- 시작 지점, 끝 지점을 지정하여 *배열 요소를 복사한 새로운 배열을 반환*한다
- `(start?: number | undefined, end?: number | undefined)`
- 인자
	- 0개 : 전체 배열 복사
	- 1개 : 시작 지점 ~ 마지막(고정)
	- 2개 : 시작 지점 ~ 끝 지점

```js
const arr = ['a', 'b', 'c', 'd', 'e'];

arr.splice(-1);
console.log(arr); // ['a', 'b', 'c', 'd']
arr.splice(1, 2);
console.log(arr); // ['a', 'd']
```
- 시작 지점, 끝 지점을 지정하여 *원본 배열에서 제거*한 후, *제거된 요소를 담은 배열을 반환*한다
- `(start: number, deleteCount?: number | undefined)`
- 인자
	- 1개 : 시작 지점 ~ 마지막(고정)
	- 2개 : 시작 지점 ~ 끝 지점

### `reverse`, `concat` 메서드

```js
const arr = ['j', 'i', 'h', 'g', 'f'];

console.log(arr.reverse()); // ['f', 'g', 'h', 'i', 'j']
console.log(arr); // ['f', 'g', 'h', 'i', 'j']
```
- *원본 배열을 뒤집은 후*, 배열의 참조를 반환한다

```js
const arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
const letters = arr.concat(arr2);

console.log(letters); // ['a', 'b', 'c', 'd', 'e', 'j', 'i', 'h', 'g', 'f']
console.log(arr); // ['a', 'b', 'c', 'd', 'e']
console.log(arr2); // ['j', 'i', 'h', 'g', 'f']
```
- *앞 배열 + 뒤 배열의 모든 요소를 복사한 새로운 배열을 반환*한다

### `join` 메서드

```js
const letters = ['a', 'b', 'c', 'd', 'e', 'j', 'i', 'h', 'g', 'f'];

console.log(letters.join(" - ")); // a - b - c - d - e - j - i - h - g - f
```
- *배열의 모든 요소*를 인자로 들어온 문자열로 이은 *하나의 문자열을 반환*한다

### `at` 메서드

```js
const arr = [23, 11, 64];

// (1) 전통적인 방법
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);

// (2) at 메서드
console.log(arr.at(-1)); // 64
console.log(arr[-1]); // undefined
console.log(arr[3]); // undefined
console.log(arr.at(3)); // undefined
console.log(arr.at(-3)); // 23
console.log(arr.at(-4)); // undefined
```
- ES2022
	- `string` 타입에서도 사용 가능
- 언제 사용?
	- (1) 전통적인 방법
		- 빠르게 사용하고 싶을 때
	- (2) `at` 메서드
		- negative index를 사용할 때
		- 메서드 체이닝이 필요할 때 : 한 번에 여러 메서드를 결합할 때?

### `forEach` 메서드

- `for ... of` loop와 `forEach` loop는 본질적으로 다름

```js
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// (1) for ... of
for (const movement of movements) {
	if (movement > 0) {
		console.log(`You deposited ${movement}`);
	} else {
		console.log(`You withdrew ${Math.abs(movement)}`);
	}
}

// (2) forEach
movements.forEach(function(movement) {
	if (movement > 0) {
		console.log(`You deposited ${movement}`);
	} else {
		console.log(`You withdrew ${Math.abs(movement)}`);
	}
})

// 0: function(200)
// 1: function(450)
// 2: function(-400)
// ...
```
- `Array` 객체의 메서드
- 인자로 콜백 함수를 요구한다 => 고차 함수
	- 고차 함수에게 어떤 일을 할지 정확히 알려주기 위해 콜백 함수를 사용한다 : what to do
	- 선언형 프로그래밍
- `forEach` 메서드는 주어진 배열을 순회하면서 콜백 함수를 한 번씩 호출한다
```js
function forEach(callback) {
	for (let i = 0; i < this.length; i++) {
		callback(this[i], i, this);
	}
}
```
- 콜백 함수를 작성할 때, 인자의 이름은 상관없지만 순서는 매우 중요
	- 첫 번째 인자 : 순회할 때 현재 요소
	- 두 번째 인자 : 순회할 때 현재 인덱스 번호
	- 세 번째 인자 : 순회중인 전체 배열
- 장점
	- 사용하기 쉬움
	- 인덱스를 사용할 수 있음

```js
// for ... of loop에서 인덱스를 사용하려면...
for (const [i, movement] of movements.entries()) {
	if (movement > 0) {
		console.log(`You deposited ${movement}`);
	} else {
		console.log(`You withdrew ${Math.abs(movement)}`);
	}
}
```
- cf> `forEach` 메서드의 인자 순서와 다름에 주의
- 차이점
	- `forEach`
		- 선언형
		- `break` 키워드 사용 불가능
	- `for ... of`
		- 명령형
		- `break` 키워드 사용 가능

```js
'use strict';

// (1) regular
movements.forEach(function (movement) {
    console.log(this); // undefined
	if (movement > 0) {
		console.log(`You deposited ${movement}`);
	} else {
		console.log(`You withdrew ${Math.abs(movement)}`);
	}
});

// (2) regular + thisArg
movements.forEach(function (movement) {
    console.log(this); // [200, 450, -400, 3000, -650, -130, 70, 1300]
	if (movement > 0) {
		console.log(`You deposited ${movement}`);
	} else {
		console.log(`You withdrew ${Math.abs(movement)}`);
	}
}, movements);

// (3) arrow
movements.forEach((movement) => {
    console.log(this); // Window
	if (movement > 0) {
		console.log(`You deposited ${movement}`);
	} else {
		console.log(`You withdrew ${Math.abs(movement)}`);
	}
})

// (4) arrow + thisArg
movements.forEach((movement) => {
    console.log(this); // Window
	if (movement > 0) {
		console.log(`You deposited ${movement}`);
	} else {
		console.log(`You withdrew ${Math.abs(movement)}`);
	}
}, movements);
```
- 역시 화살표 함수로 넘기면 내부적으로 `call`, `apply`, `bind`를 한다고 해도 `this`를 변화시킬 수 없다
- (1)의 `undefined` (3), (4)의 `Window` 객체는 참조하는 방식이 다르다
	- (1) 직접 `Window` 객체를 참조 : 함수로서 호출 => `strict mode` 이기 때문에 `undefined`
	- (2) 렉시컬 스코프 상 부모의 `this`를 참조

```js
const currenciesMap = new Map([
	['USD', 'United States Dollar'],
	['EUR', 'Euro'],
	['GBP', 'Pound Sterling'],
]);
currenciesMap.forEach(function(value, key, map) {
	console.log(key, value);
});
// USD United States Dollar
// EUR Euro
// GBP Pound Sterling

const currenciesSet = new Set(['USD', 'EUR', 'GBP']);
currenciesSet.forEach(function(value, _, map) {
	console.log(key, value);
});
// USD USD
// EUR EUR
// GBP GBP
```
- `Map`과 `Set` 자료 구조에도 `forEach` 메서드가 존재한다
	- 내부 자료를 순회할 수 있게 해준다
- 다만, 첫 번째 인자와 두 번째 인자가 의미하는 것이 다르기 때문에 확인하고 사용하자

### `map` 메서드

```js
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const EURtoUSD = 1.1;

const movementsUSD = movements.map(mov => mov * EURtoUSD);
console.log(movements); // [200, 450, -400, 3000, -650, -130, 70, 1300]
console.log(movementsUSD); // [220.00000000000003, 495.00000000000006, -440.00000000000006, 3300.0000000000005, -715.0000000000001, -143, 77, 1430.0000000000002]

const constants = movements.map(mov => 23);
console.log(constants); // [23, 23, 23, 23, 23, 23, 23, 23]
```
- 배열을 순회하며 모든 요소에 콜백 함수를 적용한 결과를 새로운 배열로 반환하는 `Array` 메서드
- `filter`, `reduce` 메서드와 함께 모던 자바스크립트에서 많이 사용되는 메서드
	- 세 가지 메서드 **모두 1) 기존 배열을 순회하며 2) 특정 로직(콜백 함수를 적용)을 수행한 후 3) 결과를 리턴한다**
	- 원본 배열에 영향을 미치지 않는다
- 콜백 함수 인자
	- 첫 번째 인자 : `value`
	- 두 번째 인자 : `index`
	- 세 번째 인자 : `arr`
- vs. `for ... of`
	- 공통점 : 반복문
	- 차이점
		- `for ... of`
			- `명령형 프로그래밍` 접근 방식
			- 다양한 작업을 수행할 수 있는 유연함이 있음(순회)
			- 제어 흐름(`break`, `continue`) 제공
		- `map`
			- `함수형 프로그래밍` 접근 방식
			- 배열의 각 요소를 변환하여 새로운 배열을 생성하는데 중점을 둠(변환)
			- 제어 흐름(`break`, `continue`) 제공하지 않음
- vs. `forEach`
	- 공통점
		- 각 요소에 대해 제공된 콜백 함수를 호출하는 반복문
	- 차이점
		- `forEach`
			- 단순히 콜백 함수를 실행한 후 종료한다(새 배열을 반환하지 않는다)
				- 배열 체이닝이 불가능하다
			- *Side Effect를 수행*할 때 사용된다
				- e.g. 요소 출력, 배열 외부의 값 수정
		- `map`
			- 콜백 함수를 실행한 결과를 새 배열에 담아 반환한다
				- 배열 체이닝이 가능
			- *Side Effect가 발생하지 않는 상황*에서 사용한다
				- 함수형 프로그래밍의 기초
				- *Side Effect*가 발생하도록 작성할 수 있지만, 지양하는 것이 좋음
				- 외부 변수를 스코프 체인을 통해 접근하지 않고, 인자를 통해 함수로 전달한다
```js
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const createUsernames = function (accounts) {
	// 객체를 복사하여 변경한 후 반환하는 것이 아니기 때문에 Side Effect가 존재한다
	// forEach 사용
	accounts.forEach(function (account) {
		account.username = account.owner
			.toLowerCase()
			.split(' ')
			// full name을 인자로 받아 abbreviation을 반환하고 다른 외부 컨텍스트 변수에 접근하지 않기 때문에 Side Effect가 존재하지 않음
			// map 사용
			.map(name => name[0])
			.join('');
	});
}

createUsernames(accounts);
console.log(accounts.map(account => account.username)); // ['js', 'jd', 'stw', 'ss']
```
- 사용 예시
	- `for ... of` : 반복문 중간에 제어 흐름이 필요할 때
	- `forEach` : *Side Effect*가 발생하는 경우
	- `map` : *Side Effect*가 발생하지 않는 경우
- *Side Effect*란?
	- https://www.educative.io/answers/what-is-a-side-effect
	- https://dev.to/richytong/practical-functional-programming-in-javascript-side-effects-and-purity-1838

### `filter` 메서드

```js
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposit = movements.filter(function (mov) {
	return mov > 0;
})
const withdrawal = movements.filter(mov => mov < 0);

console.log(deposit); // [200, 450, 3000, 70, 1300]
console.log(withrawal); // [-400, -650, -130]
```
- 배열을 순회하며 모든 요소에 대해 콜백 함수를 적용한 결과가 `true` 인 요소만 새로운 배열로 반환하는 `Array` 메서드
- *cf> 콜백 함수는 반드시 `boolean` 값을 반환해야 함*
- 콜백 함수 인자
	- 첫 번째 인자 : `value`
	- 두 번째 인자 : `index`
	- 세 번째 인자 : `arr` (잘 사용하지 않음)

### `reduce` 메서드

```js
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const balance = movements.reduce(function (acc, curr, i, arr) {
	return acc + curr;
}, 0)

console.log(balance); // 3840

// 반드시 합계일 필요는 없음
const max = movements.reduce((acc, curr) => Math.max(acc, curr));

console.log(max); // 3000
```
- 배열을 순회하며 모든 요소에 대해 콜백 함수를 적용한 최종 결과만을 반환하는 `Array` 메서드
	- `reduce`의 의미대로 배열을 줄인다는 의미

```js
const numbers = [1, 2, 3, 4, 5];
const log = [];
const log2 = [];
const log3 = [];

// 초기값 존재
numbers.reduce((acc, value) => {
  log.push(acc);
  return acc + value;
}, 0);

console.log(log); // [0, 1, 3, 6, 10]

// 초기값 미존재
numbers.reduce((acc, value) => {
  log2.push(acc);
  return acc + value;
});

console.log(log2); // [1, 3, 6, 10]

// 잘못된 예제 : 예상과 다르게 number[0]이 한 번 더 더해진다
numbers.reduce((acc, value) => {
  log3.push(acc);
  return acc + value;
}, numbers[0]);

console.log(log3); // [1, 2, 4, 7, 11]
```
- `reduce`의 인자
	- 1) 콜백 함수
	- 2) `acc`의 초기값(선택)
		- 초기값이 있으면, 초기값을 처리하는 단계가 추가됨
		- 다른 말로, 배열의 첫 번째 값이 초기값이 된다고 볼 수 있음
- 콜백 함수 인자
	- 첫 번째 인자(추가) : `acc` => 지금까지 누적된 값을 제공하는 인자
	- 두 번째 인자 : `value`
	- 세 번째 인자 : `index`
	- 네 번째 인자 : `arr`

```js
// (1)
const numbers = [1, 2, 3, 4, 5];
const result = numbers.reduce((acc, curr) => [...acc, curr], []);

result.push(100);
console.log(numbers); // [1, 2, 3, 4, 5]
console.log(result); // [1, 2, 3, 4, 5, 100]

// (2)
const ref = [];
const result2 = numbers.reduce((acc, curr) => [...acc, curr], ref);

result2.push(100);
console.log(ref); // []
console.log(result2); // [1, 2, 3, 4, 5, 100]
```
- `map`, `filter` 와 다르게 반드시 배열을 반환하는 것이 아니다
	- 콜백 함수에 따라 어떠한 데이터 타입으로도 반환이 가능하다
- `map`, `filter`와 마찬가지로 불변성 메서드이다
	- 초기 값으로 참조형 데이터 타입이 전달되어도 반환되는 값의 참조는 바뀐다
	- 참조형 데이터 타입 변수로 넘기더라도 반환하는 값은 deep copy가 적용됨

### Project : Bankist App

#### CSS와 보안
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      #account {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="account">
      <div>1. 1000</div>
      <div>2. -1000</div>
      <div>3. 1000</div>
      <div>4. 100</div>
    </div>
  </body>
</html>
```
- CSS를 통해 화면에서 보이지 않게 하는 방법은 어떠한 방법을 사용하더라도, 개발자 도구 `Elements` 탭의 태그를 사라지게 하지 않는다
- 즉, 단순히 시각적으로만 효과가 있는 것이다
- 방법
	- `opacity: 0`
		- 요소를 투명하게 만듦. 차지하던 공간도 그대로. 이벤트도 여전히 발생
	- `display: none`
		- 요소를 화면에서 완전히 제거. 차지하던 공간도 제거
	- `visibility: hidden`
		- 요소를 보이지 않게 함. 차지하던 공간은 그대로 놔둠
- 보안 상 값을 노출하면 안 되는 경우에는 CSS를 제어하는 것 만으로는 부족하다
- why? 해당 엘리먼트가 여전히 DOM에 존재하기 때문이다
	- 브라우저에 직접 확인이 가능하고
	- 자바스크립트 코드를 통해서도 접근, 조작 및 이벤트 처리가 가능
- 대안
	- 자바스크립트를 이용하여 직접 제어한다
```js
const account = document.querySelector("#account");

account.innerHTML = '';
```

#### DOM API : `insertAdjacentHTML`

```js
const account = document.querySelector("#account");

let html = "<div>0. 3000</div>";
account.insertAdjacentHTML('afterbegin', html);

html = "<div>5. -3000</div>";
html += "<div>6. -1000</div>";
account.insertAdjacentHTML('beforeend', html);
```
- 지정한 DOM 엘리먼트 *주변에* 엘리먼트를 추가하는 DOM API
- 첫 번째 인자에 따라, 현재 자식 엘리먼트 앞에 또는 뒤에 추가할 수 있다
	- 편하게 위치를 지정할 수 있다
	- 선언적, 직관적이다
- https://developer.mozilla.org/ko/docs/Web/API/Element/insertAdjacentHTML

#### 