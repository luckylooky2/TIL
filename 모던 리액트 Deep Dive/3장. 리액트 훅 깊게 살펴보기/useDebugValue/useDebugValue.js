const { useState, useEffect, useDebugValue } = React;

function useDate() {
  const date = new Date();

  useDebugValue(date, () => `현재 시간: ${date.toISOString()}`);
  return date;
}

function App() {
  const date = useDate();
  const [counter, setCounter] = useState(0);

  // 훅 내부에서만 실행할 수 있다.
  // useDebugValue(date, () => `현재 시간: ${date.toISOString()}`);

  function handleClick() {
    setCounter((prev) => prev + 1);
  }

  return (
    <div>
      <h1>
        {counter} {date.toISOString()}
      </h1>
      <button onClick={handleClick}>+</button>
    </div>
  );
}
