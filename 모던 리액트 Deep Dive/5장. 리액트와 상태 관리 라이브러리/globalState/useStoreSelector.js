const { useCallback } = React;
const store2 = createStore({ count: 0, text: "hi" });

function WithSelector() {
  return (
    <>
      <h2>useStoreSelector</h2>
      <WithSelectorCounter1 />
      <WithSelectorCounter2 />
    </>
  );
}

function WithSelectorCounter1() {
  // 상태 값이 객체라면 selector를 이용해보자.
  const count = useStoreSelector(
    store2,
    useCallback((state) => state.count),
    []
  );
  console.log("WithSelectorCounter1");

  function handleClick() {
    store2.set((prev) => ({ ...prev, count: prev.count + 1 }));
  }

  return (
    <>
      <h3>{count}</h3>
      <button onClick={handleClick}>+</button>
    </>
  );
}

function WithSelectorCounter2() {
  // useCallback을 사용하지 않으면, 리렌더링은 발생하지 않더라도 store에서 불필요하게 select을 하는 작업을 수행하게 된다.
  const text = useStoreSelector(store2, (state) => state.text);
  console.log("WithSelectorCounter2");

  function handleClick() {
    store2.set((prev) => ({ ...prev, text: prev.text + "!" }));
  }

  return (
    <>
      <h3>{text}</h3>
      <button onClick={handleClick}>+</button>
    </>
  );
}
