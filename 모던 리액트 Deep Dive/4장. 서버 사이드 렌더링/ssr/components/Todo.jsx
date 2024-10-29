import React, { useState } from "react";

export default function Todo({ todo }) {
  const { title, completed, userId, id } = todo;
  const [finished, setFinished] = useState(completed);

  function handleClick() {
    setFinished((prev) => !prev);
  }

  return (
    <li>
      <span>
        {userId}-{id} {title} {finished ? "완료" : "미완료"}
        <button onClick={handleClick}>토글</button>
      </span>
    </li>
  );
}
