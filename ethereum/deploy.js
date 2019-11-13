const HDWalletProvider=require('truffle-hdwallet-provider')
const Web3=require('web3')
const campaignFactory=require('./build/CompaignFactory.json')
var mnemonic='minor hawk deal barrel fix close virus library hand ship hedgehog purpose'
const provider=new HDWalletProvider(
    mnemonic,
   'https://rinkeby.infura.io/v3/b28dc5d73b8946339d90e2f70dce3dbc'
   
 );
const web3 =new Web3(provider);

const deploy=async ()=>{
    
    const accounts=await web3.eth.getAccounts();
    console.log("accounts are :",accounts)
    console.log('attempting to deploy from account',accounts[0])
    const result=await new web3.eth.Contract(campaignFactory.abi)
        .deploy({data:campaignFactory.evm.bytecode.object})
        .send({from:accounts[0],gas:'6000000'})
    console.log('Contract deployed to',result.options.address);
};

deploy();