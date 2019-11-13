const path=require('path');
const fs=require('fs-extra');
const solc=require('solc')
var buildpath=path.resolve(__dirname,'build');
//delete the build folder if exists
fs.removeSync(buildpath);
var contractPath=path.resolve(__dirname,'contracts','Campaign.sol')
var source=fs.readFileSync(contractPath,'utf8');
let jsonContractSource = JSON.stringify({
    language: 'Solidity',
    sources: {
      'Campaign.sol': {
          content: source,
       },
    },
    settings: { 
        outputSelection: {
            '*': {
                '*': ['abi',"evm.bytecode"],   
             // here point out the output of the compiled result
            },
        },
    },
});
//compilation  of contract
let solcResult =solc.compile(jsonContractSource);
console.log(solcResult);  
var contracts=JSON.parse(solcResult)['contracts']['Campaign.sol'];
//make the build folder if it doesn't exists
fs.ensureDirSync(buildpath);
//write the contracts in the files under the build folder
for (let contract in contracts ){
    fs.outputJSONSync(
        path.resolve(buildpath,contract+'.json'),
        contracts[contract]
    );
}

















