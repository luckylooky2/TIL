type Props = React.PropsWithChildren<{}>;

type State = {
  hasError: boolean;
  errorMessage: string;
};

class ErrorBoundary extends React.Component<Props, State> {
  private constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      errorMessage: "",
    };
  }

  // 자식 컴포넌트에서 에러가 발생하면 이 메서드가 호출되어 error 메시지 컴포넌트를 렌더링한다.
  // - 일종의 컴포넌트의 try, catch인 셈이다.
  static getDerivedStateFromError(error: Error) {
    // state를 반환한다.
    return {
      hasError: true,
      errorMessage: error.toString(),
    };
  }

  // getDerivedStateFromError => render => componentDidCatch
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log(error);
    console.log(errorInfo);
    console.log(errorInfo.componentStack); // at Child (<anonymous>:59:18)
    // 여기서
  }

  public render() {
    console.log("render");
    if (this.state.hasError) {
      return (
        <div>
          <h1>에러가 발생했습니다.</h1>
          <p>{this.state.errorMessage}</p>
        </div>
      );
    }

    // 에러가 발생하지 않았을 때에는 children을 렌더링한다.
    return this.props.children;
  }
}

function Child() {
  const [error, setError] = React.useState(false);

  const handleClick = () => {
    setError((prev) => !prev);
  };

  if (error) {
    throw new Error("Error has been occurred.");
  }

  return <button onClick={handleClick}>에러 발생</button>;
}
