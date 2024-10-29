/** @type {import('next').NextConfig} */
// - 자바스크립트 파일에서 intellisense 등 타입스크립트 타입 도움을 받기 위해 추가된 코드
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: false,
    styledComponents: false,
    styledJsx: false,
  },
};

module.exports = nextConfig;

// swc: 바벨의 대체제
// - rust(swc) vs. babel(js)
// - 병렬로 작업을 처리한다.
