/*
export function someGetter (state) {
}
*/
export function isAuthenticated(state) {
  console.log("state: ", state);
  return !!state.token;
}
export function getUser(state) {
  state.user;
}
export function test(state) {
  state.authStatus;
}
