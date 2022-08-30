import { ethers } from "hardhat";
import DeployHelper from "./deploy_helper";

const contractName: string = "PlonkVerifier";

async function main(): Promise<void> {
  const [deployer] = await ethers.getSigners();
  const deployHelper = new DeployHelper(deployer);
  await deployHelper.beforeDeploy();

  const contractFactory = await ethers.getContractFactory(
    contractName
  );
  const contract = await contractFactory.deploy();
  await contract.deployed();
  await deployHelper.afterDeploy(contract, contractName);
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
