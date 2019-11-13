import React ,{Component} from 'react'
import Layout from '../../../components/layout';
import {Button,Table} from 'semantic-ui-react';
import {Link} from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow'
class RequestIndex extends  Component{
    static async getInitialProps(props){
        const {address} =props.query;
        const campaign=Campaign(address);
        const requestCount =await campaign.methods.getRequestsCount().call();
        const approversCount=await campaign.methods.approversCount().call();
       // console.log(requestCount)
        console.log(Array(parseInt(requestCount)).fill())
        const requests=await Promise.all(
            Array(parseInt(requestCount)).fill().map((element,index) =>{ 
                console.log("index is",index)
                console.log("elememt is",element)
                
                return campaign.methods.requests(index).call();
            })
        );
         console.log("request is",requests)
        return {address,requests,requestCount,approversCount};
    }
    renderRow(){
        return this.props.requests.map((request,index)=>{
             return <RequestRow
             key={index}
             id={index}
             request={request} 
             address={this.props.address}
             approversCount={this.props.approversCount}
             />;

        })
    }

    render(){
        const {Header,Row,HeaderCell,Body} =Table;
        return(
        <Layout><h1>Request List</h1>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
        <a>
        <Button primary floated="right" style={{marginBottom:'20px'}}>
            Add Request
        </Button>
        </a>
        </Link>

        <Table> 
            <Header>
                <Row>
                    <HeaderCell>ID</HeaderCell>
                    <HeaderCell>Desciption</HeaderCell>
                    <HeaderCell>Amount</HeaderCell>
                    <HeaderCell>Recepient</HeaderCell>
                    <HeaderCell>ApprovalCount</HeaderCell>
                    <HeaderCell>Approve</HeaderCell>
                    <HeaderCell>Finalize</HeaderCell>
                    </Row>
            </Header>
            <Body>{this.renderRow()}</Body>
            </Table>
            <div>Found {this.props.requestCount} Requests.</div>
        </Layout>
        )

    }
}
export default RequestIndex;