import { NextPageContext } from "next";

function Error({ statusCode }: { statusCode: number }) {
  return (
    <p>
      {statusCode ? `서버에서 ${statusCode}` : `클라이언트에서`} 에러가
      발생했습니다.
    </p>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : "";
  return { statusCode };
};

export default Error;

// 프로젝트 전역에서 페이지 라우팅과 관련된 에러가 발생하면, 이 컴포넌트를 보여줄 수 있다.
// - 단, 개발 환경에서는 확인할 수 없고 프로덕션에서만 확인할 수 있다. => 되던데?
// - 주로 페이지 라우팅과 서버 요청 시 발생하는 에러를 처리하도록 설계되어 있어, 클라이언트 사이드에서 발생하는 특정 JavaScript 에러는 기본적으로 캐치하지 못한다.

// 기본 에러 페이지(_error.tsx, 500.tsx, 404.tsx 등)은 페이지 라우팅이 일어날 때만 표시된다.
// - 비동기 요청에서 에러가 발생하면, 위와 같은 페이지는 표시되지 않는다.
// - 별도의 클라이언트 로직을 통해 에러 응답에 따라 적절한 UI나 페이지 전환을 수행해야 한다.
// - 요약하면, 기본 에러 페이지는 페이지 라우팅의 경우에 발생한 에러에만 작동한다.
