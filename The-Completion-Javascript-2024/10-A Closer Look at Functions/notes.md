### Default Parameters

```js
const bookings = [];

const createBooking = function(
	flightNum,
	numPassengers = 1,
	price = 199 * numPassengers
) {
	// ES5
	// numPassengers = numPassengers || 1;
	// price = price || 199;

	const booking = {
		flightNum,
		numPassengers,
		price,
	}
	console.log(booking);
	bookings.push(booking);
}

createBooking('LH123'); // {flightNum: 'LH123', numPassengers: 1, price: 199}
createBooking('LH123', 2, 800); // {flightNum: 'LH123', numPassengers: 2, price: 800}
createBooking('LH123', 2); // {flightNum: 'LH123', numPassengers: 2, price: 398}
createBooking('LH123', 5); // {flightNum: 'LH123', numPassengers: 5, price: 995}

// 사용하지 않는 parameter는 비워두면 안 되고, undefined를 할당해야 정상적으로 동작
createBooking('KS123', ,700); // Uncaught SyntaxError: Unexpected token ','
createBooking('KS123', undefined ,700); // {flightNum: 'KS123', numPassengers: 1, price: 700}
```
- ES6에서 Default Parameter가 추가되어 깔끔하게 처리할 수 있음
- 직접 명시하지 않은 Parameter는 `undefined`로 할당이 되는데, Default Parameter는 명시되지 않는 Parameter를 자동으로 할당하는 기능
- `price`에서 `numPassengers`를 사용할 수 있는 이유는 먼저 선언이 되었기 때문
	- 역으로 `numPassengers`에서 `price`를 사용할 수는 없음
- 사용하지 않는 parameter는 비워두면 안 되고, `undefined`를 할당해야 정상적으로 동작
	- Destructuring과는 다르게 동작,,,
	- 비슷한 맥락에서 Default Parameters를 명시하지 않고 사용하기 위해서는 일반 Parameter 이전에 오면 안 됨

### Passing Arguments by Value or Reference

```js
const flight = 'LH234';
const jonas = {
	name: 'Jonas schmedtmann',
	passport: 2389562938,
}

const checkIn = function (flightNum, passenger) {
	// "primitive 데이터 타입"은 함수 내부에서 값을 복사
	// 외부의 flight 변수에 영향을 미치지 않음
	flightNum = 'LH999';
	// 반면, Object / Array와 같은 "reference 데이터 타입"은 참조를 복사
	// 그렇기 때문에 외부의 jonas 변수에 접근할 수 있고, 영향을 미칠 수 있음
	passenger.name = 'Mr. ' + passenger.name;

	if (passenger.passport !== 2389562938) {
		alert("Wrong passport");
	}
}

checkIn(flight, jonas);
console.log(flight, jonas); // LH234 {name: 'Mr. Jonas schmedtmann', passport: 2389562938}
```
- 다른 사람들과 협업할 때, 이러한 동작에 주의해야 한다
- javascript에서는 Passing by Value
	- C++처럼 명시적으로 Reference를 넘기는 방법은 없고, 모든 변수를 단순히 넘기는 Passing by Value이다
	- 하지만 내부적으로 "primitive"과 "reference" 데이터 타입의 동작 방식이 다르다
		- primitive : 값 자체를 복사하기 때문에 원본 변수에 영향이 없다
		- reference : 참조(메모리 주소)를 복사하기 때문에 원본 변수에 영향을 미친다
- https://stackoverflow.com/questions/518000/is-javascript-a-pass-by-reference-or-pass-by-value-language

```js
function changeObject(x) {
  x = { member: "bar" };
  console.log("in changeObject: " + x.member);
}

function changeMember(x) {
  x.member = "bar";
  console.log("in changeMember: " + x.member);
}

let x = { member: "foo" };

console.log("before changeObject: " + x.member);
changeObject(x);
console.log("after changeObject: " + x.member); /* change did not persist */

console.log("before changeMember: " + x.member);
changeMember(x);
console.log("after changeMember: " + x.member); /* change persists */
```
- 두 함수 모두 reference로서가 아니라 value로서 전달하기 때문에, 첫 번째 함수 이후 `x`의 값이 변하지 않았다
- reference로서 전달했다면, `x`의 값이 첫 번째 함수 내부에서 변경되어야 했을 것이다

### First Class Functions, Higher Order Functions

- 일급 함수(First Class Functions)와 고차 함수(Higher Order Functions)의 관계?
	- *일급 함수가 있기 때문에 고차 함수를 만들고, 사용(write, use)할 수 있다*
- 비교
	- 일급 함수 : 언어적 특징, practice가 아니라 concept
	- 고차 함수 : 일급 함수의 practice

```js
const add = (a, b) => a + b;
const counter = {
	value: 23,
	inc: function () {
		this.value++;
	}
}

const greet = () => console.log('Hey Jonas');
btnClose.addEventListener('click', greet);

counter.inc.bind();
```
- 일급 함수
	- 자바스크립트에서 함수는 또 다른 `Object` 타입이다
	- `Object`는 값이기 때문에, 함수 또한 값이다
	- 그렇기 때문에, ***1) 변수에 저장하거나, 2) Object 프로퍼티로 값으로 저장할 수 있다***
	- 또한 ***3) 함수에 인자로 넘겨줄 수 있다***
	- ***4) 함수에서 함수를 반환할 수 있다***
	- ***5) 함수 내부에 프로퍼티와 메서드를 가질 수 있다(Object 이기 때문에) : `name` 프로퍼티***

```js
const greet = () => console.log('Hey Jonas');
btnClose.addEventListener('click', greet);

// higher order function : addEventListener
// callback function : greet

function count() {
	let counter = 0;
	return function () {
		counter++;
	}
}

// higher order function : count
// returned function : function() { counter++; }
```
- 고차 함수
	- *함수를 인자로 받는 함수 또는 함수를 반환하는 함수*
	- 일급 함수이기 때문에 가능한 개념이다

```js
// 고차 함수
// 1) 함수를 인자(콜백 함수)로 받는 함수
const oneWord = function (str) {
	return str.replace(/ /g, '').toLowerCase();
};

const upperFirstWord = function (str) {
	const [first, ...others] = str.split(' ');
	return [first.toUpperCase(), ...others].join(' ');
};

// higher order function
const transformer = function (str, fn) {
	console.log(`Original string: ${str}`);
	console.log(`Transformed string: ${fn(str)}`);

	console.log(`Transformed by: ${fn.name}`);
}

transformer('JavaScript is the best!', upperFirstWord);
transformer('JavaScript is the best!', oneWord);

const high5 = function () {
	console.log('👋');
}

[1, 2, 3].forEach(high5);
```
- 콜백 함수로 전달하는 것(고차 함수)은 자바스크립트에서 매우 일상적인 패턴이다
- 장점? (객체 지향적 설계가 가능)
	- 1) 코드를 분리하고 쉽고, 재사용하기 좋음
	- 2) 추상화를 가능하게 함
		- 추상화 : 자세한 코드 구현 사항을 나타내지 않고 숨기는 방식
		- 즉, 고차 함수는 구체적인 로직에는 관심이 없음(저차 함수에 구현을 위임)
		- 문제를 조금 더 높은 단계, 추상적인 단계에서 생각할 수 있게 함

```js
// 2) 함수를 반환하는 함수
```