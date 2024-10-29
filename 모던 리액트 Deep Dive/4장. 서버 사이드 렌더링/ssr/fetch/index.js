import fetch from "isomorphic-fetch";

export async function fetchTodo() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const result = await response.json();
  // return result;
  // 스트림의 극단적인 예제를 보고 싶다면 주석 해제
  return Array(100).fill(result).flat();
}

// renderToString이 전부 렌더링될 때까지 block되어 아무것도 하지 못한다.
// renderToNodeStream은 먼저 도착한 것을 보여줘서 조금 더 빠르게 로딩이 되는 느낌이다.
