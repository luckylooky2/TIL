const { useState, useEffect } = React;

function ReactApp() {
  function App() {
    function onClick() {
      alert("form");
    }

    function onClick2() {
      alert("div");
    }

    function onClick3(e) {
      console.log(e); // SyntheticEvent, DOM에서는 PointerEvent로 서로 다르다.
      // 리액트 17
      // 아래 코드가 없으면, p -> div -> form -> document 순으로 이벤트가 전파된다.
      // 아래 코드가 있으면, p에서 이벤트가 중단된다.

      // 리액트 16
      // 아래 코드가 없으면, p -> div -> form -> document 순으로 이벤트가 전파된다. (같다)
      // 아래 코드가 있으면, p -> document 순으로 이벤트가 전파된다.
      e.stopPropagation();
      alert("p");
    }

    // 16 버전에서는 e.stopPropagation()가 있어도 아래가 출력됨
    useEffect(() => {
      document.addEventListener("click", (e) => {
        alert("이벤트가 document까지 올라옴.");
      });

      document.querySelector("html").addEventListener("click", (e) => {
        alert("이벤트가 html까지 올라옴.");
      });

      document.querySelector("body").addEventListener("click", (e) => {
        alert("이벤트가 body까지 올라옴.");
      });
    }, []);

    return (
      <form onClick={onClick}>
        FORM
        <div onClick={onClick2}>
          DIV
          <p onClick={onClick3}>P</p>
        </div>
      </form>
    );
  }

  return ReactDOM.render(<App />, document.getElementById("root"));
}

ReactApp();
