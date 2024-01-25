const main = async () => {
  const Parkade = await hre.ethers.getContractFactory("Parkade");
  const parkade = await Parkade.deploy();

  await parkade.deployed();

  console.log("parkade deployed to:", parkade.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();