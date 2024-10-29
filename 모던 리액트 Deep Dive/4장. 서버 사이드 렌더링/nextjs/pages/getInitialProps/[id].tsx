import Link from "next/link";

export default function Todo({ todo }) {
  return (
    <>
      <h1>{todo.title}</h1>
      <ul>
        <li>
          <Link href="/getInitialProps/1">1번</Link>
        </li>
        <li>
          <Link href="/getInitialProps/2">2번</Link>
        </li>
        <li>
          <Link href="/getInitialProps/3">3번</Link>
        </li>
      </ul>
    </>
  );
}

// 정적 메서드로 추가한다는 점
Todo.getInitialProps = async (context) => {
  const {
    query: { id = "" },
  } = context;
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${id}`
  );
  const result = response.json();
  // "getInitialProps"는 서버에서도 클라이언트에서도 실행될 수 있다!: 반드시 주의를 기울여야 한다.
  console.log("fetch Complete!");
  // props 객체가 아니라 그냥 객체를 반환한다.
  return { todo: result };
};

// getStaticProps나 getServerSideProps가 나오기 전에 사용할 수 있었던 유일한 페이지 불러오기 수단이었다.
// _app.tsx와 같이 일부 페이지는 getInitialProps 밖에 사용할 수 없다.
