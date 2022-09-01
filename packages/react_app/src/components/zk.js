import { groth16, plonk } from "snarkjs";

const wasm = "CheckSecret.wasm";
const zkeyFinalPlonk = "CheckSecret_plonk_final.zkey";
const zkeyFinalGroth16 = "CheckSecret_groth16_final.zkey";

export async function prove(input, isGroth16) {
  try {
    let proof, publicSignals;
    if (isGroth16) {
      ({ proof, publicSignals } = await groth16.fullProve(
        {
          secretHashed1: input.a,
          secretHashed2: input.b,
          secretHashed3: input.c,
          secret: input.d,
        },
        wasm,
        zkeyFinalGroth16
      ));
    } else {
      ({ proof, publicSignals } = await plonk.fullProve(
        {
          secretHashed1: input.a,
          secretHashed2: input.b,
          secretHashed3: input.c,
          secret: input.d,
        },
        wasm,
        zkeyFinalPlonk
      ));
    }

    return {
      proof: proof,
      publicSignals: publicSignals,
    };
  } catch (err) {
    throw err;
  }
}

export async function verify(vkeyJson, publicSignals, proof, isGroth16) {
  if (!publicSignals || !proof) {
    return "Public Signals or Proof missing";
  }

  try {
    let result;
    if (isGroth16) {
      result = await groth16.verify(vkeyJson, publicSignals, proof);
    } else {
      result = await plonk.verify(vkeyJson, publicSignals, proof);
    }
    if (result === true) {
      return "Verification OK";
    } else {
      return "Invalid proof";
    }
  } catch (err) {
    return "Invalid proof";
  }
}

export async function genSolCallData(proof, publicSignals, isGroth16) {
  if (!publicSignals || !proof) {
    return [false, "Public Signals or Proof missing"];
  }

  let result;
  if (isGroth16) {
    result = await groth16.exportSolidityCallData(proof, publicSignals);
  } else {
    result = await plonk.exportSolidityCallData(proof, publicSignals);
  }
  return [true, result];
}
