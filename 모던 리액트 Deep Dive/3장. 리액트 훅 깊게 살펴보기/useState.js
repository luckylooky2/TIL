const MyReact = (function () {
  // 여기서 사용하는 global과 index는 훅의 순서를 저장하는 것과 관련이 있다.
  // - 즉, 하나의 컴포넌트에서 여러 훅을 저장하는 방법을 구현하는 것이라고 생각한다.
  const global = {};
  let index = 0;

  function useState(initialState) {
    if (!global.states) {
      global.states = [];
    }

    const currentState = global.states[index] || initialState;
    global.states[index] = currentState;

    const setState = (function () {
      let currentState = index;
      return function (value) {
        global.states[currentState] = value;
      };
    })();
    index = index + 1;

    return [currentState, setState];
  }

  function Component() {
    const [value, setValue] = useState(0);
    // ...
  }
})();

// 이 내용이 맞는가?
// 리액트의 Fiber Tree는 리렌더링과 상태 관리를 효율적으로 하기 위해 설계된 구조입니다. 이 트리를 통해 리액트는 각 컴포넌트가 가진 상태와 효과(예: useState, useEffect) 같은 정보를 효율적으로 관리하고, 컴포넌트의 리렌더링을 제어할 수 있습니다. 이제, Fiber Tree 내부에서 상태값을 어떻게 기억하는지에 대해 자세히 설명해볼게요.
// 1. Fiber의 기본 개념
// 리액트에서 컴포넌트가 렌더링될 때, 각 컴포넌트는 Fiber Node라는 객체로 변환됩니다. Fiber Node는 컴포넌트의 상태와 생명주기 정보를 저장하는 역할을 합니다. 이 Fiber Node들은 트리 구조로 연결되어, 리액트는 이 트리를 순회하며 컴포넌트의 렌더링, 업데이트 등을 수행합니다.
// 각 Fiber Node는 컴포넌트에 대한 다양한 정보를 가지고 있으며, 그 중 중요한 것들이 다음과 같습니다:
// 	•	컴포넌트의 상태 값 (state)
// 	•	컴포넌트의 props
// 	•	컴포넌트의 DOM 참조 (만약 존재하는 경우)
// 	•	부모와 자식 컴포넌트 간의 관계 (트리 구조)
// 	•	렌더링된 효과(Effects) 정보 (예: useEffect, useLayoutEffect)
// 2. 상태 값 관리
// 리액트에서 useState를 호출하면, 해당 컴포넌트는 자신이 위치한 Fiber Node에 상태 값을 저장하게 됩니다. 리액트가 각 컴포넌트를 렌더링할 때마다, 이 Fiber Node를 참조하여 이전에 저장된 상태값을 가져오고, 컴포넌트의 상태값을 업데이트하거나 유지합니다.
// 리액트는 각 컴포넌트의 상태를 “Hook” 객체로 관리하는데, 이 Hook 객체들이 Fiber Node 안에 저장됩니다. 컴포넌트가 useState, useEffect 등을 호출할 때마다, 리액트는 컴포넌트의 Fiber Node에 저장된 상태값을 참조하거나 업데이트하는 방식으로 동작합니다.
// 3. Fiber와 Hook의 관계
// 각 컴포넌트에 대한 Fiber Node는 상태와 훅의 정보를 연결 리스트(linked list) 형태로 저장합니다. 이를 통해 컴포넌트가 호출하는 여러 useState, useEffect 등은 각각의 Hook 객체로 관리되며, 이 Hook들은 Fiber Node에 연결된 형태로 존재합니다.
// 상태값을 기억하는 과정:
// 	1.	처음 렌더링:
// 	•	컴포넌트가 처음 렌더링될 때, useState가 호출되면 리액트는 해당 컴포넌트에 대한 새로운 Hook 객체를 생성하고, 이 Hook 객체에 상태값을 저장합니다.
// 	•	이 Hook 객체는 컴포넌트의 Fiber Node에 연결되며, 리액트는 이 Hook을 상태값 관리용으로 사용합니다.
// 	2.	리렌더링 시:
// 	•	컴포넌트가 다시 렌더링되면, 리액트는 컴포넌트에 대한 기존의 Fiber Node를 참조하여 이미 저장된 Hook 리스트를 다시 사용합니다.
// 	•	Hook 리스트에서 useState가 호출된 순서에 따라 상태값을 가져오고, 컴포넌트가 변경된 값을 사용할 수 있도록 합니다.
// 	3.	상태 업데이트:
// 	•	setState가 호출되면, 해당 Fiber Node의 Hook 리스트에서 해당 상태값을 가진 Hook 객체를 찾아 그 값을 업데이트합니다.
// 	•	상태가 변경되면, 리액트는 다시 해당 컴포넌트를 리렌더링하여 새로운 상태값을 반영한 UI를 그립니다.
// 4. Fiber Tree를 이용한 상태 관리
// 리액트는 컴포넌트 트리 구조를 Fiber Tree로 관리하고, 각 컴포넌트의 상태는 각 Fiber Node 내부에 저장됩니다. 이렇게 트리 구조로 관리하기 때문에, 리액트는 컴포넌트 간의 상호 관계를 쉽게 파악하고, 효율적으로 상태 업데이트와 리렌더링을 수행할 수 있습니다.
// 상태를 기억하는 핵심 과정:
// 	•	각 컴포넌트는 자신만의 Fiber Node를 가지고 있으며, 그 노드는 상태(useState)와 훅(useEffect) 등의 정보를 유지합니다.
// 	•	컴포넌트가 다시 그려질 때도(리렌더링), 리액트는 해당 Fiber Node의 Hook 리스트를 사용하여 상태값을 기억하고, 그 값을 다시 가져와 컴포넌트에 전달합니다.
// 5. 예시: Fiber Tree와 상태 관리
// 아래처럼 useState로 상태를 관리하는 컴포넌트를 보자:
// function MyComponent() {
//   const [count, setCount] = useState(0);
//   return (
//     <div>
//       <p>{count}</p>
//       <button onClick={() => setCount(count + 1)}>Increase</button>
//     </div>
//   );
// }
// 	•	처음 렌더링:
// 	•	useState(0)가 호출되면, 리액트는 MyComponent의 Fiber Node에 count 상태를 저장하는 Hook 객체를 생성하고, 이 객체를 Hook 리스트에 추가합니다.
// 	•	이 Fiber Node는 상태(count: 0)와 setCount 함수에 대한 정보를 가지게 됩니다.
// 	•	리렌더링:
// 	•	setCount가 호출되면, 리액트는 MyComponent의 Fiber Node를 통해 저장된 Hook 리스트에서 count 값을 찾아 업데이트합니다.
// 	•	그 후, 컴포넌트를 리렌더링하면서 새로운 상태값을 UI에 반영합니다.
// 6. Fiber Tree가 상태를 어떻게 유지하는가?
// 리액트는 컴포넌트가 렌더링될 때마다 새로운 Fiber Node를 생성하는 대신, 기존의 Fiber Node를 재사용합니다. 이를 통해 상태값과 훅이 저장된 정보를 유지하고, 리렌더링 시에 동일한 순서로 훅을 호출하여 상태값을 복원합니다. Fiber Tree 구조 덕분에 리액트는 컴포넌트의 상태값과 렌더링 과정을 효율적으로 관리할 수 있습니다.
// 결론
// 리액트의 Fiber Tree는 각 컴포넌트의 상태와 훅을 Fiber Node에 저장된 Hook 리스트를 통해 관리합니다. 이 구조 덕분에 리액트는 컴포넌트가 다시 렌더링될 때도 상태를 잃지 않고, 상태 업데이트를 효율적으로 처리할 수 있습니다.
