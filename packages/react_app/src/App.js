import React, { useState, useEffect } from "react";
import { plonk } from "snarkjs";
import { ethers } from "ethers";

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

import CheckSecret_plonk_ABI from "./MintZKNft.json";

const CheckSecret_plonk_Address = "0x8cAAe6FDf0e8ab6823afaFE1F33DD61A40cf2FAE";
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
  const [signer, setSigner] = useState(null);
  const [signerAddress, setSignerAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [connectResult, setConnectResult] = useState(null);

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  async function connect() {
    const signer = provider.getSigner();
    setSigner(provider.getSigner());
    const signerAddress_ = await signer.getAddress();
    setSignerAddress(signerAddress_);
    console.log(signerAddress_);

    if (typeof window.ethereum !== "undefined") {
      const checkSecret_plonk_Contract = new ethers.Contract(
        CheckSecret_plonk_Address,
        CheckSecret_plonk_ABI,
        signer
      );
      console.log(signer);
      setContract(checkSecret_plonk_Contract);
      console.log(checkSecret_plonk_Contract);

      const proof =
        "0x1810f220b3cdfa72f598dc0281d8c79fb4125729a5aeac16483049ca1022c0ca14bb9b22609271e22cbb48a1b9b09780827a6c1a5a22898ec073d2e4e08dc7340d553d656bec30fc5f1d465fb17c0ad7ef5140a653db0d38c4c4bcba91e0813e246d193cfb233cd896daa7b2c7f444e291d365f53d20591d19397f2f9efcab6c22b7dd8ff02f23872c2f948b661e21c74bece04e49bb7e477a4ae1fbbb06e57523066b2b1b162dba6299c799a1ffb8d44a73eee159f562af2bd1104f9fa8d35e16db7f6859f104eb14292f4f5c0404b8d152016c729c95ccf060e77e199cc72b1c826f72ea532d2f906f2d585bde8a64b6a016cb6367ca1285532bb4e4fcf3820e93a26c14342292e66105bec8aa2d1106e072050148b6fdf160b5ffb73f2060024670f426ed0d6a973d1520472e04dae04d5b03aa6ed29a886afff969b853880433829e237662fac22b8254994009769ed74339f808e02c3ff73269798691bb0cf3379e3216e3078132d5ddc4e3f0897621ad58bc1450e7424b5d32f967a8092a5231ad90c0ed5713594f52328642fd61825f5b5ce0d767819f94a8035306d82a22cf271ca5834c50535f8a306e993f8d99d62a20595a6f21fda797cf08c4822de46a779ef6fa25c83a62c3bea58d1d104d05b1f0bbe74a2cea5c7dde6d05840a21d5be9083024d3fbed170ab82989b0a5c348207d2f6c6d100ffd810f92f4d0daf93f58e720dfc035f8e682b448af012a15a176ee4128bb6c5e1897ac0b64a21071e51abe6b4a30badd2e8cb1075a683306cec08976a6fe2456e75881a17fe10e9ffb15433ed527ec180e16e972e54fa0a9146cad2a521171e6acfce72d3b400ebdfe5dc553b9f866a691cd85d19366f398d57fcfcebef8a05ecfb3d5b73111d07889691927b404ab2ccafdfa43e2b35d50d5d075f217fb16adf34288bf4ee06df3a3f3d54b901a3b75fab9d545540328848ae774cf3a20815ca63830d2da42fd66c470eb50bc9c6f3eb74679807a0999f21c20e2e8cbbbbbf02c4b0f9fed62b4773f77f55b2e6163815ff27bb38c66fb926de0042edf0cea35bc0fdf0f63c15bad31d523c78d979f56be90059da13eaadf665a0073df72e249648ecf68097";
      const pubSig = [
        "0x05e17117c28259b1b113c6d1f5b6fc387f2eba5383c229a1dd186c4b33840b88",
        "0x09c5bb16ae50d339d401b2baac97356d0e757e051b2957b9b4c40f1055569058",
        "0x237265616fb67278475cd6f7a35ea0de20298fb1efef40c2c290bb6fe1836ae3",
      ];

      const res = await checkSecret_plonk_Contract.purchase(proof, pubSig);
      console.log("res: ", res);
    }
  }

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

  async function handleButtonConnect(e) {
    e.preventDefault();
    let result = await connect();
    setConnectResult(result);
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

          <DivFlex>
            <Button onClick={handleButtonConnect}>Connect</Button>
          </DivFlex>
        </Body>
      </Container>
    </div>
  );
}

export default App;
