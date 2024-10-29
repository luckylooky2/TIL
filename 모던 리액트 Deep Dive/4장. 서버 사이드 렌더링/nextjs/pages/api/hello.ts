import { NextApiRequest, NextApiResponse } from "next";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ name: string }>
) {
  res.status(200).json({ name: "John Doe" });
}

// 서버의 API를 정의하는 폴더
// 페이지 라우팅과 똑같이 /api/hello로 호출할 수 있다. 단, 정적 파일을 요청하는 것이 아니라 ajax 비동기 요청을 하게 된다.
// 서버에서만 사용할 수 있어서, window를 사용할 수 없다.
// - 서버에서 내려주는 데이터를 조합해 BFF 형태로 활용할 수 있다.
// - 또한, 완전한 풀스택 애플리케이션을 구축하여 CORS를 우회할 수 있다.

// BFF
// - 클라이언트별로 최적 화된 백엔드 계층을 만들어, 여러 서버의 데이터를 조합해 단일 API 엔드포인트로 응답을 내려준다.
// - 서버에 있는 다양한 데이터 소스를 조회하여 필요한 데이터를 조합해 응답할 수 있다.
// - 데이터만 가공해서 반환하므로 클라이언트의 요구사항에 맞춰 최적화된 응답을 보낼 수 있다.
// - GraphQL?
