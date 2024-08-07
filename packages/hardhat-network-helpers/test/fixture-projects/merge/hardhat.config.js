module.exports = {
  solidity: "0.8.3",
  networks: {
    inMemoryNode: {
      url: "http://localhost:8011",
      ethNetwork: "",
      zksync: true,
    },
    hardhat: {
      hardfork: "merge",
    },
  },
};
