import React, { useState, useEffect } from "react";
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
  DivTooltip,
  DivTooltipText,
  Pre,
  Details,
  Summary,
  ZkDetails,
  DivLeftAlign,
  DetailButton,
  DivFlexInputContainer,
  DivFlexInput,
  DivFlexFormContainer,
  DivFlexForm,
  ZKDetailStatus,
  Textarea,
} from "./components";

import { prove, verify, genSolCallData } from "./components/zk";

import logo from "./assets/images/87.png";
import githubLogo from "./assets/images/GitHub-Mark-120px-plus.png";
import openseaLogo from "./assets/images/Logomark-Blue.png";

import MintZKNftAbiJson from "@nft-zk/contracts/frontend/MintZKNft.json";
import * as MintZKNftAddressJson from "@nft-zk/contracts/frontend/MintZKNft_address.json";

const MintZKNftAddress = MintZKNftAddressJson.Contract;
const vkeyJsonFile = "CheckSecret_verification_key_plonk.json";

const hashedSecret1 =
  "2659885370391636708883459370353623141128982085472165018711164208023811132296";
const hashedSecret2 =
  "4420175747054003989426052527768028062432413895992728912331985761657509285976";
const hashedSecret3 =
  "16033069969059630745700456097076759987953764636749827514225296156239583210211";

function App() {
  const [status, setStatus] = useState("");
  const [zkStatus, setZkStatus] = useState("");
  const [input, setInput] = useState({
    a: hashedSecret1,
    b: hashedSecret2,
    c: hashedSecret3,
    d: "",
  });
  const [proof, setProof] = useState(null);
  const [publicSignals, setPublicSignals] = useState();
  const [vkeyJson, setvkeyJson] = useState();
  const [solCallData, setSolCallData] = useState();
  const [secret, setSecret] = useState("");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const showStatus = (inputStatus) => {
    setStatus(inputStatus);
  };
  const showZkStatus = (inputStatus) => {
    setZkStatus(inputStatus);
  };

  async function connect() {
    showStatus("");
    let solCallData, proof, publicSignals;
    try {
      showStatus("Generating proof...");
      ({ proof, publicSignals } = await prove(input));
      setProof(proof);
      setPublicSignals(publicSignals);

      showStatus("");
    } catch (err) {
      showStatus("Secret incorrect");
      // console.log(err);
      return;
    }
    try {
      showStatus("Generating solidity call data...");
      if (!publicSignals || !proof) {
        showStatus("Public Signals or Proof missing");
        return;
      }
      solCallData = await genSolCallData(proof, publicSignals);
      setSolCallData(solCallData);
      showStatus("Solidity call data generated!");
    } catch (err) {
      showStatus("Secret incorrect");
      // console.log(err);
    }

    const signer = provider.getSigner();
    const signerAddress_ = await signer.getAddress();
    // console.log("solCallData: ", solCallData);
    // console.log("signerAddress_: ", signerAddress_);

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

        const solCallDataArray = solCallData.split(",");
        let splits = [solCallDataArray.shift(), solCallDataArray.join(",")];
        let proofSolCallData = splits[0];
        let publicSignalsSolCallData = JSON.parse(splits[1]);

        const res = await MintZKNftContract.purchase(
          proofSolCallData,
          publicSignalsSolCallData
        );
        // console.log("res: ", res);
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
    val = val[0].split(",");
    setPublicSignals(val);
  };

  async function handleButtonProve(e) {
    e.preventDefault();
    showZkStatus("Generating proof...");
    try {
      const { proof, publicSignals } = await prove(input);
      setProof(proof);
      setPublicSignals(publicSignals);

      showZkStatus("Public Signals and Proof generated");
    } catch (err) {
      // console.log(err);
      showZkStatus("Secret incorrect");
    }
  }

  async function handleButtonVerify(e) {
    e.preventDefault();
    showZkStatus("Verifying proof...");
    const res = await verify(vkeyJson, publicSignals, proof);
    showZkStatus(res);
  }

  async function handleButtonGenSolCallData(e) {
    e.preventDefault();
    showZkStatus("Generating solidity verification [arameters...");
    if (!publicSignals || !proof) {
      showZkStatus("Public Signals or Proof missing");
      return;
    }
    const solCallData = await genSolCallData(proof, publicSignals);
    setSolCallData(solCallData);
    showZkStatus("Solidity verification parameters generated!");
  }

  async function handleButtonMint(e) {
    e.preventDefault();
    await connect();
  }

  return (
    <div className="App">
      <Container>
        <Body>
          <Title>Mint AI Generated Kanji NFTs with Zero Knowledge Proofs</Title>
          <Image src={logo} alt="kanji" />
          <PriceText>Price - FREE</PriceText>

          <DivSecret>
            <LabelSecret>SECRET</LabelSecret>
            <DivTooltip>
              (Hint)
              <DivTooltipText>Try one of: 11111, 22222, 33333</DivTooltipText>
            </DivTooltip>
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
          <Link href="https://flyingnobita.com/posts/2022/05/07/mint-nft-ecdsa">
            blog post
          </Link>

          <DivLeftAlign>
            <Details>
              <Summary>ZK</Summary>
              <ZkDetails>
                <h2>Prover</h2>
                <DivFlexFormContainer>
                  <DivFlexForm onSubmit={handleButtonProve}>
                    <DivFlexInputContainer>
                      <label>Hashed Secret 1:</label>
                      <DivFlexInput
                        type="text"
                        value={input.a}
                        onChange={handleAInputChange}
                      />
                    </DivFlexInputContainer>
                    <DivFlexInputContainer>
                      <label>Hashed Secret 2:</label>
                      <DivFlexInput
                        type="text"
                        value={input.b}
                        onChange={handleBInputChange}
                      />
                    </DivFlexInputContainer>
                    <DivFlexInputContainer>
                      <label>Hashed Secret 3:</label>
                      <DivFlexInput
                        type="text"
                        value={input.c}
                        onChange={handleCInputChange}
                      />
                    </DivFlexInputContainer>
                    <DivFlexInputContainer>
                      <label>Secret Input:</label>
                      <DivFlexInput
                        type="text"
                        value={input.d}
                        onChange={handleDInputChange}
                      />
                    </DivFlexInputContainer>
                    <DetailButton type="submit" value="Prove">
                      Prove
                    </DetailButton>
                  </DivFlexForm>
                  <ZKDetailStatus>{zkStatus}</ZKDetailStatus>
                </DivFlexFormContainer>
                <h2>Verifier</h2>
                <h3>Public Signals</h3>
                <Textarea
                  defaultValue={publicSignals}
                  onChange={handlePublicSignalChanged}
                  rows="5"
                />
                <h3>Proof</h3>
                {proof != null && (
                  <DivScrollable>
                    <Pre>{JSON.stringify(proof, null, 2)}</Pre>
                  </DivScrollable>
                )}
                <h3>Verification Key</h3>
                <DivScrollable>
                  <Pre>{JSON.stringify(vkeyJson, null, 2)}</Pre>
                </DivScrollable>
                <DetailButton onClick={handleButtonVerify}>Verify</DetailButton>
                <ZKDetailStatus>{zkStatus}</ZKDetailStatus>
                <h3>Solidity Verification Parameters</h3>
                {solCallData != null && (
                  <DivScrollable>
                    <Pre>{JSON.stringify(solCallData, null, 2)}</Pre>
                  </DivScrollable>
                )}
                <DetailButton onClick={handleButtonGenSolCallData}>
                  Generate
                </DetailButton>
                {/* <DetailButton onClick={handleButtonConnect}>
                  Connect
                </DetailButton> */}
                <ZKDetailStatus>{zkStatus}</ZKDetailStatus>
              </ZkDetails>
            </Details>
          </DivLeftAlign>

          <BottomText>
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
        </Body>
      </Container>
    </div>
  );
}

export default App;
