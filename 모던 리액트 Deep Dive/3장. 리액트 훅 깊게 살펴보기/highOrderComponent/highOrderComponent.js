const { useState, useEffect } = React;

// 주로 컴포넌트를 받아서 해당 컴포넌트를 실행하는 함수를 반환한다.
function withLoginComponent(Component) {
  return function (props) {
    // 고차 컴포넌트 내부에서는 인자로 받은 컴포넌트의 props를 건드리지 않아야 한다.
    // - 왜냐하면 사용하는 입장에서는 기본적으로 props가 변경되지 않았다고 생각할 것이기 때문이다.
    const { loginRequired, ...restProps } = props;

    // props에 따라 다른 컴포넌트를 보여준다.
    if (loginRequired) {
      return <>로그인이 필요합니다.</>;
    }

    return <Component {...restProps} />;
  };
}

// 로그인 여부, 다른 컴포넌트를 렌더링하는 책임은 모두 고차 컴포넌트에게 맡길 수 있어 편리하다.
// - Home 컴포넌트의 내부를 수정 및 재정의하여 확장하는 고차 컴포넌트이다.
// - 미리 정의된 동작을 추가해놓고, 런타임에 해당 동작이 실행되도록 한다.
const Component = withLoginComponent(function Home(props) {
  return <h3>{props.value}</h3>;
});

function App() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <>
      <Component value="text" loginRequired={isLogin} />
      <button onClick={() => setIsLogin(false)}>login</button>
    </>
  );
}
