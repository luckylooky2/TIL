const { useState, useEffect, useDeferredValue, useMemo } = React;

function App() {
  const [text, setText] = useState("");
  const defferedText = useDeferredValue(text);
  const [TEXT, DEFFERED_TEXT] = [text, defferedText];

  const list = useMemo(() => {
    const arr = Array.from({ length: DEFFERED_TEXT.length }).map(
      () => DEFFERED_TEXT
    );

    return (
      <ul>
        {arr.map((str, index) => (
          <li key={index}>{str}</li>
        ))}
      </ul>
    );
  }, [DEFFERED_TEXT]);

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      {DEFFERED_TEXT.length}
      <input value={text} onChange={handleChange} />
      {list}
    </>
  );
}

// text로 렌더링을 하면, input에 글자를 입력할 때마다 렌더링이 즉시 발생한다.
// - 렌더링이 자주 발생한다면, 렌더링 성능에 영향을 미칠 수 있다.

// deferredText로 렌더링을 하면, 렌더링을 즉시 반영하지 않고 일정 시간이 지난 후에 업데이트되도록 하여 렌더링 빈도를 줄인다.
// - 렌더링을 지연시켜 렌더링 성능을 최적화할 수 있다.
