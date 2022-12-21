

export const bep20FamilyTokenContractAddress = '0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867'; // DAI TESTNET TOKEN

export const familyToken = {
  contractAddress: "0xe831F96A7a1DcE1aa2EB760b1e296c6A74CaA9d5",
  decimals: 18,
};


export const bUsdToken = {
  contractAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  decimals: 18,
};

export const bep20abi = [
  // Read-Only Functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256 balance)",
  "function decimals() view returns (uint8)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool success)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)"
];