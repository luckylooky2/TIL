// 클래스를 바벨로 트랜스파일
"use strict";

// 클래스가 함수처럼 호출되는 것을 방지
function _classCallCheck(instance, Constructor) {
  // 호출하는 방식에 따라 this가 달라지기 때문에 분기시킬 수 있다.
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

// 프로퍼티를 할당
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) {
      descriptor.writable = true;
    }
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

// 프로토타입 메서드와 정적 메서드를 선언
function _createClass(Constructor, protoProps, staticProps) {
  // 어떤 효과가 있는지는 알겠는데, 어떤 구조로 되어 있는 것인가?
  if (protoProps) {
    // 생성자의 prototype에 추가(생성자에서는 prototype으로 직접 접근 가능)
    _defineProperties(Constructor.prototype, protoProps);
  }
  if (staticProps) {
    // 생성자에 직접 추가
    _defineProperties(Constructor, staticProps);
  }
  // Constructor의 prototype 프로퍼티를 재할당하거나 수정하려는 시도를 방지한다.
  Object.defineProperty(Constructor, "prototype", { writable: false });
  return Constructor;
}

var Car = (function () {
  // 여기서의 this와 constructor 내부에서의 this가 다른 이유
  // - 여기서는 함수로서 실행: undefined
  // - constructor 내부에서 새로 객체를 생성하고, this는 생성된 객체를 가리키게 됨

  // constructor 함수를 반환
  function Car(name) {
    _classCallCheck(this, Car);
    this.name = name;

    // 명시적으로 객체를 반환하지 않으면, 자동으로 this 객체를 반환
    return this;
  }

  _createClass(
    Car,
    [
      {
        key: "honk",
        value: function honk() {
          console.log("".concat(this.name, "이 경적을 울립니다!"));
        },
      },
      {
        key: "age",
        get: function get() {
          return this.carAge;
        },
        set: function set(value) {
          this.carAge = value;
        },
      },
    ],
    [
      {
        key: "hello",
        value: function hello() {
          console.log("저는 자동차입니다.");
        },
      },
    ]
  );

  return Car;
})();

const car = new Car("승용차");
// const car2 = Car("test"); // TypeError: Cannot call a class as a function

// Constructor
// - 정적 메서드를 가지고 있는 객체이다.
// - 하지만 출력해도 정적 프로퍼티는 보이지 않는다. 이유가 있나? 기본 출력 방식에서 함수 본문만 표시되기 때문이다.
// - Constructor.prototype 접근: 내부에 Constructor.prototype 참조를 가지고 있다.(순환 참조)

// Constructor.prototype
// - 클래스에서 할당한 프로퍼티(인스턴스 메서드)를 가지고 있는 객체이다.
// - 모든 인스턴스는 같은 인스턴스 메서드를 공유한다.
// - Constructor 접근: 내부에 Constructor 참조를 가지고 있다.(순환 참조)

// 인스턴스
// - Constructor에서 할당한 프로퍼티(인스턴스 프로퍼티)를 가지고 있는 객체이다.
// - 클래스에서 할당한 프로퍼티(인스턴스 메서드)는 프로토타입(Constructor.prototype)에 할당이 되어 있다.
// - 인스턴스에서 인스턴스 메서드를 직접적으로 사용할 수 없으므로 프로토타입 체인에서 검색하여 사용한다.
// - 모든 인스턴스는 Constructor.prototype에 존재하는 메서드에 접근하여 사용한다.
// - Constructor.prototype 접근: Object.getPrototypeOf(인스턴스)를 통해 접근할 수 있다.
// - Constructor 접근: 생성자를 알고 있기 때문에 직접 접근할 수 있다.

console.log("Constructor", Car); // 함수 본문이 출력
console.log("Constructor.prototype", Object.getPrototypeOf(car)); // {}
console.log("인스턴스", car); // { name: "승용차" }

const car2 = new Car("중형차");
console.log(car.honk === car2.honk); // true

// cf> 변수는 스코프 체인을 따라 검색하고, 객체의 프로퍼티는 프로토타입 체인을 따라 검색
