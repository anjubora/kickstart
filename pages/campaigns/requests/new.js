import React ,{Component} from 'react';
import {Form,Button,Message,Input} from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import {Link,Router} from '../../../routes';
import Layout from '../../../components/layout';


class RequestNew extends Component{
    state={
        value:'',
        description:'',
        recipient:'',
        errorMessage:'',
        loading:false

    }
    static async getInitialProps(props){
        const {address}=props.query;
       
        return {address};
    }
   
   onSubmit=async (event)=>{
       const campaign=Campaign(this.props.address);
       const accounts=await web3.eth.getAccounts();
       this.setState({loading:true,errorMessage:''})
      try{
            await campaign.methods.createRequest(
            this.state.description,
            web3.utils.toWei(this.state.value,'ether'),
            this.state.recipient)
            .send({
          from :accounts[0],
         
      }
      )
     Router.pushRoute(`/campaigns/${this.props.address}/requests`)
    }catch(err){
        this.setState({errorMessage:err.message})


    }
    this.setState({loading:false})


   }

    render(){
        return(
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>Back</a>
                </Link>
             <h1>Create A Request</h1>
             <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                     <label>Description</label>
                     <Input
                     value={this.state.description}
                     onChange={(event)=>{this.setState({description:event.target.value})}}
                     />
                     </Form.Field>

                    <Form.Field>
                     <label>Value in ether</label>
                     <Input
                     value={this.state.value}
                     onChange={(event)=>{this.setState({value:event.target.value})}}
                     />
                     </Form.Field>

                    <Form.Field>
                     <label>Recipient</label>
                     <Input
                     value={this.state.recipient}
                     onChange={(event)=>{this.setState({recipient:event.target.value})}}
                     />
                     </Form.Field>
                     <Message error header="oops!!!" content={this.state.errorMessage}/>
                     <Button primary loading={this.state.loading}> Create! </Button>
             </Form>
             </Layout>


        )

    };
}
export default RequestNew;