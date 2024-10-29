import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head />
      <body className="body">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// create-next-app으로 생성했다면 존재하지 않는다.
// - 없어도 실행에는 지장이 없는 파일이다.
// - _app.tsx가 애플리케이션 페이지 전체를 초기화한다면, _document.tsx는 애플리케이션의 html을 초기화한다.

// 특징
// - 1. <html>, <body>에 DOM 속성을 추가하고 싶다면 이 파일을 이용한다.
// - 2. _document.tsx는 "서버에서만" 실행된다. 그러므로 이벤트 핸들러와 같은 처리는 불가능하다.
// - 3. "next/head"와 "next/document"의 head가 존재하는데, 후자는 이 파일에서만 사용할 수 있고 <title>을 사용할 수 없다. 전자는 페이지에서 사용할 수 있으며 SEO에 사용될 <title>을 사용할 수 있다.
// - 4. getServerSideProps, getStaticProps 등 서버에서 사용 가능한 데이터 불러오기 함수를 사용할 수 없다.
// - 5. CSS-in-JS의 스타일을 서버에서 모아 html로 제공하는 작업을 한다.
