#! /bin/bash

echo -n "📂 Please provide the name of React Project: "
read filename

if [ -z "${filename}" ]; then
    echo "❌ No filename was entered."
	exit;
elif [ -d "${filename}" ]; then
    echo "❌ A folder with the name '${filename}' already exists."
	exit;
fi

mkdir ${filename}
cd ${filename}
cat <<EOF > ${filename}.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
    <script
      src="https://unpkg.com/react@18/umd/react.development.js"
      crossorigin
    ></script>
    <script
      src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"
      crossorigin
    ></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/babel" src="${filename}.js"></script>
    <script type="text/babel">
      ReactDOM.createRoot(document.getElementById("root")).render(<App />);
    </script>
  </body>
</html>
EOF

cat <<EOF > ${filename}.js
const { useState, useEffect } = React;

function App() {
	return <div>hello</div>;
}
EOF

echo "✅ React Project successfully created."