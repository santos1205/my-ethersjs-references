// Importando a library ethers.js
const { ethers } = require('ethers');

// Função para criação de uma nova carteira
async function createWallet() {
  // Gera uma nova carteira usando uma seed phrase
  const wallet = ethers.Wallet.createRandom();

  console.log('Wallet address:', wallet.address);
  console.log('Wallet P Key:', wallet.privateKey);
  console.log('Wallet seed phrase:', wallet.mnemonic.phrase)
}

// Chamada da função
createWallet();