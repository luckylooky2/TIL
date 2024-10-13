interface SampleProps {
  required?: boolean;
  text: string;
  setText: Function;
}

interface SampleState {
  count: number;
  isLimited?: boolean;
}

class SampleComponent extends React.Component<SampleProps, SampleState> {
  // 1. props: 부모 컴포넌트로 받은 상태 값
  private constructor(props: SampleProps) {
    // 부모 클래스 생성자 호출
    super(props);
    // 2. state: 현재 컴포넌트에서 정의하는 상태 값
    this.state = {
      count: 0,
      isLimited: false,
    };
    this.handleProps = this.handleProps.bind(this);
    this.divRef = React.createRef();
    console.log("Constructor called.");
  }

  // 메서드 선언 방법 1: 화살표 함수로 선언하는 방법
  private handleCount = () => {
    const newValue = this.state.count + 1;
    this.setState({ count: newValue, isLimited: newValue >= 10 });
  };

  // 메서드 선언 방법 2: 일반 함수로 선언하고 constructor에서 this 바인드를 하는 방법
  // - 화살표 함수로 선언하지 않는다면, 함수가 콜백 함수로서 호출되기 때문에 this에 전역 객체(혹은 undefined)가 바인딩된다.
  // - this에 현재 인스턴스를 고정시키기 위해 bind를 사용한다.
  private handleProps() {
    // props를 바꿔도 componentDidUpdate가 호출된다.
    this.props.setText("hi");
  }

  componentDidMount() {
    console.log("Did mount.");
  }

  // **prevProps와 prevState 인자를 사용할 수 있다.**
  componentDidUpdate(prevProps: Props, prevState: State, snapshot) {
    console.log("Did update.", prevProps, prevState);
    console.log(snapshot);
    // 내부적으로 setState를 호출하면 무한 리렌더링이 발생할 수 있다.
    // - 그러므로 prev 인자를 통해 적절히 호출을 제어하는 것이 필요할 수도 있다.
    // const newValue = prevState.count + 1;
    // this.setState({
    //   count: prevState.count + 1,
    //   isLimited: prevState.count + 1 >= 10,
    // });
  }

  componentWillUnmount() {
    console.log("Will unmount.");
  }

  // nextProps, nextState: 상태가 변경된 후의 값
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    // 상태 값이 바뀌지 않는 경우에는 이 함수가 호출되지 않는다.
    const { props: prevProps, state: prevState } = this;
    console.log(prevProps, nextProps);
    console.log(prevState, nextState);
    console.log("Should component update?");
    // false를 리턴하는 경우, 어떠한 경우에도 화면에 바뀐 상태 값을 리렌더링하지 않는다.
    // return false;
    return true;
  }

  // render를 호출하기 전에 호출된다
  // - 반환한 값은 render 함수에서 동기적으로 작동하는 것 같다.
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    console.log("getDerivedStateFromProps", nextProps, prevState);
    // return {
    //   count: 2,
    //   isLimited: false,
    // };

    // state에 영향을 미치지 않는다.
    return null;
  }

  // 어떻게 사용하는가?
  getSnapShotBeforeUpdate(prevProps: Props, prevState: State) {
    console.log("getSnapShotBeforeUpdate");
    return null;
  }

  public render() {
    console.log("render");
    const {
      props: { required, text },
      state: { count, isLimited },
    } = this;

    return (
      <h2>
        Sample Component
        <div>{required ? "필수" : "필수 아님"}</div>
        <div>문자: {text}</div>
        <div ref={this.divRef} style={{ height: 300, overflowY: "scroll" }}>
          count: {count}
        </div>
        <button onClick={this.handleCount} disabled={isLimited}>
          증가
        </button>
        <button onClick={this.handleProps} disabled={isLimited}>
          텍스트 변경
        </button>
      </h2>
    );
  }
}
