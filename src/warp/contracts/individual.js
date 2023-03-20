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
    case "createFile": {
      if (action.caller !== state.owner) {
        throw new ContractError(
          "Only the owner of the contract can call this function."
        );
      }
      const files = state.files;
      files[action.input.file.id] = action.input.file;
      state.files = files;
      break;
    }
    case "deleteFile": {
      if (action.caller !== state.owner) {
        throw new ContractError(
          "Only the owner of the contract can call this function."
        );
      }
      const files = state.files;
      delete files[action.input.file.id];
      state.files = files;
      break;
    }
    default: {
      throw new ContractError("Unknown function.");
    }
  }
  return { state };
}
