const { useState, useEffect, memo, useTransition } = React;

const About = memo(function AboutTab() {
  return <div>About</div>;
});

const Contact = memo(function ContactTab() {
  return <div>Contact</div>;
});

const Posts = memo(function PostsTab() {
  const items = Array.from({ length: 1500 }, (_, i) => (
    <SlowPost key={i} index={i} />
  ));

  return <ul>{items}</ul>;
});

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
