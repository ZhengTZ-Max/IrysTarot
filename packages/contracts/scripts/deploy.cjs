import hre from "hardhat";

/**
 * Deploy the EternalCalendarNFT contract to IRYS Testnet
 */
async function main() {
  console.log("Deploying EternalCalendarNFT contract...");
  
  // Get the contract factory
  const EternalCalendarNFT = await hre.ethers.getContractFactory("EternalCalendarNFT");
  
  // Set the base URI for metadata (you can change this to your IPFS or server URL)
  const baseURI = "https://api.eternalcalendar.com/metadata/";
  
  // Deploy the contract
  const eternalCalendarNFT = await EternalCalendarNFT.deploy(baseURI);
  
  // Wait for deployment to complete
  await eternalCalendarNFT.deployed();
  
  console.log("EternalCalendarNFT deployed to:", eternalCalendarNFT.address);
  console.log("Base URI:", baseURI);
  console.log("Max Supply:", await eternalCalendarNFT.MAX_SUPPLY());
  console.log("Mint Price:", hre.ethers.utils.formatEther(await eternalCalendarNFT.mintPrice()), "IRYS");
  console.log("Minting Enabled:", await eternalCalendarNFT.mintingEnabled());
  
  // Verify contract on block explorer (optional)
  if (hre.network.name === "irys") {
    console.log("Waiting for block confirmations...");
    await eternalCalendarNFT.deployTransaction.wait(6);
    
    try {
      await hre.run("verify:verify", {
        address: eternalCalendarNFT.address,
        constructorArguments: [baseURI],
      });
      console.log("Contract verified on block explorer");
    } catch (error) {
      console.log("Contract verification failed:", error.message);
    }
  }
  
  return eternalCalendarNFT.address;
}

// Execute deployment
main()
  .then((address) => {
    console.log("Deployment completed successfully!");
    console.log("Contract Address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });