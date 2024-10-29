import { hydrate } from "react-dom";
import React from "react";

import App from "./components/App";
import { fetchTodo } from "./fetch";

async function main() {
  const result = await fetchTodo();

  // hydration 대상이 되는 html
  const app = <App todos={result} />;
  // 서버에서 완성된 html
  // - 브라우저 페이지 소스 보기 기능을 통해 hydration 되기 이전의 html을 확인할 수 있다.
  const el = document.getElementById("root");

  // 서버에서 완성된 html(비동기 데이터 포함)과 hydration 대상이 되는 html(클라이언트에서 한 번 더 비동기 요청)의 결과물을 "비교"
  hydrate(app, el);
}

main();

// 서버로부터 받은 html 파일을 hydrate를 통해 완성된 웹 애플리케이션으로 만드는 것이다.
// - useEffect와 이벤트 핸들러도 잘 작동이 되는 것으로보아 hydrate가 제대로 작동함을 알 수 있다.

// fetch가 두 번 호출됨에 따라 결과물에 차이가 발생할 수도 있지 않나?
// - 타당한 지적
// - next.js의 경우, 서버에서만 fetch를 호출하고 호출 결과를 html에 직접 담는 것이 아니라 따로 script 태그를 통해 포함시킨다.
// - 순수한 html 뼈대만 비교하고, html 파싱이 끝나면 window 객체를 통해 접근할 수 있게 하여 fetch 중복 호출을 막았다.

```
<script id="__NEXT_DATA__" type="application/json">
  {"props": {"pageProps" : {}}}
</script>;
window.__NEXT_DATA__; // {"props": {"pageProps" : {}}}
```;
