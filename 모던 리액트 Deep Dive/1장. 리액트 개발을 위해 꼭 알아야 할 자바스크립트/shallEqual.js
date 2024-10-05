function objectIs(x, y) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || // 0과 -0을 구분하기 위해
    (x !== x && y !== y) // NaN === NaN을 위해
  );
}
// 1 / 0 = Infinity, 1 / -0 = -Infinity
// NaN은 항상 자기 자신과 같지 않다고 평가

function shallowEqual(objA, objB) {
  // 두 객체의 참조가 같으면 무조건 같다고 판단
  // - 조건 1: 두 객체의 가장 상위 참조는 달라야 한다.
  // objectIs만 사용한다면 참조만 달라졌고 내용은 똑같은 경우에도 불필요한 렌더링을 야기한다
  if (objectIs(objA, objB)) {
    return true;
  }

  // 아래부터는 null이 아닌 Object 타입이어야 한다
  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // 두 객체의 참조가 다르더라도, 내부 프로퍼티들이 모두 같은 참조(또는 값)를 가지고 있으면 동일하다고 판단
  // - 조건 2: 내부 프로퍼티(또는 원소)의 모든 값(또는 참조) 중 하나라도 달라야 한다.
  for (let i = 0; i < keysA.length; i++) {
    const currentKey = keysA[i];
    if (
      !hasOwnProperty.call(objB, currentKey) ||
      !objectIs(objA[currentKey], objB[currentKey])
    ) {
      return false;
    }
  }

  return true;
}

const a = { hello: "123" };
const b = { hello: "123" };
shallowEqual(a, b); // true
shallowEqual(a, { ...a, hi: "123" }); // false
shallowEqual(a, { ...a }); // true

const c = [1, 2, 3];
const d = [{}, {}, {}];
shallowEqual(c, [...c]); // true
shallowEqual(c, [...c, 4]); // false
shallowEqual(d, [...d]); // true

const e = [...d];
e[0] = {};
shallowEqual(d, e); // false

shallowEqual(null, null); // true
shallowEqual(1, 1); // true

// 얕은 비교란, 첫 번째 깊이에 존재하는 *값*만 비교한다.
shallowEqual({ hello: "world" }, { hello: "world" }); // true
// 2 depth 까지 모두 같더라도, *참조가 다르기 때문에* false를 반환한다.

shallowEqual({ hello: { hi: "world" } }, { hello: { hi: "world" } }); // false
