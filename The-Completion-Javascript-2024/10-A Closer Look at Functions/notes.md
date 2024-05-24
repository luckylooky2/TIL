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