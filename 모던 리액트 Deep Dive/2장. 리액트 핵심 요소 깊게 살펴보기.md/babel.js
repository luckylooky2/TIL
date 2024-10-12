// require을 통해 모듈을 불러오는 방법
// 1. 인자가 모듈 이름일 때
// - 현재 프로젝트 디렉토리의 node_modules => 상위 디렉토리의 node_modules => ... 찾는다
// 2. 인자가 절대 혹은 상대 경로일 때
// - 지정한 경로에서 찾는다
const Babel = require("/opt/homebrew/lib/node_modules/@babel/standalone");

Babel.registerPlugin(
  "@babel/plugin-transform-react-jsx",
  require("/opt/homebrew/lib/node_modules/@babel/plugin-transform-react-jsx")
);

const BABEL_CONFIG = {
  presets: [],
  plugins: [
    [
      "@babel/plugin-transform-react-jsx",
      {
        throwIfNamespace: false,
        runtime: "automatic",
        importSource: "custom-jsx-library",
      },
    ],
  ],
};

const SOURCE_CODE = "const ComponentA = <div>안녕하세요.</div>";

const { code } = Babel.transform(SOURCE_CODE, BABEL_CONFIG);

console.log(code);
