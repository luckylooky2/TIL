### 컴파일 언어와 인터프리터 언어

- 컴파일 언어

  - 기계어 변환 시점 : 기계어 변환이 "런타임 이전"에 이루어짐
  - 실행 파일 : 생성
  - 런타임 실행 속도 : 빠름. 런타임에 기계어 변환을 하지 않기 때문에
  - 같은 코드 실행 : 빠름. 기계어 변환이 이미 되어있기 때문에 기계어 변환이  중복되지 않음
  - 동적 타이핑 지원 : 보통 지원하지 않음. 코드 작성이 상대적으로 복잡하나 안정성임

- 인터프리터 언어

  - 기계어 변환 시점 : 기계어 변환이 "런타임"에 이루어짐
    - line by line 이라는 표현은 애매한 듯 => on demand(필요에 따라) 코드를 해석하고 실행한다
  - 실행 파일 : 미생성
  - 런타임 실행 속도 : 느림. 런타임에 기계어 변환을 하기 때문에
  - 같은 코드 실행 : 느림. 런타임에 기계어 변환이 이루어지기 때문에 같은 코드에 대해 기계어 변환이 중복
  - 동적 타이핑 지원 : 보통 지원. 변수 타입을 명시하지 않아도 되기 때문에 코드 작성이 간결하나 덜 안정적임

  - 추가로, 에러가 발생한 코드 다음부터는 코드를 실행하지 않음

- JIT 컴파일러

  - 인터프리터 언어의 실행 속도를 개선하기 위해서 개발된 기술
  - Java와 Javascript에서 도입
  - 기본적으로는 코드를 인터프리터로 해석
  - 프로그램 실행 중, "자주 사용되는 코드"를 기계어로 컴파일하여 성능을 개선(같은 코드 실행 속도 해결)
    - cf> 강의에서 이야기한 모든 코드를 한 번에 기계어로 변환한다는 것은 틀린 말인가?
    - 강의 : 코드를 기계어로 변환(컴파일) => 실행 => 실행한 것을 바탕으로 최적화 => 새로 컴파일 => 실행 ...
  - 정확한 로직은 실제 소스 코드를 까봐야 알 듯

- Reference

  - https://modulabs.co.kr/blog/interpreter-and-compiler/
  - https://stackoverflow.com/questions/45620041/how-does-hoisting-work-if-javascript-is-an-interpreted-language
  - https://stackoverflow.com/questions/3265357/compiled-vs-interpreted-languages

### Execution Context와 Block-level Scope

- 디버거에서 어떻게 구성되어 있나?

### 전역 스코프에서 `var` 로 선언을 하면 `window` 객체에 프로퍼티로 추가되는 이유?
- `let`, `const`는 `window` 객체에 프로퍼티로서 추가되지 않는다
- `strict mode`에서도 마찬가지인가? (Yes)
- `window.variableName`은 전역 변수라고 할 수 있다. 전역 스코프에서 `var`로 선언하는 것은 전역 변수로 사용하겠다는 뜻이다. 반면, 전역 스코프에서 `let`, `const`로 선언하는 것은 전역 스코프임에도 전역 변수로 사용하지 않음을 뜻한다.
- 1) 전역 변수를 사용하는 것은 권장되지 않고 2) 함수 스코프인 `var`을 사용하는 것 또한 권장되지 않기 때문에 이러한 특징이 중요하지 않아진 것 같다
	- 굳이 이런 특징을 사용하는 상황이 없을 것이라고 생각한다
- https://stackoverflow.com/questions/11148997/window-variablename
```js
"use strict";

var x = 1;
const y = 2;
let z = 3;

console.log(x === window.x); // true
console.log(y === window.y); // false
console.log(z === window.z); // false

// x, y, z를 직접 사용하는 것은 식별자 중복 선언으로 전역 변수에 직접 접근하지 못할 수도 있다
// 대신 window.x 처럼 접근할 수 있는 방법이 있다
(function test() {
  console.log(x); // 1
  console.log(y); // 2
  console.log(z); // 3
  console.log(window.x); // 1
  console.log(window.y); // undefined
  console.log(window.z); // undefined
})();
```


### Execution Context의 `this` binding

- `this` 는 Execution Context 내에 결정되고 연결된다는 점에서 함수가 실행될 때(즉, `environmentRecord`가 생성되고 `outerEnvironmentRecord`가 연결되는 시점)에 똑같이 생성된다.
- 단, Scope Chain과 Lexical Scope와 같이 선언된 위치에 따라 결정되는 것이 아니라, "호출되는 방법"에 따라 Execution Context 내의 `this` 에 바인딩된다
- Execution Context의 구성 요소
	- `environmentRecord`, `outerEnvironmentRecord`
		- Execution Context이 생성될 때, 위치에 의해 결정
	- `this`
		- Execution Context이 생성될 때, 함수의 호출 방법에 의해 결정

- `this` : 함수로서 호출
	- 기본적으로 window 또는 전역 객체가 할당(바인딩)된다고 알고 있다
	- 하지만 `strict mode` 일 때는 `undefined`가 할당된다
	- 기본적으로 알고 있던 내용은 `strict mode`가 아닐 때가 기준임을 기억하자!

```js
'use strict'

console.log(this); // Window

const add = function (x, y) {
	console.log(this); // undefined
	return x + y;
}

const addArrow = (x, y) => {
	console.log(this); // Window(lexical this)
	return x + y;
}
```

### Arrow Function 사용 예시

```jsx
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
  <script
    src="https://unpkg.com/react@18/umd/react.development.js"
    crossorigin
  ></script>
  <script
    src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"
    crossorigin
  ></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="text/babel">
    var isStrict = (function () {
      return !this;
    })();

    console.log(isStrict); // true
    
    class Test extends React.Component {
      constructor(props) {
        super(props);
        // 1. state 초기화
        this.state = { isValid: false };
      }

      setValid = () => {
        console.log(this);
        // 2. state 변경
        this.setState({ isValid: !this.state.isValid });
      };

      render() {
        return (
          <>
            <button onClick={this.setValid}>click</button>
            <div>{this.state.isValid ? "valid" : "invalid"} </div>
          </>
        );
      }
    }

    const domContainer = document.querySelector("#root");
    const root = ReactDOM.createRoot(domContainer);
    root.render(<Test />);
  </script>
</html>
```
- 컴포넌트 인스턴스로 생성되는 클래스 컴포넌트는 상태값을 `state`프로퍼티에 저장하고 관리한다
- 상태값은 생성자`constructor`에서 초기화하고, 클래스 컴포넌트의 `setState`프로퍼티를 이용하여 상태값을 변경한다.
- 다시 말해서, 클래스 컴포넌트에서는 상태값을 이용할 때, 위와 같이 `this.state`에 접근하거나 `this.setState`를 이용하여 변경한다.
- 콜백 함수 내부에서 상태값을 이용하려고 할 때, `this` 바인딩을 주의해야 한다.
	- 콜백 함수를 Regular Function으로 선언할 경우, 콜백 함수가 호출될 때 내부의 `this`가 컴포넌트 인스턴스를 가리키지 않는다. 함수로서 호출하기 때문이다.
		- strict mode 이기 때문에 `undefined`가 출력된다
	- 반면, 콜백 함수를 Arrow Function으로 선언할 경우, 콜백 함수가 호출될 때 함수로서 호출이 되든 메서드로서 호출이 되든 상관없이 `lexical this`로 고정된다. _즉, 콜백 함수가 어느 위치에 선언되었는지가 중요해진다._
	- 현재, 콜백 함수`setValid`는 클래스 컴포넌트 내에 Arrow Function 및 프로퍼티로 선언되었으므로, `setValid`의 바로 상위 렉시컬 스코프에 위치한 `Test`컴포넌트를 가리키게 된다.

### Object literal vs. Constructor(w/ Arrow function)

```js
// 1)
const person = {
  name: "chanhyle",
  grade: "member",
  sayHello: () => {
	console.log("hello");
	console.log(this); // window
  },
};

person.sayHello();
```

```js
// 2)
const person = function () {
  this.name = "chanhyle";
  this.grade = "member";
  this.sayHello = () => {
	console.log("hello");
	console.log(this); // person
  };
};

const p1 = new person();
p1.sayHello();
```
- Arrow function을 기준으로 설명한다
- 같은 Arrow function임에도 `this` 바인딩에 차이가 발생하는 이유는?
	- *선언된 곳이 다르기 때문이다*
- Regular function과 다르게, Arrow function은 "선언된 곳"만을 기준으로 `this`가 결정된다
	- 따라서 선언된 곳이 어디인지를 분명하게 아는 것이 중요하다
- 1) 객체 리터럴은 스코프를 생성하지 않는다
	- 즉, 선언한 객체나 함수는 전역 스코프이다
```js
// 1-1)
const func = () => {
	console.log("hello");
	console.log(this); // window
};

const person = {
  name: "chanhyle",
  grade: "member",
  sayHello: func
};

person.sayHello();
```
- 즉, 1)은 1-1)과 같다
- 이렇게 놓고 보면, `func` 내의 `this`는 전역 스코프의 `this`인 `window`를 바인딩한 것이라고 볼 수 있다.
- 다시 말해서, `func`는 `person`의 상위 스코프가 아니다
	- person 자체가 스코프가 아니다!
	- `func`와 관련된 함수 호출이 어디에도 없다(스코프는 함수 호출을 전제로 한다)

- 2) 반면, 생성자는 스코프를 생성한다
	- `sayHello`에 할당된 함수 객체는 스코프 체인(`person` 스코프 -> 전역 스코프) 상의 `person` 스코프에 위치한다
```js
// 2-1)
const person = function () {
  const func = () => {
	console.log("hello");
	console.log(this); // person
  };
  
  this.name = "chanhyle";
  this.grade = "member";
  this.sayHello = func;
};

const p1 = new person();
p1.sayHello();
```
- 2)는 2-1)과 같다
- `func`는 스코프 체인에서 가장 먼저나오는 `person` 스코프의 `thisBinding`에 바인딩한다
- `person`생성자가 호출되고 종료되는 시점에, `func`함수는 `person`의 실행 컨텍스트를 기억하고 있다(클로저)
- 따라서, `func`(`sayHello`)가 실제로 호출될 때 현재 실행 컨텍스트`sayHello`에 연결된 `person`실행 컨텍스트(클로저)를 먼저 참조하고, 해당 실행 컨텍스트 `thisBinding`, `p1` 객체를 바인딩한다
- 실제로 `func`등 함수가 `person` 스코프(실행 컨텍스트)를 어떻게 접근하는지와는 상관없이, 스코프 내부에 선언이 되어 있으면 "콜 스택"의 현재 상태와는 상관없이 접근이 가능하다고 생각하는 것이 편하다
	- 확실한 스코프가 있으면 Arrow function의 `this`는 해당 스코프를 참조하자

```js
// 2-2)
const func = () => {
	console.log("hello");
	console.log(this); // window
  };
  
const person = function () {
  this.name = "chanhyle";
  this.grade = "member";
  this.sayHello = func;
};

const p1 = new person();
p1.sayHello();
```
- 2-2)는 상황이 다르다
- `func`는 스코프 체인(`person` 스코프 -> 전역 스코프) 상의 전역 스코프에 위치한다
	- 1-1)과 같은 상황이라고 할 수 있다
- `person`생성자가 호출되는 동안에도 `func`는 아무런 클로저도 생성하지 못한다
- 따라서, `sayHello` 실행 컨텍스트에 접근하는 동안에도 `person`실행 컨텍스트에는 접근하지 않고, 할 수도 없다