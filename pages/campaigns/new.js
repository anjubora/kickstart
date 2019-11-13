import React,{Component} from 'react';
import Layout from '../../components/layout';
import {Form,Button,Input,Message} from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import factory from '../../ethereum/factory'
import {Router} from '../../routes'

class CampaignNew extends  Component{
    state={
        minimumContribution :'',
        errorMessage:'',
        loading:false
    };

    onSubmit=async (event)=>  {
        event.preventDefault();
        this.setState({loading:true,errorMessage:''})
        try{
        const accounts= await web3.eth.getAccounts();
        console.log(accounts)
        await factory.methods.createContract(this.state.minimumContribution)
        .send({
            from:accounts[0]
        })
        Router.pushRoute('/')
    }catch(err){
        this.setState({errorMessage:err.message})
    }
    this.setState({loading:false})

    }

    render(){
       return(
        <Layout> 
        <h1>Create a Campain</h1>
        <Form onSubmit={this.onSubmit}  error={!!this.state.errorMessage}>
        <Form.Field >
            <label>Minimum Contribution</label>
            <Input 
            label="wei" 
            labelPosition="right"
            placeholder='Enter the minimum contribution'
            value={this.state.minimumContribution}
            onChange={event=>{
                this.setState({minimumContribution:event.target.value})
            }}
            />
            
        </Form.Field>
        <Message error>
            <Message.Header>Ooops!!</Message.Header>
            <p>{this.state.errorMessage}</p>
            </Message>
        <Button  loading={this.state.loading} primary >Create!</Button>

        </Form>
        </Layout>
        );

};
}

export default CampaignNew; 