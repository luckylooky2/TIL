// 객체 구조 분해 할당 트랜스파일

// 심볼 키를 기준으로 제외시키는 함수
function _objectWithoutProperties(source, excluded) {
  if (source == null) {
    return {};
  }

  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) {
        continue;
      }
      // 열거 가능 속성만 포함하기 위해 특정 속성이 객체에서 열거 가능한 속성인지 확인한다
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) {
        continue;
      }
      target[key] = source[key];
    }
  }
  return target;
}

// 문자열 키를 기준으로 제외시키는 함수
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) {
    return {};
  }

  var target = {};
  // 모든 key
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    // excluded에 있으면 제외
    if (excluded.indexOf(key) >= 0) {
      continue;
    }
    target[key] = source[key];
  }

  return target;
}

const object = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  [Symbol()]: 6,
};

var a = object.a,
  b = object.b,
  // object에서 a와 b를 제외한다.
  rest = _objectWithoutProperties(object, ["a", "b"]);

console.log(a, b, rest); // 1 2 { c: 3, d: 4, e: 5 }
