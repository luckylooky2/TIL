interface Props {
  user: string;
  setUser: Function;
}

interface State {
  count: number;
}

function FunctionalComponent(props: Props) {
  const [counter, setCounter] = React.useState(0);
  const ref = React.useRef(0);
  const showMessage = () => {
    // 클릭 시점의 props로 출력
    alert(
      `Function: props: ${props.user}, state: ${counter}, ref: ${ref.current}`
    );
  };

  const handleClick = () => {
    setCounter(counter + 1);
    // props를 바꾸고 3초 후 props를 출력
    props.setUser("bye");
    setTimeout(showMessage, 3000);
  };

  return <button onClick={handleClick}>Follow</button>;
}

class ClassComponent extends React.Component<Props, State> {
  private constructor(props) {
    super(props);
    this.state = {
      counter: 0,
    };
  }
  private showMessage = () => {
    // 최신화된 props로 출력
    alert(`Class: props: ${this.props.user}, state: ${this.state.counter}`);
  };

  private handleClick = () => {
    this.setState({ counter: this.state.counter + 1 });
    // props를 바꾸고 3초 후 props를 출력
    this.props.setUser("bye");
    setTimeout(this.showMessage, 3000);
  };

  public render() {
    return <button onClick={this.handleClick}>Follow</button>;
  }
}

function App() {
  const [user, setUser] = React.useState("hello");
  return (
    <>
      <FunctionalComponent user={user} setUser={setUser} />
      <ClassComponent user={user} setUser={setUser} />
    </>
  );
}
