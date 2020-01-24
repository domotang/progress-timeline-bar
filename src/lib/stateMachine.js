export default function StateMachine(stateMachineDef) {
  return {
    value: stateMachineDef.initValue,
    transition(event, opts) {
      if (event === this.value) return this.value;
      var curtStateDef = stateMachineDef[this.value];
      var destStateTrans = curtStateDef.transitions[event];
      if (!destStateTrans) return this.value;
      this.value = destStateTrans.target;
      destStateTrans.action(opts);
      curtStateDef.actions.onExit();
      stateMachineDef[this.value].actions.onEnter();
      return this.value;
    },
    is(value) {
      return value === this.value;
    }
  };
}
