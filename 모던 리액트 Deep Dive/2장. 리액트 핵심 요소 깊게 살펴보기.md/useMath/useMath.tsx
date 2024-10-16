const { useState, useEffect, useMemo } = React;

function useMath1(number: number) {
  const [double, setDouble] = useState(0);
  const [triple, setTriple] = useState(0);

  useEffect(() => {
    setDouble(number * 2);
    setTriple(number * 3);
  }, [number]);

  // 리렌더링이 발생하면서 함수가 다시 호출되고 새로운 참조로 반환된다.
  return { double, triple };
}

function useMath2(number: number) {
  const [double, setDouble] = useState(0);
  const [triple, setTriple] = useState(0);

  useEffect(() => {
    setDouble(number * 2);
    setTriple(number * 3);
  }, [number]);

  // double, triple이 바뀌지 않는한, 새로운 참조로 반환되지 않는다.
  return useMemo(() => ({ double, triple }), [double, triple]);
}

function App() {
  const [counter, setCounter] = useState(0);
  const value1 = useMath1(10);
  const value2 = useMath2(10);

  useEffect(() => {
    // 버튼을 클릭할 때마다 출력된다.
    // - value의 참조가 바뀌기 때문이다.
    console.log("useMath1", value1.double, value1.triple);
  }, [value1]);

  useEffect(() => {
    // 버튼을 클릭할 때마다 출력되지 않는다.
    console.log("useMath2", value2.double, value2.triple);
  }, [value2]);

  function handleClick() {
    setCounter((prev) => prev + 1);
  }

  return (
    <>
      <h1>{counter}</h1>
      <button onClick={handleClick}>+</button>
    </>
  );
}
