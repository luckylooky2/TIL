## @react-Context API, useContext

### 1. `Context.Consumer` 컴포넌트만 리렌더링

```jsx
const UserContext = React.createContext("");

const Profile = React.memo(() => {
  console.log("Profile");
  return (
    <div>
      <Greeting1 />
    </div>
  );
});

const Greeting1 = () => {
  console.log("outside Greeting1");
  return (
    <UserContext.Consumer>
      {(name) => {
        console.log("inside Greeting1");
        return <p>{`${name} 님 안녕하세요.`}</p>;
      }}
    </UserContext.Consumer>
  );
};

const App = () => {
  const [name, setName] = React.useState("");

  return (
    <div>
      <UserContext.Provider value={name}>
        <Profile />
      </UserContext.Provider>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

- `Context.Consumer`가 업데이트 될 때, `name이` 바뀌게 되는데 이 때문에 자식 컴포넌트들이 차례대로 리렌더링(`shouldComponentUpdate`) 된다.
  - "outside Greeting1"이 출력된다.
- `Greeting에서는` `context` 값이 구독하기 때문에 리렌더링되는데, 이것은 `Context.Consumer` 컴포넌트의 `shouldComponentUpdate`만 호출한다.
  - "inside Greeting1" 이 출력된다.
- `React.memo`를 추가하면 "Profile"과 "outside Greeting1"이 출력되지 않는다
- 즉 두 가지는 다른 전파 방향임을 인지해야 한다.

### 2. `Context.Consumer` vs. `useContext` 리렌더링 범위 차이

```jsx
const UserContext = React.createContext("");

const Profile = React.memo(() => {
  console.log("Profile");
  return (
    <div>
      <Greeting2 />
    </div>
  );
});

const Greeting1 = () => {
  console.log("outside Greeting1");
  return (
    <UserContext.Consumer>
      {(name) => {
        console.log("inside Greeting1");
        return <p>{`${name} 님 안녕하세요.`}</p>;
      }}
    </UserContext.Consumer>
  );
};

const Greeting2 = () => {
  console.log("Greeting2");
  const name = React.useContext(UserContext);
  return <p>{`${name} 님 안녕하세요.`}</p>;
};

const App = () => {
  const [name, setName] = React.useState("");

  return (
    <div>
      <UserContext.Provider value={name}>
        <Profile />
      </UserContext.Provider>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

- `Context.Consumer`와 `useContext는` 동작 방식이 약간 다르다
- 전자는 `Consumer` 내부 컴포넌트만 리렌더링하는 반면, 후자는 `useContext가` 포함된 함수 전체가 리렌더링된다
  - `React.memo`가 있다는 가정하에
  - 전자는 "inside Greeting1", 후자는 "Greeting2"가 출력된다.
- `React.memo`에 의해서 바깥쪽에서 전파되는 리렌더링은 막았다고 하더라도, `useContext`에서 전파되는 리렌더링은 함수 전체가 해당되기 때문에 막지 못하고 "Greeting2"가 출력되었다.
- 그렇다면 `React.memo`를 사용하지 않으면 "Greeting2"가 두 번 출력되는가? 그렇지는 않다. "Profile"과 "Greeting2"가 한 번씩만 출력된다.
- 따라서 `Context.Consumer`는 해당 컴포넌트 내의 일부 영역만을 업데이트할 수 있도록 최적화할 수 있다. 이를 통해 특정 부분의 성능을 최적화할 수 있다.

### 3. 다른 상태값에 의해 컴포넌트가 리렌더링 되는 경우

- 새로운 상태값(`button`)을 추가하였다
- 새로운 상태값에 의해 컴포넌트가 리렌더링되는 경우, 의도치 않게 `Context`가 리렌더링 되는 일이 발생할 수 있다.

```jsx
const UserContext = React.createContext("");

const Profile = React.memo(() => {
  console.log("Profile");
  return (
    <div>
      <Greeting2 />
    </div>
  );
});

const Greeting2 = () => {
  console.log("Greeting2");
  const { name } = React.useContext(UserContext); // 변경된 부분
  return <p>{`${name} 님 안녕하세요.`}</p>;
};

const App = () => {
  const [name, setName] = React.useState("");
  const [button, setButton] = React.useState(true);

  return (
    <div>
      <UserContext.Provider value={{ name }}>
        <Profile />
      </UserContext.Provider>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

- 문자열이었던 `name` 을 객체 형태 `{name : ""}` 형태로 Context에 전달하였다.
  - 버튼을 클릭하여 `button` 상태값을 수정할 때마다 UserContext.Consumer 즉, 구독하고 있는 쪽의 컴포넌트가 리렌더링 되는 문제가 발생한다.
  - "Greeting2"가 버튼을 클릭할 때마다 출력된다.
- 객체 형태로 넘겼기 때문에 이러한 문제가 발생한 것은 아니다!
- 다른 상태값에 의해 함수 컴포넌트가 리렌더링될 때, Context에 넘겨주는 객체가 새로운 객체가 되는 경우에 React는 이것을 상태값이 변했다고 인식하여 리렌더링을 발생시킨다.
  - 객체의 경우 불변성을 전제하기 때문에 상태값이 변하면 함수 컴포넌트는 리렌더링된다.
  - 여기서는 전달하는 부분에서 `{}` 로 객체를 바로 생성해서 넘겨주기 때문에 발생하는 문제이다.
- 해결
  1.  useState를 `{name : ""}`로 초기화하여 리렌더링이 발생할 때 객체를 생성하지 않는다.
  2.  어쩔 수 없이 객체를 생성하여 넘겨야 하는 경우
      - e.g.
        - `useReducer`을 이용하여 나온 상태값과 `dispatch` 함수를 같이 묶어서 넘겨야 하는 경우
        - 여러 상태값들을 묶어야 하는 경우
      - `useMemo`를 이용하여 의존성 배열에 `name`만 추가한다. 즉, `name`이 변경될 때만 새로운 객체를 생성하고, 그렇지 않다면 새로운 객체를 생성하지 못하도록 막는다.

```jsx
const UserContext = React.createContext("");

const Profile = React.memo(() => {
  console.log("Profile");
  return (
    <div>
      <Greeting2 />
    </div>
  );
});

const Greeting2 = () => {
  console.log("Greeting2");
  const { name } = React.useContext(UserContext); // 변경된 부분
  return <p>{`${name} 님 안녕하세요.`}</p>;
};

const App = () => {
  const [name, setName] = React.useState("");
  const [button, setButton] = React.useState(true);
  const memoName = React.useMemo(() => ({ name }), [name]); // 변경된 부분

  return (
    <div>
      <UserContext.Provider value={memoName}>
        <Profile />
      </UserContext.Provider>
      <input
        type="text"
        value={memoName.name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={() => setButton(!button)}>
        {button === true ? "true" : "false"}
      </button>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```
