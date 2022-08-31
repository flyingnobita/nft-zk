import { ethers } from "hardhat";
import DeployHelper from "./deploy_helper";
import * as PlonkVerifierAddress from "../frontend/PlonkVerifier_address.json";

const contractName: string = "MintZKNft";

async function main(): Promise<void> {

  const addressPlonkVerifier = PlonkVerifierAddress.Contract;

  const [deployer] = await ethers.getSigners();
  const deployHelper = new DeployHelper(deployer);
  await deployHelper.beforeDeploy();

  const contractFactory = await ethers.getContractFactory(
    contractName
  );
  const contract = await contractFactory.deploy(addressPlonkVerifier);
  await contract.deployed();
  await deployHelper.afterDeploy(contract, contractName);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
