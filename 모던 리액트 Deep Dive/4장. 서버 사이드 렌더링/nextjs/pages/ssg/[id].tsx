// Static Site Generation

import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

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

// /pages/ssg/[id]가 접근 가능한 주소를 정의하는 함수이다.
// - 빌드 시점에 **가능한 모든 조합을 생성**한다.
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // 이 페이지는 /ssg/1, /ssg/2만 접근 가능한다.
    paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
    // false: paths 이외의 페이지는 404를 반환한다.
    // true / blocking: paths 이외의 페이지도 404를 반환하지 않고, 서버를 이용하여 실시간으로 빌드하여 제공한다.
    // - 미리 빌드해야 할 페이지가 너무 많은 경우에 사용한다.
    // - true: 아래 router.isFallback를 이용하여 보여줄 컴포넌트를 지정할 수 있다.
    // - blocking: 블로킹되어 빌드가 완료될 때까지 기다린다.
    fallback: true,
  };
};

// 앞에서 정의한 페이지를 기준으로 해당 페이지로 요청이 왔을 때 제공할 props를 반환한다.
// - 빌드가 되는 시점에 딱 한 번 호출된다.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params;
  const post = await fetchPost(+id);

  return {
    props: { post },
  };
};

export default function Post({ post }: { post: Post }) {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>{post.title}</div>
      <ul>
        <li>{post.id}</li>
      </ul>
    </>
  );
}

// 배포 이전에 모든 페이지를 빌드해놓으면, 배포 이후에는 따로 비동기 요청 등을 할 필요가 없기 때문에 속도가 빨라진다.
// - 미리 정적 파일로 만들어놓는 방식
// - 미리 생성되지 않은 정적 파일은 서버에서 실시간으로 생성하도록 선택할 수 있다.(fallback)

// ● /ssg/[id] (6308 ms)                   389 B            79 kB
//   ├ /ssg/1 (3102 ms)
//   └ /ssg/2 (3102 ms)
