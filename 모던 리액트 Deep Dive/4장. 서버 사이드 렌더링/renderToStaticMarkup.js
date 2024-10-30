const React = require("react");
const ReactDOMServer = require("react-dom/server");
const { useEffect } = React;

function ChildComponent({ fruits }) {
  useEffect(() => {
    console.log(fruits);
  }, [fruits]);

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

const result = ReactDOMServer.renderToStaticMarkup(
  React.createElement("div", { id: "root" }, <App />)
);

// <div id="root"><div>hello</div><ul><li>apple</li><li>banana</li><li>peach</li></ul></div>
console.log(result);

// data-reactroot와 같은 리액트에서만 사용하는 추가적인 DOM 속성을 만들지 않는다.
// data-reactroot는 hydrate할 때 이용되기 때문에 renderToStaticMarkup는 hydrate를 하지 않는다는 가정이다.
// 즉, 이벤트 리스너가 필요 없는 완전히 순수한 HTML을 만들 때 사용한다.
