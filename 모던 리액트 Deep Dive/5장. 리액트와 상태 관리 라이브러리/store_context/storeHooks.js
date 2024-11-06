const { useState, useEffect } = React;

const useStore = (store) => {
  const [state, setState] = useState(() => store.get());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.get());
    });

    console.log("unsubscribe called");
    return unsubscribe;
  }, [store]);

  return [state, store.set];
};
