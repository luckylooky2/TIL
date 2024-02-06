### 실행 컨텍스트

- 실행할 코드에 제공할 환경 정보들을 모아놓은 객체
- 과정
	1. `foo` 함수가 호출됨
	2. `foo` 함수의 실행 컨텍스트를 생성
	     - 호이스팅 : `foo` 함수 내의 모든 식별자(매개변수, 변수, 함수)를 찾아 선언(초기화는 하지 않음) => `environmentRecord` 를 구성
	     - 상위 컨텍스트 연결 : 현재 콜 스택에 있는 실행 컨텍스트 중에서 `foo` 함수가 식별자로 존재하는(즉, 선언된) 가장 상위의 실행 컨텍스트를 검색하여 메모리를 참조 => `outerEnvironmentReference` 를 구성
	3. 해당 실행 컨텍스트를 콜 스택에 쌓음
	4. `foo` 함수를 실행
	5. 함수를 실행하면서 참조하는 식별자는 스코프 체인(`outerEnvironmentReference`)을 따라가면서 `environmentRecord`를 확인하고 해당 값을 참조
- 실행 컨텍스트의 구성 요소

```
Execution Context
	├── VariableEnvironment(snapshot)
	│		├── environmentRecord
	│		└── outerEnvironmentReference
	├── outerEnvironmentReference
	│		├── environmentRecord
	│		└── outerEnvironmentReference
	└── ThisBinding
```

- `VariableEnvironment` : 현재 컨텍스트 내의 식별자들에 대한 정보 + 외부 환경 정보(최초 스냅샷)
	- `environmentRecord` : 현재 컨텍스트 내의 식별자들에 대한 정보를 저장
	-  `outerEnvironmentReference` : 외부 환경 정보(현재 호출된 함수가 선언될 때의 `LexicalEnvironment`)
- `LexicalEnvironment` : 현재 컨텍스트 내의 식별자들에 대한 정보 + 외부 환경 정보(실시간 수정)
- `ThisBinding` : this 식별자가 바라봐야 할 대상 객체

### 렉시컬 스코프

- 렉시컬 스코프는 식별자가 선언된 위치를 기준으로 범위를 구성하는 방법이다
- 내부 함수가 실행될 수 있는 이유는 내부 함수를 식별자로 가지고 있는 외부 함수 실행 컨텍스트가 존재하기 때문이다
	- 다시 말해서, 존재하는 실행 컨텍스트에서 해당 식별자를 찾을 수 있기 때문이다
	- 반대로, 식별자를 찾지 못하는 `ReferenceError`는 존재하는 실행 컨텍스트에서 해당 식별자를 찾지 못했기 때문이다

1. 실행 컨텍스트를 만들 때, `outerEnvironmentReference`를 해당 식별자가 존재하는 실행 컨텍스트를 가리키게 하고
2. 식별자를 찾을 때, `outerEnvironmentReference` 를 따라가며 찾는 과정을 통해

- 이렇게 함으로써, 함수가 실행될 때의 동적인 상황에 따라 스코프 체인이 구성되면서 정적인(렉시컬) 스코핑이 가능해진다
- 렉시컬 스코프는 현재 생성되어 있는 실행 컨텍스트들에 의존한다
- **이런 구조로 인해 발생하는 스코프를 렉시컬 스코프라고 한다**
- 선언된 위치에 따라 결정되는 것은 실행 컨텍스트 내부의 `environmentRecord` 에 해당 식별자가 있는지 확인하기 때문이다
- `outerEnvironmentReference` 를 연결하는 방법(즉, 식별자가 존재하는 실행 컨텍스트를 참조하는 방법) 때문에 _코드가 선언된 위치(구조)와 동일하게 실행 컨텍스트의 구조가 형성되는 것이다_

### 클로저는?

- 클로저는 간단하게 말해서, 함수 내부의 코드가 모두 실행이 끝났는데에도 실행 컨텍스트가 남아있는 현상을 말한다(C언어에서 지역 변수를 리턴하는 것과 비슷하게 구현된다)
- GC 과정에서 참조 카운트가 남아있기 때문에 실행 컨텍스트가 수거되지 않는 현상이다
- 예를 들어, 클로저가 리턴하는 함수를 실행하는 것은 클로저로 인해 외부 함수의 실행 컨텍스트가 남아있고, 해당 실행 컨텍스트의 `environmentRecord`에 클로저가 리턴하는 함수(식별자)가 존재하기 때문에 실행할 수 있는 것이다

### 호이스팅 코드

```js
(function () {
  console.log(b); // [Function: b]
  
  var b = "bbb";
  
  console.log(b); // bbb
  
  function b() {}
  
  console.log(b); // bbb
})();
```

- `function b`가 호이스팅 되면서 `var b`를 overwrite하는 상황 발생
- `var`로 변수를 선언했기에 가능

```js
(function () {
  console.log(b);
  
  let b = "bbb";
  
  console.log(b);
  
  function b() {}
  
  console.log(b);
})();

// SyntaxError: Identifier 'b' has already been declared
```

- `let`, `const` 특징 1 : 변수 중복을 막을 수 있음

```js
(function () {
  console.log(b); // [Function: b]
  
  function b() {}
  
  console.log(b); // [Function: b]
})();
```

- 함수 호이스팅

```js
(function () {
  console.log(b); // undefined
  
  var b = function () {};
  
  console.log(b); // [Function: b]
})();
```

- 함수 표현식으로 작성하는 방법은 바로 위 예제처럼 함수 호이스팅 때문에 발생하는 문제를 어느 정도 막아준다
- `let`, `const` 를 사용했다면, `ReferenceError: Cannot access 'b' before initialization` 에러가 발생

```js
(function () {
  console.log(sum(3, 4)); // 3 + 4 = 7

  function sum(x, y) {
    return x + y;
  }

  var a = sum(1, 2);
  console.log(a); // 1 + 2 = 3

  // <여기>
  function sum(x, y) {
    return x + " + " + y + " = " + (x + y);
  }

  var c = sum(1, 2);
  console.log(c); // 1 + 2 = 3
})();
```

- 함수 선언문의 위험성
- 같은 파일 앞에 똑같은 형식의 함수 선언문이 존재했을 경우 함수 override 발생
- 즉, <여기> 아래부터 적용될 것이라고 예상한 것과는 달리 위치상 위의 코드도 영향을 받는다는 것이 문제
- 앞의 코드 실행조차 안 되는 상황까지 발생할 가능성이 존재

```js
(function () {
  console.log(sum(3, 4)); // 7

  function sum(x, y) {
    return x + y;
  }

  var a = sum(1, 2);
  console.log(a); // 3

  // 해결
  var sum = function (x, y) {
    return x + " + " + y + " = " + (x + y);
  };

  var c = sum(1, 2);
  console.log(c); // 1 + 2 = 3
})();
```

- 앞의 함수들이 함수 선언문이라도 특정 지점부터 함수 표현식을 사용한다면, 위로 스코프가 오염되는 것을 막을 수 있음