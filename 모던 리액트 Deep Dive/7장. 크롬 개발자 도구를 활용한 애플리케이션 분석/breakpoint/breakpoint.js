const { useState, useEffect } = React;

function App() {
  return <div>hello</div>;
}

document.getElementById("changeText").addEventListener("click", () => {
  document.getElementById("text").textContent = "World";
});
