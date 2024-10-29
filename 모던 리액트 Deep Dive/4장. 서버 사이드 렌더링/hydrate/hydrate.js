const { useState, useEffect } = React;

function App() {
  return (
    <div id="root" data-reactroot="">
      <div>hello</div>
      <ul>
        <li>apple</li>
        <li>banana</li>
        <li>peach</li>
        <button onClick={() => console.log("+")}>+</button>
      </ul>
    </div>
  );
}

// 불일치가 발생하면, hydrate에 전달된 컴포넌트를 기준으로 웹 페이지를 그린다.
// - 사실상, 두 번의 렌더링이 발생하는 것이기 때문에 반드시 고쳐야 하는 문제이다.
// function App() {
//   return (
//     <>
//       <span>hello</span>
//       <div suppressHydrationWarning>{new Date().getTime()}</div>
//     </>
//   );
// }

// 불가피하게 결과물이 다를 수 있을 수도 있다.
// - 컴포넌트 내부에 초 단위 시간이 렌더링 되는 경우, suppressHydrationWarning를 추가해 경고를 끌 수 있다.
// - useEffect를 통해 처리하는 방법도 있다.

// 만약 hydrate에 서버에서 렌더링된 HTML과 서로 다른 컴포넌트를 전달하면, 콘솔 경고를 발생시킨다.
// - 예상하지 못한 동작을 피하기 위해 클라이언트 쪽에서 전달된 컴포넌트의 전체 DOM을 교체하여 렌더링할 수 있다.
