const { useLayoutEffect, useEffect, useRef } = React;

const App = () => {
  const ref = useRef();

  // useLayoutEffect는 DOM을 업데이트한 다음에 실행된다는 것을 알 수 있다.(1 -> 2)
  useLayoutEffect(() => {
    console.log("useLayoutEffect:", ref.current.offsetHeight); // 100
    // useLayoutEffect가 종료될 때까지 기다린 다음에 화면에 그린다.(2 -> 3)
    for (let i = 0, target = Math.pow(10, 9) * 5; i < target; i++);
    ref.current.style.backgroundColor = "blue"; // 브라우저에 그리기 전에 적용
    console.log("useLayoutEffect: DOM 업데이트 후, 페인팅 전에 실행");
  });

  useEffect(() => {
    ref.current.style.backgroundColor = "red"; // 브라우저에 그린 후 적용
    console.log("useEffect: 페인팅 후 실행");
  });

  return (
    <div
      ref={ref}
      style={{ height: "100px", width: "100px", backgroundColor: "green" }}
    >
      Hello
    </div>
  );
};


{
	memoizedState: 0,
	// ...
	next: {
	  memoizedState: false,
	  // ...
	  next: {
		  memoizedState: {
			  tag: 192,
			  create: a        ,
		  }
	  },
	},
  }