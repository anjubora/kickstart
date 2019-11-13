import web3 from './web3';
import factory from "./build/CompaignFactory.json";
const instance=new web3.eth.Contract(factory.abi,'0x4310865a80e4F3366d561da01A8DCFc7dbc97821');
export default instance;