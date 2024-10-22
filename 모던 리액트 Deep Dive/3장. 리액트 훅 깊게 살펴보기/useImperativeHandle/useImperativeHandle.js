const { useState, useImperativeHandle, useRef, forwardRef } = React;

const Input = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({ alert: () => alert(props.value) }), [
    props.value,
  ]);

  return <input ref={ref} {...props} />;
});

function App() {
  const inputRef = useRef();
  const [text, setText] = useState("");

  function handleClick() {
    console.log(inputRef.current); // {alert: ƒ}
    // inputRef.current.alert();
    alert(text);
  }

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input ref={inputRef} value={text} onChange={handleChange} />
      <button onClick={handleClick}>Focus</button>
    </>
  );
}
