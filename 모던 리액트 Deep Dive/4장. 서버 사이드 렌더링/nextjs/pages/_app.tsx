import path from "path";
import "../styles/globals.css";
import App, { AppContext } from "next/app";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Link href="/">home</Link>
    </>
  );
}

// _app.tsx 내부에서 default export로 내보낸 함수가 애플리케이션 전체 페이지의 시작점이다.
export default MyApp;

// 할 수 있는 것들
// - 1. ErrorBoundary를 사용해 전역 에러를 처리
// - 2. 전역 CSS 선언: 여기서 import로 불러오면 애플리케이션 전체에 영향을 미친다.
// - 3. 모든 페이지에 공통으로 사용하는 데이터 제공

// 타입스크립트 config 파일 자동 생성 신기하다...

// 파일 이름 앞에 _가 붙은 파일은 파일 이름을 변경할 수 없다.

// _app.tsx에 getInitialProps을 추가하려면 반드시
MyApp.getInitialProps = async (context: AppContext) => {
  // 아래와 같은 코드가 필요하다.
  // - 다른 페이지에 있는 getInitialProps를 실행해서 반환하는 역할을 하는데, 없다면 다른 페이지의 getInitialProps가 정상적으로 실행되지 않는다.
  const appProps = await App.getInitialProps(context);
  const isServer = Boolean(context.ctx.req);
  const {
    ctx: { req },
    router: { pathname },
  } = context;

  // 클라이언트에서 실행될 때는 서버 객체에 접근할 수 없기 때문에 req는 undefined이다.

  if (
    req &&
    !req.url?.startsWith("/_next") &&
    !["/500", "/404", "/_error"].includes(pathname)
  ) {
    console.log("**do something only once at server.**");
  }

  console.log(
    `[${isServer ? "서버" : "클라이언트"}] ${context.router.pathname}에서 ${
      context.ctx?.req?.url
    }를 요청함.`
  );
  return appProps;
};
