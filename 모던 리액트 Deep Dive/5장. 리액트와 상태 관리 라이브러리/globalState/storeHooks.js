const { useState, useEffect } = React;

// state의 값을 간단하게 관리할 수 있는 사용자 정의 훅
const useStore = (store) => {
  // store은 외부에서 생성한다.
  const [state, setState] = useState(() => store.get());

  // 컴포넌트의 렌더링을 유도한다.
  useEffect(() => {
    // 새로운 콜백을 등록하고 해당 콜백을 제거하는 함수를 반환
    // - 등록하는 콜백 함수는 store의 최신 상태값을 가져와서 해당 컴포넌트의 상태 값을 최신화한다.
    const unsubscribe = store.subscribe(() => {
      setState(store.get());
    });

    // store의 참조는 변경되지 않기 때문에 store 내부의 값이 변경되어도 useEffect 콜백이 실행되지는 않는다.
    console.log("unsubscribe called");
    return unsubscribe;
  }, [store]);

  return [state, store.set];
};

// 상태 값이 객체라면 필요한 프로퍼티가 아닌 다른 프로퍼티의 변경에 대해서도 구독한 컴포넌트가 렌더링이 된다.
// - 선택한 프로퍼티가 변경되었을 때만 리렌더링을 발생시키기 위해 selector 로직이 추가되었다.
const useStoreSelector = (store, selector) => {
  // selector: store 상태에서 어떤 값을 가져올지 정의하는 함수
  const [state, setState] = useState(() => selector(store.get()));

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const value = selector(store.get());
      // useState는 값이 변경되지 않으면 리렌더링을 수행하지 않으므로, selector를 이용하면 리렌더링을 막을 수 있다.
      setState(value);
    });

    return unsubscribe;
  }, [store, selector]);

  return state;
};
