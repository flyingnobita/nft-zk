import React, { useState, useEffect } from "react";
import { plonk } from "snarkjs";
import { ethers } from "ethers";

import {
  Body,
  Button,
  Container,
  Image,
  DivFlex,
  DivSecret,
  LabelSecret,
  InputSecret,
  DivStatus,
  Title,
  BottomText,
  PriceText,
  Link,
  LinkLogoContainer,
  LinkLogo,
  DivScrollable,
  FormInputButton,
  Pre,
} from "./components";

import logo from "./assets/images/87.png";
import githubLogo from "./assets/images/GitHub-Mark-120px-plus.png";
import openseaLogo from "./assets/images/Logomark-Blue.png";

import MintZKNftAbiJson from "@nft-zk/contracts/frontend/MintZKNft.json";
import * as MintZKNftAddressJson from "@nft-zk/contracts/frontend/MintZKNft_address.json";

const MintZKNftAddress = MintZKNftAddressJson.Contract;
const wasm = "CheckSecret.wasm";
const zkeyFinal = "CheckSecret_plonk_final.zkey";
const vkeyJsonFile = "CheckSecret_verification_key_plonk.json";

function App() {
  const [status, setStatus] = useState("");
  const [input, setInput] = useState({
    a: "2659885370391636708883459370353623141128982085472165018711164208023811132296",
    b: "4420175747054003989426052527768028062432413895992728912331985761657509285976",
    c: "16033069969059630745700456097076759987953764636749827514225296156239583210211",
    d: "",
  });
  const [proof, setProof] = useState(null);
  const [publicSignals, setPublicSignals] = useState();
  const [vkeyJson, setvkeyJson] = useState();
  const [solCallData, setSolCallData] = useState();
  const [signer, setSigner] = useState(null);
  const [signerAddress, setSignerAddress] = useState("");
  const [contract, setContract] = useState(null);
  const [connectResult, setConnectResult] = useState(null);
  const [secret, setSecret] = useState("");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const showStatus = (inputStatus) => {
    setStatus(inputStatus);
  };

  async function connect() {
    showStatus("");
    let solCallData;
    try {
      const { proof, publicSignals } = await prove(input);
      solCallData = await genSolCallData(proof, publicSignals);
    } catch (err) {
      console.log(err);
    }

    const signer = provider.getSigner();
    setSigner(provider.getSigner());
    const signerAddress_ = await signer.getAddress();
    setSignerAddress(signerAddress_);
    console.log("solCallData: ", solCallData);
    console.log("signerAddress_: ", signerAddress_);

    if (
      solCallData &&
      signerAddress_ &&
      typeof window.ethereum !== "undefined"
    ) {
      showStatus("Minting");
      try {
        const MintZKNftContract = new ethers.Contract(
          MintZKNftAddress,
          MintZKNftAbiJson,
          signer
        );
        setContract(MintZKNftContract);

        const solCallDataArray = solCallData.split(",");
        let splits = [solCallDataArray.shift(), solCallDataArray.join(",")];
        let proofSolCallData = splits[0];
        let publicSignalsSolCallData = JSON.parse(splits[1]);

        const res = await MintZKNftContract.purchase(
          proofSolCallData,
          publicSignalsSolCallData
        );
        console.log("res: ", res);
        if (res.hash) {
          showStatus("Minting success!");
        }
      } catch (err) {
        // console.log("err: ", err);
        // console.log("err.name: ", err.name);
        // console.log("err.code: ", err.code);
        // console.log("err.message: ", err.message);
        // console.log("err.data: ", err.data);
        // console.log("typeof(err.message): ", typeof err.message);

        if (!err.message) {
          if (
            err.data.message.includes(
              "Error: VM Exception while processing transaction"
            )
          ) {
            try {
              // await method.estimateGas(transaction);
              showStatus("Unknown error. Please try again.");
            } catch (err2) {
              if (err2.message.includes("Kanji:")) {
                showStatus(err2.message);
              }
            }
          } else {
            showStatus(err);
          }
        } else if (err.message.includes("Kanji: ")) {
          const innerErrorMsg = err.message.split("\n")[3];
          var contractError = innerErrorMsg.split("Kanji: ").pop();
          contractError = contractError.substring(0, contractError.length - 2);

          showStatus(contractError);
        } else if (
          err.message ===
          "MetaMask Tx Signature: User denied transaction signature."
        ) {
          showStatus("You cancelled the transaction");
        } else if (err.message.includes("execution reverted: ")) {
          showStatus(
            err.message
              .split("execution reverted: ")[1]
              .replace(/"/g, "\n")
              .split("\n")[0]
          );
        } else if (err.message.includes("insufficient funds")) {
          showStatus("Insufficient funds");
        } else if (err.message.includes("[object Object]")) {
        } else {
          showStatus(err.message);
        }
      }
    }
  }

  async function prove(input) {
    try {
      showStatus("Generating proof...");
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
      setProof(proof);
      setPublicSignals(publicSignals);

      showStatus("");

      return {
        proof: proof,
        publicSignals: publicSignals,
      };
    } catch (err) {
      showStatus("password wrong");
      throw err;
    }
  }

  async function verify(vkeyJson, publicSignals, proof) {
    showStatus("Verifying proof...");
    const res = await plonk.verify(vkeyJson, publicSignals, proof);

    if (res === true) {
      return "Verification OK";
    } else {
      return "Invalid proof";
    }
  }

  async function genSolCallData(proof, publicSignals) {
    showStatus("Generating Solidity call data...");
    let result = await plonk.exportSolidityCallData(proof, publicSignals);
    setSolCallData(result);
    return result;
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
    await prove(input);
  }

  async function handleButtonVerify(e) {
    e.preventDefault();
    let result = await verify(vkeyJson, publicSignals, proof);
    setStatus(result);
  }

  async function handleButtonGenSolCallData(e) {
    e.preventDefault();
    await genSolCallData();
  }

  async function handleButtonConnect(e) {
    e.preventDefault();
    let result = await connect();
    setConnectResult(result);
  }

  async function handleButtonMint(e) {
    e.preventDefault();
    let result = await connect();
    setConnectResult(result);
  }

  return (
    <div className="App">
      <Container>
        <Body>
          <Title>Mint AI Generated Kanji NFTs</Title>
          <Image src={logo} alt="kanji" />
          <PriceText>Price - FREE</PriceText>

          <DivSecret>
            <LabelSecret>SECRET</LabelSecret>
            <InputSecret
              value={secret}
              onInput={(e) => {
                setSecret(e.target.value);
                setInput((prevState) => ({
                  ...prevState,
                  d: e.target.value,
                }));
              }}
            />
          </DivSecret>

          <DivFlex>
            <Button onClick={handleButtonMint}>Mint </Button>
          </DivFlex>
          <DivStatus>{status}</DivStatus>

          <BottomText>
            <p>
              Secrets are the 80 most common pinyins{" "}
              <Link href="https://www.google.com/search?q=most+common+chinese+words+pinyin&rlz=1C1GCEA_enHK998HK998&oq=most+common+&aqs=chrome.1.69i57j69i59j0i512l8.4421j0j7">
                (hint)
              </Link>
            </p>
            <p>
              Kanji generated from{" "}
              <Link href="https://github.com/hardmaru/sketch-rnn">
                sketch-rnn
              </Link>
            </p>
          </BottomText>
          <LinkLogoContainer>
            <Link href="https://github.com/flyingnobita/nft-kanji-solidity">
              <LinkLogo src={githubLogo} alt="github" />
            </Link>
            <Link href="https://testnets.opensea.io/collection/kanji-v3">
              <LinkLogo src={openseaLogo} alt="opensea" />
            </Link>
          </LinkLogoContainer>

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
                <button type="submit" value="Prove" />
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
