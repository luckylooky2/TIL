const { useState, useEffect } = React;

function App() {
  return (
    <>
      <Counter1 />
      <Counter2 />
    </>
  );
}

function Counter1() {
  // 1. 상태가 중복되어 비효율적이다.
  const [count, setCount] = useState(state);

  function handleClick() {
    set((prev) => {
      const newState = { counter: prev.counter + 1 };
      setCount(newState);
      return newState;
    });
  }

  return (
    <>
      <h3>{count.counter}</h3>
      <button onClick={handleClick}>+</button>
    </>
  );
}

function Counter2() {
  const [count, setCount] = useState(state);

  function handleClick() {
    set((prev) => {
      const newState = { counter: prev.counter + 1 };
      setCount(newState);
      return newState;
    });
  }

  // 2. Counter1을 업데이트해면, Counter2는 업데이트되지 않는다. 즉, 두 컴포넌트가 동시에 렌더링되지 않는다.
  return (
    <>
      <h3>{count.counter}</h3>
      <button onClick={handleClick}>+</button>
    </>
  );
}
