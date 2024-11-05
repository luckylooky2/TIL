// 상태 값과 getter, setter를 하나의 객체로 묶는다.
const createStore = (initialState) => {
  // 상태 값
  let state =
    typeof initialState === "function" ? initialState() : initialState;

  const callbacks = new Set();
  // 최신 상태 값 반환
  const get = () => state;
  // 상태 값 최신화
  const set = (nextState) => {
    state = typeof nextState === "function" ? nextState(state) : nextState;
    // state가 변경되면 콜백 목록을 순회하면서 모든 콜백을 실행한다.
    callbacks.forEach((callback) => callback());
    return state;
  };
  // 콜백 set에 새로운 콜백을 등록하고 해당 콜백을 제거하는 함수를 반환
  const subscribe = (callback) => {
    console.log("subscribed");
    callbacks.add(callback);

    return () => {
      callbacks.delete(callback);
    };
  };

  return { get, set, subscribe };
};
