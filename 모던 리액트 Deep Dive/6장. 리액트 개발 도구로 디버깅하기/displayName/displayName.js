// 모듈을 익명 함수 형태로 export default 한 경우: Anonymous
// import AnonymousDefaultComponent from "./Copmonent3";
const { memo } = React;

function Component1() {
  return <div>Component1</div>;
}

const Component2 = () => {
  return <div>Component2</div>;
};

// 익명 컴포넌트를 메모한 경우: Anonymous
const MemoizedComponent = memo(() => <div>MemoizedComponent</div>);

const MemoizedComponent2 = memo(function MemoizedComponent2() {
  return <div>MemoizedComponent2</div>;
});

const MemoizedComponent3 = memo(() => <div>MemoizedComponent3</div>);

MemoizedComponent3.displayName = "MemoizedComponent3";

// 익명 컴포넌트를 반환하는 고차 컴포넌트: Anonymous
const withSampleHOC = (Component) => {
  return function () {
    return <Component />;
  };
};

// 익명 컴포넌트를 고차 컴포넌트에 전달할 때: Anonymous
const HOCComponent = withSampleHOC(() => <div>HOCComponent</div>);

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

const withSampleHOC2 = (Component) => {
  return function withSampleHOC2() {
    return <Component />;
  };
};

const HOCComponent2 = withSampleHOC2(function HOCComponent2() {
  return <div>HOCComponent2</div>;
});

// ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

const withSampleHOC3 = (Component) => {
  class WithSampleHOC3 extends React.Component {
    render() {
      return <Component />;
    }
  }

  // 같은 결과이다.
  // const WithSampleHOC3 = () => {
  //   return <Component />;
  // };

  // Q1) 아래 코드가 없어도 고차 컴포넌트의 displayName은 WithSampleHOC3가 된다. why?
  // - 기본적으로 클래스 이름을 displayName으로 사용하기 때문이다. 하지만 아래를 보면 알 수 있듯이, 여기서 결정되는 것은 아니다.
  console.log(WithSampleHOC3.displayName, WithSampleHOC3.name); // undefined WithSampleHOC3
  // WithSampleHOC3는 태그(?), 괄호 안의 값은 displayName이 된다.
  WithSampleHOC3.displayName = `WithSampleHOC3(${getDisplayName(Component)})`;
  console.log(WithSampleHOC3.displayName); // WithSampleHOC3(Component)

  // 여기서 인자 컴포넌트의 displayName은 익명이든 기명이든 undefined이다. name만 존재한다.
  console.log(Component.displayName); // undefined
  // 내부에서 인자 컴포넌트의 displayName을 지정할 수 있다.
  // Q2) 직접 지정하지 않는다면, displayName은 어느 시점에 name으로 결정되는가?
  // - React에서는 컴포넌트의 displayName이 존재하지 않는다면, 기본적으로 name 속성에서 가져온다.
  // - 언제 name으로 결정되는지는 크게 중요하지 않다. 자동으로 지정되기 이전에 변경할 수 있다는 것이 중요하다. 아마도 가장 마지막 쯤에 지정되지 않을까 싶다.
  Component.displayName = Component.name || "HOCComponent3";
  console.log(Component.displayName); // 기명 함수라면 name, 익명 함수라면 HOCComponent3

  return WithSampleHOC3;
};

// 고차 컴포넌트가 인자로 받는 익명 컴포넌트
function getDisplayName(Component) {
  return Component.displayName || Component.name || "Component";
}

const HOCComponent3 = withSampleHOC3(function () {
  return <div>HOCComponent3</div>;
});

// 여기서 설정하는 것은 고차 컴포넌트의 displayName이다.
// HOCComponent3.displayName = "withSampleHOC3";

function App() {
  return (
    <div>
      <Component1 />
      <Component2 />
      {/* <AnonymousDefaultComponent /> */}
      <MemoizedComponent />
      <MemoizedComponent2 />
      <MemoizedComponent3 />
      <HOCComponent />
      <HOCComponent2 />
      <HOCComponent3 />
    </div>
  );
}
