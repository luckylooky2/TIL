const { useState } = React;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "chanhyle",
      age: 0,
    };
  }

  static childContextTypes = {
    name: PropTypes.string,
    age: PropTypes.number,
  };

  // legacy: v16.3 이후에는 createContext를 대신 사용
  // - 부모 컴포넌트가 하위 컴포넌트에 컨텍스트 데이터를 전달하기 위해 사용
  // - 즉, 컨텍스트를 제공하는 컴포넌트에서 반드시 호출
  getChildContext() {
    console.log("getChildContext");
    return this.state;
  }

  render() {
    return (
      <>
        <h3>getChildContext</h3>
        <button
          onClick={() => {
            this.setState({ ...this.state, age: this.state.age + 1 });
          }}
        >
          +
        </button>
        <div>Age: {this.state.age}</div>
        <Parent />
      </>
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
  }

  // false로 설정하면 Child는 리렌더링되지 않는다.
  // - 중요한 것은, 이 때 새로운 context가 다시 전달되지 않는다는 것이다.
  // - 즉, Child는 최신화된 this.state를 받을 수 없다.
  // - https://ko.legacy.reactjs.org/docs/legacy-context.html
  shouldComponentUpdate() {
    return false;
  }

  render() {
    console.log("parent");
    return (
      <>
        <h3>Parent</h3>
        <Child />
      </>
    );
  }
}

// context를 인자로 받아야 하기 때문에, 결합도가 높아진다.
function Child(props, context) {
  console.log("child");
  return (
    <div>
      <h3>Child</h3>
      <p>Name: {context.name}</p>
      <p>age: {context.age}</p>
    </div>
  );
}

Child.contextTypes = {
  name: PropTypes.string,
  age: PropTypes.number,
};
