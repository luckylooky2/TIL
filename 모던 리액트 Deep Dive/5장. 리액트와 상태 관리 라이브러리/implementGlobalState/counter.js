let state = {
  counter: 0,
};

function get() {
  return state;
}

function set(nextState) {
  state = typeof nextState === "function" ? nextState(state) : nextState;
}
