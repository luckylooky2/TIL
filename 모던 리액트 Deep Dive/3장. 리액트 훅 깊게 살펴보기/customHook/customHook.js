const { useState, useEffect } = React;

// interface Todo {
//   userId: Number;
//   id: Number;
//   title: String;
//   completed: Boolean;
// }

// 이전에는 fetch를 호출하는 모든 컴포넌트에서 최소 4개의 state를 각각 선언해야 했다.
function useFetch(url, { method, body }) {
  console.log("useFetch");
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [ok, setOk] = useState();
  const [status, setStatus] = useState();

  // url, method, body가 바뀌지 않는 한 다시 호출되지 않는다.
  useEffect(() => {
    console.log("useFetch useEffect");
    const abortController = new AbortController();

    (async () => {
      // setState 함수가 호출되면서 App과 useFetch에 리렌더링이 발생한다.
      // - useFetch의 props는 값이 변하지 않고 state는 변경이 되는데, useEffect가 리렌더링 되지는 않는다.
      setIsLoading(true);

      const response = await fetch(url, {
        method,
        body,
        signal: abortController.signal,
      });

      setOk(response.ok);
      setStatus(response.status);
      if (response.ok) {
        const apiResult = await response.json();
        setResult(apiResult);
      }
      setIsLoading(false);
    })();

    return () => {
      abortController.abort();
    };
  }, [url, method, body]);

  return { ok, result, isLoading, status };
}

function App() {
  console.log("App");
  // 첫 렌더링에는 초기화된 상태 값을 반환하고 UI를 업데이트한다.
  // - 이후, useEffect의 콜백에서 상태 값을 수정하면서 리렌더링이 발생하고, 수정된 상태 값으로 반복적으로 UI를 업데이트한다.
  const { isLoading, result, status, ok } = useFetch(
    "https://jsonplaceholder.typicode.com/todos",
    { method: "GET" }
  );

  useEffect(() => {
    if (!isLoading) {
      console.log("fetchResult >>", status);
    }
  }, [status, isLoading]);

  return (
    <div>
      {ok
        ? (result || []).map(({ userId, title }, index) => (
            <div key={index}>
              <p>{userId}</p>
              <p>{title}</p>
            </div>
          ))
        : null}
    </div>
  );
}

// 리렌더링이 3번 발생하는 이유? setState를 호출한 횟수와 정확히 일치하지 않는다.
