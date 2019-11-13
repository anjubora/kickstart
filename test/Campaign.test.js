const ganache=require('ganache-cli');
const assert=require('assert');
const mocha=require('mocha');
const Web3=require('web3');
const web3=new Web3(ganache.provider());
const campaignFactory=require('../ethereum/build/CompaignFactory.json')
const compiledCampaign=require('../ethereum/build/Campaign.json')
let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async ()=>{
    accounts=await web3.eth.getAccounts();
    factory=await new web3.eth.Contract(campaignFactory.abi).
    deploy(
        {data :campaignFactory.evm.bytecode.object}
    ).
    send({
        from:accounts[0],
        gas:'2000000'
    });

    await factory.methods.createContract('100').send({
        from:accounts[0],
        gas:'6000000'
    }
    );

    [campaignAddress]=await factory.methods.getDeployedCompaign().call();

    campaign =await new web3.eth.Contract(compiledCampaign.abi,campaignAddress);
   

})

describe('campaign test',async ()=>{
    it('deploy a factory and a compaign',()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    })
    it('marks caller as the campaign manager',async ()=>{

       const manager=await campaign.methods.manager().call();
       assert.equal(accounts[0],manager);
    })

    it('allows to contribute the money to people',async ()=>{
      await campaign.methods.contribute().send({from:accounts[1],value:'150'});
      const isContributor=await campaign.methods.approvers(accounts[1]);
      assert(isContributor);
    })

    it('require a minimum contribution',async ()=>{
        try{
        await  campaign.methods.contribute().send({from:accounts[1],value:'1'})
        assert(false);
        }catch(err){
            assert(err)
        }
   })

   it('allow a manager to make a payment request',async ()=>{
      
    await campaign.methods.createRequest('buy batteries',20,accounts[1]).send({
        from:accounts[0],
        gas:'1000000'
    })
    var request=await campaign.methods.requests(0).call();
    assert.equal('buy batteries',request.description);    

})

})

































