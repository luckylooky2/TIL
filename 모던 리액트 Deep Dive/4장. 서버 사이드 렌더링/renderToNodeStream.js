const React = require("react");
const ReactDOMServer = require("react-dom/server");
const { useState, useEffect } = React;

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

const result = ReactDOMServer.renderToNodeStream(
  React.createElement("div", { id: "root" }, <App />)
);

// ReactMarkupReadableStream {
//   _events: {
//     close: undefined,
//     error: undefined,
//     data: undefined,
//     end: undefined,
//     readable: undefined
//   },
//   _readableState: ReadableState {
//     highWaterMark: 65536,
//     buffer: [],
//     bufferIndex: 0,
//     length: 0,
//     pipes: [],
//     awaitDrainWriters: null,
//     [Symbol(kState)]: 1052940
//   },
//   _maxListeners: undefined,
//   partialRenderer: ReactDOMServerRenderer {
//     threadID: 1,
//     stack: [ [Object] ],
//     exhausted: false,
//     currentSelectValue: null,
//     previousWasTextNode: false,
//     makeStaticMarkup: false,
//     suspenseDepth: 0,
//     contextIndex: -1,
//     contextStack: [],
//     contextValueStack: [],
//     uniqueID: 0,
//     identifierPrefix: '',
//     contextProviderStack: []
//   },
//   [Symbol(shapeMode)]: true,
//   [Symbol(kCapture)]: false
// }
console.log(result);

// ReadableStream는 브라우저에서도 사용할 수 있는 객체이다.
// 스트림을 이용하면 큰 크기의 데이터를 청크 단위로 분리해 순차적으로 처리할 수 있다.
// renderToString은 HTML이 완성될 때까지 서버에서 기다려야 한다.
