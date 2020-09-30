/*
export function someMutation (state) {
}
*/
export function setLoggedIn(state, value) {
  state.loggedIn = value;
}

export function setUser(state, val) {
  state.user.uid = val.uid;
  state.user.profile = val.profile;
}
