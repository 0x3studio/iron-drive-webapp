export function handle(state, action) {
  switch (action.input.function) {
    case "createUser": {
      if (state.users[action.caller]) {
        throw new ContractError("There is already a contract for that user.");
      }
      const users = state.users;
      users[action.caller] = action.input.contractTxId;
      state.users = users;
      break;
    }
    case "deleteUser": {
      const users = state.users;
      delete users[action.caller];
      state.users = users;
      break;
    }
    default: {
      throw new ContractError("Unknown function.");
    }
  }
  return { state };
}
