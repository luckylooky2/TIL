interface State {
  count: number;
  id: number;
}

type Props = Record<string, never>;

// 일반 컴포넌트
// - this.setState를 호출한다면, 컴포넌트를 다시 호출하여 render를 호출
// - 상태 값의 변화가 없다면 화면을 업데이트하지 않음
class ReactComponent extends React.Component<Props, State> {
  private renderCounter = 0;

  private constructor(props: SampleProps) {
    super(props);
    this.state = {
      count: 1,
      id: 1,
    };
  }

  private handleClick = () => {
    this.setState({ count: 1, id: 1 });
  };

  public render() {
    console.log("ReactComponent", ++this.renderCounter);

    return (
      <h1>
        ReactComponent: {this.state.count}{" "}
        <button onClick={this.handleClick}>+</button>
      </h1>
    );
  }
}

// 퓨어 컴포넌트
// - this.setState를 호출한다면, 컴포넌트를 다시 호출하여 render를 호출
// - 상태 값의 변화가 없다면 화면을 업데이트하지 않음
class ReactPureComponent extends React.PureComponent<Props, State> {
  private renderCounter = 0;

  private constructor(props: SampleProps) {
    super(props);
    this.state = {
      count: 1,
      id: 1,
    };
  }

  private handleClick = () => {
    this.setState({ count: 1, id: this.state.id + 1 });
  };

  public render() {
    console.log("ReactComponent", ++this.renderCounter);

    return (
      <h1>
        ReactPureComponent: {this.state.count}{" "}
        <button onClick={this.handleClick}>+</button>
      </h1>
    );
  }
}

// PureComponent 렌더링 테스트

// test 1: State { count: number }
// - count가 그대로면 render를 호출하지 않는다.

// test 2: State { count: number, id: number }
// - 두 key의 값이 그대로면 render를 호출하지 않고, 하나만 달라져도 호출한다.

// test 3: State { count: { count: number } }
// - 안쪽 객체의 참조가 달라지면 render을 호출한다.(참조 얕은 비교)
