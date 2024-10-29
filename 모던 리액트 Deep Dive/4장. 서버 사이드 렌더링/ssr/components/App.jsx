import React, { useEffect } from "react";
import Todo from "./Todo";

export default function App({ todos }) {
  useEffect(() => {
    console.log("hi");
  }, []);

  return (
    <>
      <h1>나의 할 일!</h1>
      <ul>
        {todos.map((todo, index) => (
          <Todo key={index} todo={todo} />
        ))}
      </ul>
    </>
  );
}
