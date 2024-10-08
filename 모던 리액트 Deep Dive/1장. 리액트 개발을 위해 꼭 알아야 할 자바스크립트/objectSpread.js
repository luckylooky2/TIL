// 트랜스파일

// object의 키들을 배열로 바꾸는 함수
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly &&
      (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      }));
    // 배열 합성 간단한 방법: apply 인자를 배열로 받음
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
}

function _objectSpread(target) {
  // 인자가 2개면 1번만 실행
  for (var i = 1; i < arguments.length; i++) {
    // null guard
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2
      ? ownKeys(Object(source), !0).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        })
      : Object.getOwnPropertyDescriptors // 객체의 모든 속성에 대한 속성 설명자들을 포함. 한 번에 하려고
      ? Object.defineProperties(
          target,
          Object.getOwnPropertyDescriptors(source) // 원본 객체의 writable, enumerable과 같은 속성을 모두 복사
        )
      : ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(
            target,
            key,
            Object.getOwnPropertyDescriptor(source, key)
          );
        });
  }

  return target;
}

var obj1 = {
  a: 1,
  b: 2,
  [Symbol("c")]: 3,
};
var obj2 = {
  d: 4,
  e: 5,
  [Symbol("f")]: 6,
};

var newObj = _objectSpread(_objectSpread({}, obj1), obj2);
console.log(newObj);
