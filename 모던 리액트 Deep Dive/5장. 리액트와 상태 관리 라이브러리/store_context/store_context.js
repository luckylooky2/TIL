const { useState, useEffect, createContext, useContext } = React;

const counterStore = createStore({ count: 0 });
const counterStore2 = createStore({ count: 100 });
const counterStore3 = createStore({ counter: -1 });
const CounterStoreContext = createContext();

const CounterStoreProvider = ({ store, children }) => {
  return (
    <CounterStoreContext.Provider value={store}>
      {children}
    </CounterStoreContext.Provider>
  );
};

// 이런식으로 store를 주입하여 쉽게 교체가 가능하다.
function App() {
  return (
    <CounterStoreProvider store={counterStore2}>
      <Count />
    </CounterStoreProvider>
  );
}

function Count() {
  const store = useContext(CounterStoreContext);
  const [state, setState] = useStore(store);
  return <div>{state.count}</div>;
}
