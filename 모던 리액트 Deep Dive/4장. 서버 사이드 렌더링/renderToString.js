const React = require("react");
const ReactDOMServer = require("react-dom/server");
const { useEffect } = React;

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
// - 나머지 자바스크립트 코드는 생성된 HTML과는 별도로 제공해 브라우저에 제공해야 한다.
// - hydrate 과정을 통해 사용자와 인터렉션을 할 준비를 한다.

// 장점
// - 초기 렌더링에서 성능이 뛰어나다.
// - SEO를 위한 메타 데이터도 서버에서 미리 준비할 수 있다.

// data-reactroot 속성
// - 리액트 컴포넌트의 루트 엘리먼트가 무엇인지 식별하는 역할을 한다.
// - hydrate 함수에서 루트를 식별하는 기준이 된다.

// react-dom 18부터는 data-reactroot가 없다. why?
