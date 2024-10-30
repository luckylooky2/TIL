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

const result = ReactDOMServer.renderToStaticNodeStream(
  React.createElement("div", { id: "root" }, <App />)
);

// ReactMarkupReadableStream {
// 	_events: {
// 	  close: undefined,
// 	  error: undefined,
// 	  data: undefined,
// 	  end: undefined,
// 	  readable: undefined
// 	},
// 	_readableState: ReadableState {
// 	  highWaterMark: 65536,
// 	  buffer: [],
// 	  bufferIndex: 0,
// 	  length: 0,
// 	  pipes: [],
// 	  awaitDrainWriters: null,
// 	  [Symbol(kState)]: 1052940
// 	},
// 	_maxListeners: undefined,
// 	partialRenderer: ReactDOMServerRenderer {
// 	  threadID: 1,
// 	  stack: [ [Object] ],
// 	  exhausted: false,
// 	  currentSelectValue: null,
// 	  previousWasTextNode: false,
// 	  makeStaticMarkup: true,
// 	  suspenseDepth: 0,
// 	  contextIndex: -1,
// 	  contextStack: [],
// 	  contextValueStack: [],
// 	  uniqueID: 0,
// 	  identifierPrefix: '',
// 	  contextProviderStack: []
// 	},
// 	[Symbol(shapeMode)]: true,
// 	[Symbol(kCapture)]: false
//   }
console.log(result);

// 리액트 속성이 제공되지 않는다.
// hydrate가 필요없는 순수 HTML 결과물이 필요할 때 사용하는 메서드이다.
