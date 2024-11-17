const { ethers } = require("ethers");

// api key da Infura
const API_KEY = "60a15136da5e4351ae9a67090f4e0687";

// Substitua pelo endpoint RPC da blockchain Amoy
const AMOY_RPC_URL = `https://polygon-amoy.infura.io/v3/${API_KEY}`;

// Endereço da carteira para as transações
//const walletAddress = "0x3eC80f490112ef4661c9b1E6E360ae19306201bB";       // possui nft
const walletAddress = "0xc2fd24d24897ca34d07e38c1b24050a81810918e";         // possui nft
//const walletAddress = "0xd033b6519900938Fa1A77e1a56Bd2b6B651306F6";       // NÃO possui nft

// Crie um provider usando o endpoint da Amoy
const provider = new ethers.JsonRpcProvider(AMOY_RPC_URL);

// #### PEGANDO O NÚMERO DO BLOCO MAIS RECENTE
// Função assíncrona para pegar o número do bloco mais recente
async function getLatestBlockNumber() {
  try {
    const latestBlockNumber = await provider.getBlockNumber();
    console.log("Número do bloco mais recente:", latestBlockNumber);
  } catch (error) {
    console.error("Erro ao buscar o número do bloco:", error);
  }
}

// #### PEGANDO SALDO DA REDE DE UMA CARTEIRA
async function getWalletBalance() {
  try {
    // Obtém o saldo da carteira
    const balance = await provider.getBalance(walletAddress);

    // Converte o saldo de wei para Ether (ou outra unidade se a Amoy utilizar diferente)
    const balanceInEther = ethers.formatEther(balance);

    console.log(`Saldo da carteira ${walletAddress}: ${balanceInEther} AMOY`);    
  } catch (error) {
    console.error("Erro ao obter saldo:", error);
  }
}

// #### PEGANDO SALDO DE UM TOKEN (ERC721) DE UMA CARTEIRA
async function getWalletNftBalance() {
  try {
    // endereço do contrato NFT
    const NFTContractAddress = "0x3b83e119160173597597f8976778b5e901f494e8";
    
    // abi do contrato
    const contractAbi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function name() view returns (string)",
    ];
    // carregando a instância do contrato
    const contractNft = new ethers.Contract(NFTContractAddress, contractAbi, provider);
    // obtendo a quantidade de NFTs da carteira
    const meusNfts = await contractNft.balanceOf(walletAddress);
    // obtendo o nome do token
    const nftName = await contractNft.name();
    console.log(`Meus tokens ${nftName}:`, meusNfts);
    // validação token-gated
    if (meusNfts > 0)
      console.log(`Token validado, acesso concedido para a wallet ${walletAddress}`);
    else
      console.log('você não possui o token necessário');
    
  } catch(error) {
    console.error(`erro ao buscar o contrato ${NFTContractAddress}:`, error);
  }
}

// #### PEGANDO GAS PRICE ATUAL DA REDE
async function getGasPrice() {
  try {
    // Obtém o preço do gás em wei
    const feeData = await provider.getFeeData();

    if (feeData.gasPrice) {
      // Converte o preço do gás para Gwei para facilitar a leitura
      const gasPriceGwei = ethers.formatUnits(ethers.toBigInt(feeData.gasPrice), "gwei");
      console.log(`Preço atual do gás: ${gasPriceGwei} Gwei`);
    } else {
      console.log(`Preço do gás indisponivel.`);      
    }

  } catch (error) {
    console.error("Erro ao obter o preço do gás:", error);
  }
}

// ### ESTIMANDO O GAS DE UMA TRANSAÇÃO
async function gasEstimateForTransact() {
  // montando uma transação
  const tx = {
    to: "",
    value: ethers.parseEther("0.01"),    
  }

  // estimando o gas
  const gasEstimate = await provider.estimateGas(tx);

  console.log("gas estimado para transação:", gasEstimate.toString());
}

// ### REALIZANDO TRANSAÇÃO DE ETHER
async function enviarEther() {
  // p. key para instância do signer
  const myPrivateKey = "ba53ff794a2c43111bcb5e5e2dc94d7290ae39b666f4db9b4fcccbdcfc659fee";
  // instância do signer
  const signerWallet = new ethers.Wallet(myPrivateKey, provider);
  // wallet remetente
  const receiverWallet = "0xd033b6519900938Fa1A77e1a56Bd2b6B651306F6";

  try {
     const tx = {
      to: receiverWallet,
      value: ethers.parseEther("0.01")
     }

     // estimando gas e setando na transação
     const gasEstimate = await provider.estimateGas(tx);
     tx.gasLimit = gasEstimate;
     // realizando a transação
     const txResponse = await signerWallet.sendTransaction(tx);
     console.log("transação realizada: ", txResponse.hash);
     // aguardando a confirmação da transação
     const receiptTx = await txResponse.wait();
     console.log("transação finalizada!");
  } catch(error) {
    console.error("Erro durante a transação: ", error);
  }
}

// ### DETALHANDO UMA TRANSAÇÃO
async function getTransacao() {
  const txAddress = "0x5c2aae5561c46302eeccc813211bc2b34a0d33c5cc182fcc6117785a1d2bb57c";

  try {
    const txDetail = await provider.getTransaction(txAddress);
    if (txDetail) {
      console.log("Detalhes da transação:\n", txDetail);
    } else {
      console.log("transação não encontrada.");
    }
  } catch(error) {
    console.error("erro durante a busca da transação:", error);
  }
}

// ### DISPARANDO AS FUNÇÕES
//getLatestBlockNumber();
//getWalletBalance();
//getWalletNftBalance();
//getGasPrice();
//gasEstimateForTransact();
//enviarEther();
//getTransacao();