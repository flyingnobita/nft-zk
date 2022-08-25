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

const wasm = "multiplier2.wasm";
const zkeyFinal = "multiplier2_plonk_final.zkey";
const vkeyJsonFile = "multiplier2_verification_key_plonk.json";

async function prove(input) {
  const { proof, publicSignals } = await plonk.fullProve(
    { a: input.a, b: input.b },
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
    a: "3",
    b: "11",
  });
  const [proof, setProof] = useState(null);
  const [publicSignals, setPublicSignals] = useState();
  const [vkeyJson, setvkeyJson] = useState();

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
              <pre>{JSON.stringify(proof, null, 2)}</pre>
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
        </Body>
      </Container>
    </div>
  );
}

export default App;
