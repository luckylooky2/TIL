const { useState, useEffect, useRef } = React;

// 이 훅 내부의 상태 값이 속한 곳은 usePrevious 훅이 아니라 App 컴포넌트이다.
// 내부에서 렌더링이 발생하면 커스텀 훅이 호출된 컴포넌트가 리렌더링된다.
function usePrevious(value) {
  console.log("in usePrevious");
  const ref = useRef();
  const [counter, setCounter] = useState(0);

  // render가 된 이후에 실행되므로 가장 마지막에 출력된다.
  useEffect(() => {
    console.log("useEffect");
    ref.current = value;
    setCounter((counter) => counter + 1);
  }, [value]);

  return ref.current;
}

function App() {
  const [counter, setCounter] = useState(0);
  const previousCounter = usePrevious(counter);
  console.log("after usePrevious");

  function handleClick() {
    setCounter((prev) => prev + 1);
  }

  return (
    <button onClick={handleClick}>
      {counter} {previousCounter}
    </button>
  );
}

// useEffect 내부에 setCounter가 없을 때
// - 1. usePrevious 훅에 들어가고 useEffect는 실행되지 않고 ref의 초기 값(undefined)을 반환한다.
// - 2. render(return)을 통해 가상 DOM을 렌더링 및 적용
// - 3. useEffect를 실행하여 ref를 최신화(0)
// - 4. "0 undefined"가 표시

// useEffect 내부에 setCounter가 존재할 때
// - 1. usePrevious 훅에 들어가고 useEffect는 실행되지 않고 ref의 초기 값(undefined)을 반환한다.
// - 2. render(return)을 통해 가상 DOM을 렌더링 및 적용
// - 3. useEffect를 실행하여 ref를 최신화(0)
// - 4. setCounter를 실행하여 counter를 증가시키고, counter가 속한 App을 리렌더링
// - 5. usePrevious 훅에 들어가고 useEffect는 실행되지 않고 ref의 값(0)을 반환한다.
// - 6. render(return)을 통해 가상 DOM을 렌더링 및 적용
// - 7. "0 0"이 표시
