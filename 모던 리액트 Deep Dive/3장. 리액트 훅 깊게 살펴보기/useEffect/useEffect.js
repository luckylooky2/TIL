const { useState, useEffect } = React;

function App() {
  const [counter, setCounter] = useState(0);

  function handleClick() {
    setCounter((prev) => prev + 1);
  }

  useEffect(() => {
    function addMouseEvent() {
      console.log(counter);
    }

    window.addEventListener("click", addMouseEvent);

    // 이전의 상태를 기억하고 있어야 한다.
    // - 그렇지 않으면 이전 상태에 대한 처리를 할 수 없다.
    return () => {
      console.log("cleanup", counter);
      window.removeEventListener("click", addMouseEvent);
    };
  }, [counter]);

  console.log("render");

  return (
    <>
      <h1>{counter}</h1>
      <button onClick={handleClick}>+</button>
    </>
  );
}
