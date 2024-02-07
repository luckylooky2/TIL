### `this`
- **"함수를 호출한 주체에 대한 정보가 담긴다"**
- 함수와 객체(메서드)의 구분이 느슨한 자바스크립트에서, `this`는 실질적으로 함수와 객체(메서드)를 구분하는 거의 유일한 기능
	- `this`가 전역 객체인가? 특정 객체인가를 확인할 수 있기 때문이다
	- 실제로 함수와 객체(메서드)를 구분할 일이 있을까는 싶다
- `this`는 기본적으로 실행 컨텍스트가 생성될 때, 함께 결정된다 : `ThisBinding`
	- 즉, 실행 컨텍스트는 함수가 호출될 때 생성되므로, *`this`는 함수를 호출할 때 결정된다고 말할 수 있다*
		- 동적으로 결정된다
		- (= 함수를 어떤 방식으로 호출하느냐에 따라 달라진다)
	- `outerEnvironmentReference`도 함수가 호출될 때 생성 및 결정되는 것 아닌가?
		- 호출될 때 생성되는 것은 맞지만, 결정되지는 않는다
		- 함수가 선언되어 있는 실행 컨텍스트에 대한 참조로 이미 결정되어 있기 때문에, 호출되는 시점에 동적으로 결정되지는 않는다

### 함수로서 호출 vs 메서드로서 호출
- 동일한 함수여도 어떤 방법으로 호출하는가에 따라 `this`의 값이 다르게 바인딩된다
```js
  var func = function (x) {
    console.log(this, x);
  };

  // 함수로서 호출
  func(1); // global, 1

  var obj = {
    method: func,
  };

  // 메서드로서 호출
  obj.method(2); // obj, 2
```
- 함수로서 호출
	- 전역 객체에 `this`가 바인딩된다
	- 함수 단독으로 호출
- 메서드로서 호출
	- 메서드 앞의 객체에 `this`가 바인딩된다
	- 점(`.`) 및 대괄호(`[]`)과 함께 호출

```js
  var obj1 = {
    outer: function () {
      console.log(this); // obj1
      var innerFunc = function () {
        console.log(this);
      };
      innerFunc(); // global

      var obj2 = {
        innerMethod: innerFunc,
      };
      obj2.innerMethod(); // obj2
    },
  };

  obj1.outer();
```
- `this` 바인딩에 관해서는 함수를 실행하는 당시의 주변 환경(메서드 내부인지, 함수 내부인지)은 중요하지 않고, 오직 해당 함수를 호출하는 구문 앞에 있는 객체가 있는지 없는지가 관건이다

### 내부 함수에 `this` 전달하기
- 바로 위 예제에서 `outer` 내부의 `this`는 `obj1`이다
- 하지만 함수로서 호출한 `innerFunc` 내부에서의 `this`는 전역 객체이다
- 이 때, `innerFunc`에 `outer` 의 `this`인 `obj1`을 전달하는 방법을 알아보자
#### 1. `self(that)`
```js
  var obj1 = {
    outer: function () {
      console.log(this); // obj1
      var innerFunc1 = function () {
        console.log(this);
      };
      innerFunc1(); // global

      var self = this;
      var innerFunc2 = function () {
        console.log(self);
      };
      innerFunc2(); // obj1
    },
  };

  obj1.outer();
```
- ES5에서 사용하는 방법
- `innerFunc2`가 `outer`의 컨텍스트에 접근할 수 있기 때문에 이를 이용하여 `self(that)` 변수를 생성
- `innerFunc2`는 외부 컨텍스트에 접근하여 `this`를 간접적으로 사용
- `this.outer.innerFunc2()`?
	- `TypeError: this.outer.innerFunc2 is not a function`
	- `this`(obj1)을 이용해서는 실행하지 못함
#### 2. 화살표 함수
```js
  var obj1 = {
    outer: function () {
      console.log(this); // obj1
      var innerFunc1 = function () {
        console.log(this);
      };
      innerFunc1(); // global

      var innerFunc2 = () => {
        console.log(this);
      };
      innerFunc2(); // obj1
    },
  };

  obj1.outer();
```
- ES6에서 추가된 화살표 함수(arrow function)
- 화살표 함수는 함수가 실행되며 실행 컨텍스트가 생성될 때, `ThisBinding`을 설정하는 바인딩 과정을 생략한다
	- 즉, `this`에 바인딩되는 객체가 없다는 뜻이다
	- 그렇다면 `this`를 어떻게 결정하는가?
	- 화살표 함수가 선언된 주변 환경(렉시컬 스코프)에서 `this`를 찾고, 존재하지 않으면 스코프 체인을 따라 `this`를 검색한다
- 여기서는 `innerFunc2`가 선언된 위치 `outer` 컨텍스트의 현재 `this`인 `obj1`을 참조한다
	- 즉, `innerFunc2`의 내부에서 `this`는 `obj1`이 된다
	- 이렇게 `this`를 전달(또는 고정)할 수 있다
- `innerFunc2`를 어떤 방식으로 호출해도 `this` 바인딩이 되지 않았기 때문에, 항상 고정적으로 렉시컬 스코프에 따라 상위 컨텍스트의 `this`를 검색한다
- 이렇게 화살표 함수를 사용하여 `this`를 바인딩하지 않고 렉시컬 스코프에서 찾은 `this`를 `lexical this`라고 표현한다
#### 3. `call`, `apply`, `bind`
```js
  var obj1 = {
    outer: function () {
      console.log(this); // obj1
      var innerFunc1 = function () {
        console.log(this);
      };
      innerFunc1(); // global

      var innerFunc2 = () => {
        console.log(this);
      };
      innerFunc2().call(this); // obj1
    },
  };
```
- `this`를 변경하는 대표적인 메서드인 `call`, `apply`, `bind`를 이용한다
- 해당 메서드들을 이용하면 동적으로 `this`를 교체할 수 있다
- `call`, `apply` : 함수를 즉시 실행한다
- `bind` : `this`가 바인딩된 함수를 반환함으로써 함수를 즉시 실행하지 않는다

### 콜백 함수에 `this` 전달하기
- 콜백 함수 내부에서의 this는 원칙적으로 확신할 수 없다
	- 라이브러리의 내부 코드를 모르는 경우, 콜백 함수를 인자로 가져가는 함수가 콜백 함수를 어떻게 실행하는지 알지 못하기 때문이다
	- 내부 코드를 직접 작성하는 경우에도, `this`를 계속 유지해야 하는 상황이면 어떻게 `this`가 상황에 따라 변하는지 추적, 관리해야 하는 어려움이 발생한다
- 이렇게 콜백 함수를 어떻게 실행할지 모르는 상황에서는 `this`가 특정 객체를 가리킨다고 명시 되어 있다면 `this`를 사용할 수는 있을 것 같다
- 전달한 콜백 함수를 호출하는 방법은 두 가지이다
	- 함수로서 호출하기 : 전역 객체에 바인딩된다
	- ~~메서드로서 호출하기~~ : 점 또는 대괄호로 호출할 수 없다
	- `call`, `apply`, `bind`로 호출하기 : 인자로 넘긴 객체가 `this`로 바인딩된다
- 전달한 콜백 함수의 종류에 따라서도 `this` 바인딩이 바뀐다
	- 일반 함수 : 바로 위에서 말한 두 가지 방법으로 `this`가 바인딩된다
	- 화살표 함수 : `this` 자체가 바인딩되지 않기 때문에, `lexical this`를 검색하여 설정된다. 다시 말해서 호출하는 방법에 의존하지 않는다
```js
  console.log(this); // global
  const myElement = {
    myAddEventListener: function (eventName, callback) {
      // myAddEventListener가 점으로 호출되었으므로 myElement가 this이다
      console.log(this); // myElement
      const e = 1;
      callback(e);
    },
  };

  // bind와 같은 함수를 호출하지 않는다면(메서드로서 호출 불가)
  // this는 전역 객체에 바인딩될 수 밖에 없다
  myElement.myAddEventListener("click", function (e) {
    console.log(this, e); // global, 1
  });

  myElement.myAddEventListener("click", (e) => {
    console.log(this, e); // global, 1
  });
```
- 함수로서 호출하는 경우
	- 콜백 함수가 일반 함수인 경우 : `callback`을 함수로서 호출하기 때문에 `this`는 항상 전역 객체이다
	- 콜백 함수가 화살표 함수인 경우 : 화살표 함수가 선언된 렉시컬 스코프는 전역 컨텍스트이다. `callback`은 해당 컨텍스트의 `this`인 전역 객체를 상속받는다

```js
  console.log(this); // global
  const myElement = {
    myAddEventListener: function (eventName, callback) {
      console.log(this); // myElement
      const e = 1;
      // 실제로 addEventListener 내에서 bind와 같이 this를 변경하는 함수를 호출하지는 않겠지만, this를 설정하는 과정이 존재한다
      callback.bind(this)(e);
    },
  };

  // 일반 함수를 콜백 함수를 넘기면, this 바인딩을 허용한다
  myElement.myAddEventListener("click", function (e) {
    console.log(this, e); // myElement, 1
  });

  // 화살표 함수를 콜백 함수로 넘기면, 함수를 호출할 때 this가 결정되는 것이 아니라
  // 현재 콜백 함수가 선언되어 있는 스코프에서 스코프 체인을 올라가며 가장 가까운 (lexical) this를 찾는다
  // 즉, this가 고정된다고 볼 수 있다
  myElement.myAddEventListener("click", (e) => {
    // 여기서 콜백 함수는 전역에서 선언되었고, 전역 스코프의 this를 상속받는다
    console.log(this, e); // global, 1
  });
```
- `call`, `apply`, `bind`로 호출하기
	- 콜백 함수가 일반 함수인 경우 : `myAddEventListener`의 `this` 인 `myElement`를 `callback`의 `this`로 바인딩한다
	- 콜백 함수가 화살표 함수인 경우 : 화살표 함수가 선언된 렉시컬 스코프는 전역 컨텍스트이다. `callback`은 해당 컨텍스트의 `this`인 전역 객체를 상속받는다
- 콜백 함수를 넘기는 경우에도 원칙적으로 `this` 바인딩 과정은 같다
	- 콜백 함수가 화살표 함수라면?
		- `this` 바인딩 과정이 일어나지 않기 때문에 `this`를 변경할 수 없다
	- 콜백 함수가 일반 함수라면?
		- 점 또는 대괄호로 함수 호출 : 콜백 함수만을 호출한다는 가정 하에, 이 방법은 불가능하고 `this`가 바뀔 수 없다
		- `call`, `bind`, `apply` : `this`를 변경할 수 있다

```js
  console.log(this); // global
  const myElement = {
    myAddEventListener: function (eventName, callback) {
      console.log(this); // myElement
      const e = 1;
      // 다시 bind를 해도 this는 변하지 않는다
      callback.bind({ type: "div" })(e);
    },
  };

  myElement.myAddEventListener(
    "click",
    function (e) {
      console.log(this, e); // myElement, 1
    }.bind(myElement)
  );

  myElement.myAddEventListener("click", (e) => {
    console.log(this, e); // global, 1
  });
```
- 미리 `bind`를 적용하여 넘기는 방법
	- 콜백 함수를 넘길 때, `bind`를 미리 하면 화살표 함수로 선언하는 것과 비슷한 효과를 낼 수 있다
- `bind` 메서드로 함수를 한 번 바인딩하면 해당 함수의 `this` 값은 영구적으로 고정된다. 한 번 `bind`된 함수는 다시 `bind`하여 `this` 값을 변경할 수 없다
	- `myAddEventListener` 내부에서 `callback.bind()`를 다시 호출해도 `this`는 변하지 않는다

### React class component에서 화살표 함수를 사용하는 이유
```jsx
  // (1) this binding
  class Counter extends React.Component {
      constructor(props) {
        super(props);
        this.state = { count: 0 };
        this.handleClick = this.handleClick.bind(this);
      }

      handleClick(e) {
        this.setState({ count: ++this.state.count });
      }

      render() {
        return (
          <div>
            <h1>Count : {this.state.count}</h1>
            <button onClick={this.handleClick}>increment</button>
          </div>
        );
      }
    }
```

```jsx
  // (2) arrow function
  class Counter extends React.Component {
      constructor(props) {
        super(props);
        this.state = { count: 0 };
      }

      handleClick = (e) => {
        this.setState({ count: ++this.state.count });
      };

      render() {
        return (
          <div>
            <h1>Count : {this.state.count}</h1>
            <button onClick={this.handleClick}>increment</button>
          </div>
        );
      }
    }
```
- 버튼을 누르면 `count`라는 상태값이 1씩 올라가는 컴포넌트
- 문제는 `Counter` 클래스 안에 선언된 `handleClick`이라는 함수가 어딘가의 콜백 함수로 전달된다는 것이다
	- 클래스 내부에서 사용해도 `this`를 관리하기가 어려운데, 콜백 함수로 사용될 때에는 `this`가 어떻게 될 지 장담할 수 없다
	- 그리고 여기서 `this`는 `Counter` 클래스의 인스턴스를 가리켜야 하는 상황이다. `handleClick`은 `state.count` 멤버 변수에 접근해 값을 증가시켜야 한다
- 이 상황에서 `handleClick` 내부의 `this`를 현재 인스턴스로 고정하는 방법은 두 가지가 있다
	1. 콜백 함수로 사용될 함수에 *미리 `this`를 바인딩하는 것*이다
	2. 콜백 함수로 사용될 함수를 *화살표 함수로 만든다*. `this`가 바인딩되지 않고, 콜백 함수가 선언된 렉시컬 스코프의 `this`를 그대로 상속받는다
- 두 경우 방법은 다르지만 같은 효과를 얻을 수 있다
	- 두 방법 중에서 화살표 함수를 사용하는 것이 조금 더 간단한 것 같다
- React class component에서 화살표 함수를 사용해야 했던 이유는
	- 클래스 문법에서 `this`는 인스턴스를 가리키는데, 콜백 함수로 넘기는 함수는 `this`가 인스턴스를 가리키지 않는 경우가 발생할 수 있다
	- 해당 콜백 함수에서 상태값을 변경하기 위해서는 `this`를 인스턴스로 가리키게 고정해야 하는데, 이를 화살표 함수를 쓰면 더 편하게 변경할 수 있다
	- 콜백 함수 말고도 내부에서 다른 멤버 함수를 선언해야 할 때, 필요하다면 화살표 함수로 `this`를 변경 및 고정하는 과정이 필요할 것 같다
- 만약 두 번째 예제에서 `handleClick`을 화살표 대신 일반 함수로 만들었다면, `this`에 예상과는 다른 객체가 할당될 가능성이 있다
	- 예제에서는 버튼을 눌렀을 때는 `Uncaught TypeError: Cannot read properties of undefined (reading 'setState')` 
	- `this`에 `setState`라는 프로퍼티가 없다고 출력되면서 에러가 발생한다
	- 즉, `this`에 예상하던 `Counter` 클래스 인스턴스가 담긴 것이 아니라 다른 객체(e.g. 전역 객체 혹은 `addEventListener` 내부에서 바인딩한 다른 객체)가 할당되어 있다
	- 예제에서 일반 함수로 만든 콜백 함수에는  `this`에 `undefined`가 할당되어 있다
		- why?

### Array-like Object에서 `call`, `apply`, `bind` 사용하기
#### 배열 메서드 적용하기
```js
  const arr = [ "a" ];
  
  const arrayLike = {
    0: "a",
    length: 1,
  };
```
- 유사 배열 객체란
	- 
```js
arr.push("b");
console.log(arr); // [ "a", "b" ]

Array.prototype.push.call(arrayLike, "b");
console.log(arrayLike); // { '0': 'a', '1': 'b', length: 2 }

const arrayLikeToArray = Array.prototype.slice.call(arrayLike);
console.log(arrayLikeToArray); // [ 'a', 'b' ]
```
- 배열 메서드는 배열에만 사용할 수 있지만, 유사 배열 객체에도 사용할 수 있는 방법이 존재
	- `Array.prototype`에 접근하여 해당 메서드를 선택하고
	- `call`, `apply`, `bind`를 호출하여 `this`를 유사 배열 객체로 바꿔주는 방법
	- 어떤 원리로? 배열 메서드를 적용한다고 하더라도 추가 또는 다른 메서드가 제대로 동작하는 이유는?
- 함수를 호출하면 접근할 수 있는 `arguments` 객체도 유사 배열 객체이다
```js
  const str = "hello";

  // TypeError: Cannot assign to read only property 'length' of object '[object String]'
  Array.prototype.push.call(str, "world");

  const newStr = Array.prototype.map.call(str, (v, i) => v + i);
  console.log(newStr); // [ 'h0', 'e1', 'l2', 'l3', 'o4' ]
```
- 비슷한 측면에서 `String` 객체에 배열 메서드를 적용하는 것은 제한적이지만 가능함
	- `String`의 `length` 프로퍼티가 read-only이기 때문에

#### 상속 구현하기
```js
  function Person(name, gender) {
    this.name = name;
    this.gender = gender;
  }

  function Student(name, gender, school) {
    // 상속을 구현하는 일반적인 방법
    Person.call(this, name, gender);
    this.school = school;
  }

  function Employee(name, gender, company) {
    // 상속을 구현하는 일반적인 방법
    Person.apply(this, [name, gender]);
    this.company = company;
  }

  const st = new Student("chan", "male", "42seoul");
  const em = new Employee("hyle", "male", "google");

  // Student { name: 'chan', gender: 'male', school: '42seoul' }
  // Employee { name: 'hyle', gender: 'male', company: 'google' }
  console.log(st, em);
```
- c++에서 부모 클래스 생성자를 부르는 것과 비슷하다고 생각하면 될 듯
- 특정 클래스 생성자에서 상속받고 싶은 클래스의 생성자를 `call`, `apply`, `bind`을 이용하여 호출하면 해당 클래스의 멤버 변수를 상속받을 수 있음
	- `Person.call(this)`

#### spread 연산 대신 사용하기
```js
  const numbers = [10, 20, 3, 16, 45];
  const maxES5 = Math.max.apply(null, numbers);
  const minES5 = Math.min.apply(null, numbers);

  const maxES6 = Math.max(...numbers);
  const minES6 = Math.min(...numbers);

  console.log(maxES5 === maxES6, minES5 === minES6);
```
- spread 연산은 ES6부터 사용할 수 있다
- ES5까지는 `apply`의 두 번째 인자를 이용해서 간단하게 spread 문법처럼 사용할 수 있다