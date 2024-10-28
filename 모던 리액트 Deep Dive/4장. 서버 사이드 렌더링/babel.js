const Babel = require("/opt/homebrew/lib/node_modules/@babel/standalone");
const FILE = require("fs").readFileSync(process.argv[2], "utf-8");

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
        runtime: "classic",
      },
    ],
  ],
};

const { code } = Babel.transform(FILE, BABEL_CONFIG);

eval(code);
