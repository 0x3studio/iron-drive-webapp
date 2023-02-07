export function handle(state, action) {
  switch (action.input.function) {
    case "evolve": {
      if (state.canEvolve) {
        if (action.caller !== state.owner) {
          throw new ContractError(
            "Only the owner of the contract can call this function."
          );
        }
        state.evolve = action.input.value;
      }
      break;
    }
    case "initialize": {
      if (state.owner !== null) {
        throw new ContractError("This contract has already been initialized.");
      }
      state.owner = action.caller;
      break;
    }
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
