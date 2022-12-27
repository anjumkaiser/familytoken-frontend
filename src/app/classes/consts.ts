

/* TEST NET ADDRESSES
export const familyTokenWalletAddress = '0xC05B52A6f22eB1EB1aE6Ed31F46D71f9Bf819D4d';
export const bep20FamilyTokenContractAddress = '0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867'; // DAI TESTNET TOKEN
*/


/* LIVE ADDRESSES */
export const familyTokenWalletAddress = '0x375380B018f014ddEE547f6ADBeB165ea359583d';
export const bep20FamilyTokenContractAddress = '0x2e135DFED3557376Df983703E610Ecf46cC2B7e8';


export const familyToken = {
  contractAddress: "0x2e135DFED3557376Df983703E610Ecf46cC2B7e8",
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