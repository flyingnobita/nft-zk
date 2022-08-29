import React, { useState, useEffect } from "react";
import { plonk } from "snarkjs";

// import "./App.css";
import {
  Body,
  Button,
  Container,
  DivFlex,
  DivStatus,
  DivScrollable,
  FormInputButton,
  Pre,
} from "./components";

const wasm = "CheckSecret.wasm";
const zkeyFinal = "CheckSecret_plonk_final.zkey";
const vkeyJsonFile = "CheckSecret_verification_key_plonk.json";

async function prove(input) {
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
}

async function verify(vkeyJson, publicSignals, proof) {
  const res = await plonk.verify(vkeyJson, publicSignals, proof);

  if (res === true) {
    return "Verification OK";
  } else {
    return "Invalid proof";
  }
}

function App() {
  const [status, setStatus] = useState("");
  const [input, setInput] = useState({
    a: "2659885370391636708883459370353623141128982085472165018711164208023811132296",
    b: "4420175747054003989426052527768028062432413895992728912331985761657509285976",
    c: "16033069969059630745700456097076759987953764636749827514225296156239583210211",
    d: "11111",
  });
  const [proof, setProof] = useState(null);
  const [publicSignals, setPublicSignals] = useState();
  const [vkeyJson, setvkeyJson] = useState();
  const [solCallData, setSolCallData] = useState();

  async function loadVerificationKey() {
    await fetch(vkeyJsonFile)
      .then((response) => response.json())
      .then((data) => {
        setvkeyJson(data);
      });
  }

  useEffect(() => {
    loadVerificationKey();
  }, []);

  const handleAInputChange = (event) => {
    event.persist();
    setInput((values) => ({
      ...values,
      a: event.target.value,
    }));
  };

  const handleBInputChange = (event) => {
    event.persist();
    setInput((values) => ({
      ...values,
      b: event.target.value,
    }));
  };

  const handleCInputChange = (event) => {
    event.persist();
    setInput((values) => ({
      ...values,
      c: event.target.value,
    }));
  };

  const handleDInputChange = (event) => {
    event.persist();
    setInput((values) => ({
      ...values,
      d: event.target.value,
    }));
  };

  const handlePublicSignalChanged = (event) => {
    let val = [event.target.value];
    setPublicSignals(val);
    // console.log(val);
  };

  async function handleButtonProve(e) {
    e.preventDefault();
    let result = await prove(input);
    setProof(result.proof);
    setPublicSignals(result.publicSignals);
    // console.log("result.publicSignals: ", result.publicSignals);
    // console.log("typeof(result.publicSignals): ", typeof result.publicSignals);
  }

  async function handleButtonVerify(e) {
    e.preventDefault();
    let result = await verify(vkeyJson, publicSignals, proof);
    setStatus(result);
  }

  async function handleButtonGenSolCallData(e) {
    e.preventDefault();
    let result = await plonk.exportSolidityCallData(proof, publicSignals);
    setSolCallData(result);
  }

  return (
    <div className="App">
      <Container>
        <Body>
          <h2>Prover</h2>
          <DivFlex>
            <form onSubmit={handleButtonProve}>
              <DivFlex>
                <label>
                  a:
                  <input
                    type="text"
                    value={input.a}
                    onChange={handleAInputChange}
                  />
                </label>
              </DivFlex>
              <DivFlex>
                <label>
                  b:
                  <input
                    type="text"
                    value={input.b}
                    onChange={handleBInputChange}
                  />
                </label>
              </DivFlex>
              <DivFlex>
                <label>
                  c:
                  <input
                    type="text"
                    value={input.c}
                    onChange={handleCInputChange}
                  />
                </label>
              </DivFlex>
              <DivFlex>
                <label>
                  d:
                  <input
                    type="text"
                    value={input.d}
                    onChange={handleDInputChange}
                  />
                </label>
              </DivFlex>
              <DivFlex>
                <FormInputButton type="submit" value="Prove" />
              </DivFlex>
            </form>
          </DivFlex>

          <h2>Verifier</h2>

          <DivFlex>
            <h4>Public Signals</h4>
          </DivFlex>
          <DivFlex>
            <textarea
              defaultValue={publicSignals}
              onChange={handlePublicSignalChanged}
            />
          </DivFlex>

          <DivFlex>
            <h4>Proof</h4>
          </DivFlex>
          {proof != null && (
            <DivScrollable>
              <Pre>{JSON.stringify(proof, null, 2)}</Pre>
            </DivScrollable>
          )}

          <DivFlex>
            <h4>Verification Key</h4>
          </DivFlex>
          <DivScrollable>
            <Pre>{JSON.stringify(vkeyJson, null, 2)}</Pre>
          </DivScrollable>

          <DivFlex>
            <Button onClick={handleButtonVerify}>Verify</Button>
          </DivFlex>

          <DivStatus>{status}</DivStatus>

          <DivFlex>
            <Button onClick={handleButtonGenSolCallData}>
              Generate Solidity Call Data
            </Button>
          </DivFlex>
          <DivFlex>
            <h4>Solidity Call Data</h4>
          </DivFlex>
          {solCallData != null && (
            <DivScrollable>
              <textarea readOnly value={JSON.stringify(solCallData, null, 2)} />
            </DivScrollable>
          )}
        </Body>
      </Container>
    </div>
  );
}

export default App;
