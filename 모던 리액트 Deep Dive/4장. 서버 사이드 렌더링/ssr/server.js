import { createServer } from "http";
import { fetchTodo } from "./fetch";
import { createElement } from "react";
import { renderToString, renderToNodeStream } from "react-dom/server";
import { createReadStream } from "fs";

// SSR의 기본 템플릿 html: __placeholder__를 가지고 있음
import html from "./public/index.html";
import indexFront from "./public/index-front.html";
import indexEnd from "./public/index-end.html";

import App from "./components/App";

const PORT = process.env.PORT || 3000;

// 라우트별로 어떻게 작동할지를 정의
async function serverHandler(req, res) {
  const { url } = req;

  switch (url) {
    case "/": {
      const result = await fetchTodo();
      const rootElement = createElement(
        "div",
        { id: "root" },
        createElement(App, { todos: result })
      );
      // renderToString
      console.log("renderToString start");
      const renderResult = renderToString(rootElement);
      console.log("renderToString end");
      const htmlResult = html.replace("__placeholder__", renderResult);
      res.setHeader("Content-Type", "text/html");
      res.write(htmlResult);
      res.end();
      return;
    }

    case "/stream": {
      res.setHeader("Content-type", "text/html");
      res.write(indexFront);

      const result = await fetchTodo();
      const rootElement = createElement(
        "div",
        { id: "root" },
        createElement(App, { todos: result })
      );
      // renderToNodeStream
      const stream = renderToNodeStream(rootElement);
      stream.pipe(res, { end: false });
      stream.on("end", () => {
        res.write(indexEnd);
        res.end();
      });
      return;
    }

    case "/browser.js": {
      res.setHeader("Content-Type", "application/javascript");
      createReadStream("./dist/browser.js").pipe(res);
      return;
    }

    case "/browser.js.map": {
      res.setHeader("Content-Type", "application/javascript");
      createReadStream("./dist/browser.js.map").pipe(res);
      return;
    }

    default: {
      res.statusCode = 404;
      res.end("404 Not Found");
    }
  }
}

function main() {
  // http 모듈을 이요해 간단한 서버를 만들 수 있는 기본 라이브러리
  createServer(serverHandler).listen(PORT, () => {
    console.log(`Server has been started ${PORT}...`);
  });
}

main();
