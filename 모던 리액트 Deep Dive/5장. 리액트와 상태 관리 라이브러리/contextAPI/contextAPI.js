const { useState, useEffect, createContext } = React;

const UserContext = createContext();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "chanhyle",
      age: 0,
    };
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        <h3>Context API</h3>
        <button
          onClick={() => {
            this.setState({ ...this.state, age: this.state.age + 1 });
          }}
        >
          +
        </button>
        <div>Age: {this.state.age}</div>
        <Parent />
      </UserContext.Provider>
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
  }

  // false로 설정하면 마찬가지로 Child가 리렌더링되지 않는다.
  // - 하지만 context는 이와 별개로 최신화된 값이 전달된다.
  // - 신기하다.
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

class Child extends React.Component {
  render() {
    console.log("child");
    return (
      <UserContext.Consumer>
        {(state) => (
          <div>
            <h3>Child</h3>
            <p>Name: {state.name}</p>
            <p>age: {state.age}</p>
          </div>
        )}
      </UserContext.Consumer>
    );
  }
}
