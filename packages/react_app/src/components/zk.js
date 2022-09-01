import { plonk } from "snarkjs";

const wasm = "CheckSecret.wasm";
const zkeyFinal = "CheckSecret_plonk_final.zkey";

export async function prove(input) {
  try {
    const { proof, publicSignals } = await plonk.fullProve(
      {
        secretHashed1: input.a,
        secretHashed2: input.b,
        secretHashed3: input.c,
        secret: input.d,
      },
      wasm,
      zkeyFinal
    );

    return {
      proof: proof,
      publicSignals: publicSignals,
    };
  } catch (err) {
    throw err;
  }
}

export async function verify(vkeyJson, publicSignals, proof) {
  if (!publicSignals || !proof) {
    return "Public Signals or Proof missing";
  }
  try {
    const res = await plonk.verify(vkeyJson, publicSignals, proof);
    if (res === true) {
      return "Verification OK";
    } else {
      return "Invalid proof";
    }
  } catch (err) {
    return "Invalid proof";
  }
}

export async function genSolCallData(proof, publicSignals) {
  let result = await plonk.exportSolidityCallData(proof, publicSignals);
  return result;
}
