import { ethers } from "hardhat";
import DeployHelper from "./deploy_helper";

const contractName: string = "MintZKNft";

async function main(): Promise<void> {

  const addressPlonkVerifier = "0x05323Ca3193169bD5D6441e8a737262e9008d8da";

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
