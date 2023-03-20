export async function handle(state, action) {
  switch (action.input.function) {
    case "evolve": {
      if (state.canEvolve) {
        if (action.caller.toLowerCase() !== state.owner) {
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
      state.owner = action.caller.toLowerCase();
      break;
    }
    case "createUser": {
      if (await SmartWeave.kv.get(action.caller.toLowerCase())) {
        throw new ContractError("There is already a contract for that user.");
      }
      await SmartWeave.kv.put(
        action.caller.toLowerCase(),
        action.input.contractTxId
      );
      break;
    }
    case "deleteUser": {
      await SmartWeave.kv.put(action.caller.toLowerCase(), "");
      break;
    }
    default: {
      throw new ContractError("Unknown function.");
    }
  }
  return { state };
}
