const { useState, useEffect, memo, useTransition, useSyncExternalStore } =
  React;

const About = memo(function AboutTab() {
  return <div>About</div>;
});

const Contact = memo(function ContactTab() {
  return <div>Contact</div>;
});

function subscribe(callback) {
  // 첫 렌더링은 resize 이벤트와는 관계가 없다.
  // - 근데 어떻게 값이 표시될까?
  // - width1 (useSyncExternalStore)는 즉시 정확한 값을 가져오는 반면, width2 (useState 기반)는 초깃값인 0을 반환하기 때문에 값이 다르게 표시된다.
  window.addEventListener("resize", callback);

  return () => {
    window.removeEventListener("resize", callback);
  };
}

function useWindowWidthWithSyncExternalStore() {
  return useSyncExternalStore(
    subscribe,
    // 이 값이 변경될 때마다 구독하고 있는 컴포넌트를 리렌더링한다.
    function getSnapshot() {
      console.log("getSnapshot");
      return window.innerWidth;
    },
    () => 0
  );
}

function useWindowWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // 처음 렌더링될 때 resize 이벤트와는 관계가 없다.
    function handleResize() {
      console.log("handleResize");
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

const Posts = memo(function PostsTab() {
  const width1 = useWindowWidthWithSyncExternalStore();
  const width2 = useWindowWidth();
  // width1이 변경될 때 리렌더링 1번, width2가 변경될 때 리렌더링 1번
  console.log(width1, width2);
  const items = Array.from({ length: 1500 }, (_, i) => (
    <SlowPost key={i} index={i} />
  ));

  return (
    <>
      <div>useSyncExternalStore: {width1}px</div>
      <div>useState: {width2}px</div>
      <ul>{items}</ul>
    </>
  );
});

// tearing 현상 발생
// - width1은 렌더링 이후 정확한 값을 가져온 반면, 사용하지 않은 쪽은 값이 0으로 표시된다.

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {
    // Artificial delay -- do nothing for 100ms
  }
  return <li>Post #{index + 1}</li>;
}

function TabButton({ isActive, children, onClick }) {
  return (
    <button onClick={onClick}>
      {isActive ? <strong>{children}</strong> : children}
    </button>
  );
}

// 렌더링이 블로킹되지 않고 비동기적으로 렌더링된다.
function App() {
  const [tab, setTab] = useState("about");
  const [isPending, startTransition] = useTransition();

  function selectTab(nextTab) {
    // 상태 업데이트와 관련이 없는 코드는 포함하지 않는다.
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <TabButton isActive={tab === "about"} onClick={() => selectTab("about")}>
        About
      </TabButton>
      <TabButton isActive={tab === "posts"} onClick={() => selectTab("posts")}>
        Posts (slow)
      </TabButton>
      <TabButton
        isActive={tab === "contact"}
        onClick={() => selectTab("contact")}
      >
        Contact
      </TabButton>
      <hr />
      {!isPending ? (
        <>
          {tab === "about" && <About />}
          {tab === "posts" && <Posts />}
          {tab === "contact" && <Contact />}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}

// 첫 렌더링에서 tearing이 발생하는 이유는 useSyncExternalStore와 useWindowWidth가 서로 다른 방식으로 초기값을 처리하기 때문이지, useTransition과는 직접적인 관계가 없다.
