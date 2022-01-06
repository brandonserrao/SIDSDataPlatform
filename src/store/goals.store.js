export default {
  namespaced: true,
  state: {
    activeGoal: 0,
  },
  mutations: {
    setActiveGoal(state, goal) {
      state.activeGoal = goal-1;
    },
  }
}
