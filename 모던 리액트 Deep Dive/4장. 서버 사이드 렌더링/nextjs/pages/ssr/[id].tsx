import type { GetServerSideProps } from "next";
import Link from "next/link";

interface Post {
  title: string;
  id: number;
}

async function fetchPost(id: number): Promise<Post> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: "hello",
        id: id,
      });
    }, 3000);
  });
}

export default function Post({ post }: { post: Post }) {
  return (
    <>
      <div>{post.title}</div>
      <ul>
        <Link href={`/ssr/${post.id + 1}`}>{post.id + 1}</Link>
      </ul>
    </>
  );
}

// path에 있는 정보로 비동기 요청을 보낸 뒤, 해당 정보로 서버 사이드 렌더링을 할 수 있다.
// - 즉, 서버 사이드 렌더링은 getServerSideProps의 실행과 함께 이루어진다.
export const getServerSideProps: GetServerSideProps = async (context) => {
  const {
    query: { id = "" },
  } = context;

  const post = await fetchPost(+id);

  // redirect를 이용하여 조건에 따라 다른 페이지로 보낼수도 있다.
  // - 클라이언트에서 처리하는 것보다 더 자연스럽게 페이지를 전환할 수 있는 장점이 있다.
  if (!post) {
    redirect: {
      destination: "/404";
    }
  }

  return {
    props: { post },
  };
};

// getServerSideProps
// - 서버에서 실행되는 함수이며 해당 함수가 있다면 무조건 페이지 진입 전에 이 함수를 실행한다.
// - 서버 사이드에서 반드시 실행되는 페이지이기 때문에
// - 1. window에 접근하지 못한다.
// - 2. fetch 요청을 할 때, 완전한 주소(protocol, domain)을 제공해야 한다. 브라우저와 다르게 서버는 자신의 호스트를 유추할 수 없기 때문이다.
// - 3. 에러가 발생한다면 500.tsx와 같이 미리 정의해 둔 에러 페이지로 리다이렉트된다.
// - 4. 이 함수가 종료될 때까지 브라우저는 블로킹되기 때문에, 꼭 필요한 과정이 아니라면 클라이언트에서 호출하는 것이 더 유리할수도 있다.

// - ƒ /ssr/[id]                             328 B            79 kB

// index.html
// - props 뿐만 아니라 현재 페이지 정보, query 등 다양한 정보가 <script> 태그에 담겨 있다.
// - next.js에서는 이 정보를 window 객체에 저장한다.
// - 서버에서 만든 html과 클라이언트에서 호출한 html 사이에 데이터로 인한 차이가 발생한다
// - (두 번 요청하고, 만약 결과가 같다면) 불필요한 요청이 발생한다는 단점이 있다.
// - (한 번 요청하고, 같지 결과가 같지 않다면) 유효하지 않은 지난 데이터가 보여지는 단점이 있다.
// - 즉, props 값은 json으로 제공할 수 있는 값으로 제한된다. JSON.stringify로 직렬화할 수 없는 값(class, Date) 등은 props로 제공할 수 없다.
// - 이런 경우, 클라이언트에서 작업을 하는 것이 옳다.
