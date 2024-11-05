const store1 = createStore({ count: 0 });

function App() {
  return (
    <>
      <WithoutSelector />
      <WithSelector />
    </>
  );
}

function WithoutSelector() {
  return (
    <>
      <h2>useStore</h2>
      <WithoutSelectorCounter1 />
      <WithoutSelectorCounter2 />
    </>
  );
}

function WithoutSelectorCounter1() {
  const [count, setCount] = useStore(store1);
  console.log("WithoutSelectorCounter1");

  function handleClick() {
    setCount((prev) => ({ count: prev.count + 1 }));
  }

  return (
    <>
      <h3>{count.count}</h3>
      <button onClick={handleClick}>+</button>
    </>
  );
}

function WithoutSelectorCounter2() {
  const [count, setCount] = useStore(store1);
  console.log("WithoutSelectorCounter2");

  function handleClick() {
    setCount((prev) => ({ count: prev.count + 1 }));
  }

  return (
    <>
      <h3>{count.count}</h3>
      <button onClick={handleClick}>+</button>
    </>
  );
}
