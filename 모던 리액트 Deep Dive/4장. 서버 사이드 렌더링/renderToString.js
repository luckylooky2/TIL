const React = require("react");
const ReactDOMServer = require("react-dom/server");
const { useState, useEffect } = React;

function ChildComponent({ fruits }) {
  // 결과물에 포함되지 않음: 의도된 것
  useEffect(() => {
    console.log(fruits);
  }, [fruits]);

  // 결과물에 포함되지 않음: 의도된 것
  function handleClick() {
    console.log("hello");
  }

  return (
    <ul>
      {fruits.map((fruit) => (
        <li key={fruit} onClick={handleClick}>
          {fruit}
        </li>
      ))}
    </ul>
  );
}

function App() {
  return (
    <>
      <div>hello</div>
      <ChildComponent fruits={["apple", "banana", "peach"]} />
    </>
  );
}

const result = ReactDOMServer.renderToString(
  React.createElement("div", { id: "root" }, <App />)
);

// <div id="root" data-reactroot=""><div>hello</div><ul><li>apple</li><li>banana</li><li>peach</li></ul></div>
console.log(result);

// 브라우저가 렌더링하는 HTML을 제공하는데 목적이 있기 때문에, 자바스크립트 코드를 포함하지 않는다.
// react-dom 18부터는 data-reactroot가 없다. why?
