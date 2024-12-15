import { ethers } from 'hardhat';
import { writeFileSync } from 'fs';

async function main(): Promise<void> {
  // Deploy the ERC2771Forwarder contract
  console.log("Deploying ERC2771Forwarder...");
  const forwarder = await ethers.deployContract("ERC2771Forwarder", ["ERC2771Forwarder"]);
  await forwarder.waitForDeployment(); // Wait for the deployment to complete
  const forwarderAddress = await forwarder.getAddress();
  console.log("ERC2771Forwarder deployed to:", forwarderAddress);

  // Deploy the Registry contract
  console.log("Deploying Registry...");
  const registry = await ethers.deployContract("Registry", [forwarderAddress]);
  await registry.waitForDeployment(); // Wait for the deployment to complete
  const registryAddress = await registry.getAddress();
  console.log("Registry deployed to:", registryAddress);

  // Save deployment information to a file
  const deploymentInfo = {
    ERC2771Forwarder: forwarderAddress,
    Registry: registryAddress,
  };

  writeFileSync('deploy.json', JSON.stringify(deploymentInfo, null, 2));

  console.log("Deployment info saved to deploy.json");
}

// Proper error handling
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
