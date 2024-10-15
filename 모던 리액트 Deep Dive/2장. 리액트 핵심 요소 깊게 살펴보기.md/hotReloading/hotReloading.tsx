function FunctionalComponent() {
  const [count, setCount] = React.useState(0);

  function handleClick() {
    setCount((prev) => prev + 1);
  }

  return (
    <>
      <button onClick={handleClick}>{count} + </button>
    </>
  );
}

class ClassComponent extends React.Component<{}, { count: number }> {
  private constructor(props: {}) {
    super(props);

    this.state = {
      count: 0,
    };
  }

  private handleClick = () => {
    this.setState((prev) => ({ count: prev.count + 1 }));
  };

  public render() {
    return <button onClick={this.handleClick}>{this.state.count} + </button>;
  }
}

function App() {
  return (
    <>
      <FunctionalComponent />
      <ClassComponent />
    </>
  );
}
