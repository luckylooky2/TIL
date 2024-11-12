const { useState, memo, useEffect } = React;

const Copyright = memo(function Copyright({ text }) {
  return <p>{text}</p>;
});

function InputText({ onSubmit }) {
  const [text, setText] = useState("");

  function handleTextChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input type="text" value={text} onChange={handleTextChange} />
      <button onClick={() => onSubmit(text)}>추가</button>
      <Copyright text="All rights reserved." />
    </>
  );
}

function App() {
  const [number, setNumber] = useState(0);
  const [list, setList] = useState([
    { name: "apple", amount: 5000 },
    { name: "orange", amount: 1000 },
    { name: "watermelon", amount: 1500 },
    { name: "pineapple", amount: 500 },
  ]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log("surprise!");
  //     setText("1000");
  //   }, 3000);
  // }, []);

  function onSumbit(text) {
    console.log(text);
    setList((prev) => [...prev, { name: text, amount: number }]);
  }

  function handleNumberChange(e) {
    setNumber(e.target.valueAsNumber);
  }

  // InputText 컴포넌트를 분리하지 않았을 때는 App 전체가 리렌더링되는 문제점이 있었다.
  // - 분리하고 난 이후에는 InputText 컴포넌트만 리렌더링되어 효율적이게 되었다.

  return (
    <div>
      <InputText onSubmit={onSumbit} />
      <input type="number" value={number} onChange={handleNumberChange} />
      <ul>
        {list.map((value, key) => (
          <li key={key}>
            {value.name} {value.amount}원
          </li>
        ))}
      </ul>
    </div>
  );
}
