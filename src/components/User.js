import React from 'react';
import SynapsefiClient from "clients/SynapsefiClient";

export default class User extends React.Component {

    synapsefiClient = new SynapsefiClient();

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            legalName: '',
            id:'',
            phoneNumber:'',
            users: [],
            usersView:[],
            createUserObject: {
                "logins": [
                    {
                        "email": "test1@synapsepay.com"
                    }
                ],
                "phone_numbers": [
                    "901.111.1111",
                    "test@synapsepay.com"
                ],
                "legal_names": [
                    "David Shin"
                ],
                "documents":[{
                    "email":"test@test.com",
                    "phone_number":"901.111.1111",
                    "ip":"::1",
                    "name":"David Shin",
                    "alias":"",
                    "entity_type":"M",
                    "entity_scope":"Arts & Entertainment",
                    "day":2,
                    "month":5,
                    "year":1989,
                    "address_street":"1 Market St.",
                    "address_city":"SF",
                    "address_subdivision":"CA",
                    "address_postal_code":"94105",
                    "address_country_code":"US",
                    "virtual_docs":[{
                        "document_value":"2222",
                        "document_type":"SSN"
                    }],
                    "physical_docs":[{
                        "document_value": "data:image/gif;base64,SUQs==",
                        "document_type": "GOVT_ID"
                    }],
                    "social_docs":[{
                        "document_value":"https://www.facebook.com/valid",
                        "document_type":"FACEBOOK"
                    }]
                }],
                "extra": {
                    "supp_id": "122eddfgbeafrfvbbb",
                    "cip_tag":1,
                    "is_business": false
                }
            },
        }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getUsers = this.getUsers.bind(this);
    };



    handleNameChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        let documents = this.state.createUserObject.documents;
        documents[0].name = this.state.value;
        this.setState({...this.state.createUserObject,documents:documents});
        console.log(this.state)
        this.synapsefiClient.createUser(this.state.createUserObject).then(
            (result) => {
                console.log(result)
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        );
    }

    // 200 Error in payload (error in payload formatting)

    getUserInfo(userId){
        this.synapsefiClient.getUser(userId).then(
            (result) => {
                this.setState({legalName:result.legal_names,id:result._id,phoneNumber:result.phone_numbers[0]})
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        );
    }

    getUsers(){
        let view = [];
        this.synapsefiClient.getUsers().then(
            (result) => {
                this.setState({
                    users: result.users
                })
                console.log(this.state.users)

                this.state.users.forEach(function(item){
                   view.push(
                       <div className="usersView">
                           <p><strong>{item.documents[0].name}</strong></p>
                           <p>{item.documents[0].id}</p>
                           <p>{item.documents[0].permission_scope}</p>
                           <br/>
                       </div>
                   )
                })
                this.setState({usersView:view})
                console.log(view)
                console.log(this.state.usersView)


            }
        )
    }

    componentDidMount() {
        this.getUserInfo("5ca5162f774ea600675da363");
    }

render(){
        return (
            <div>
                <p>Welcome <strong>{this.state.legalName}</strong></p>
                <p><strong>ID:</strong> {this.state.id}</p>
                <p><strong>Phone #:</strong> {this.state.phoneNumber}</p>
                <br/>
                <button onClick={this.getUsers}>
                    Users
                </button>
                {this.state.usersView}
                <h3>Create User</h3>
                <form>
                    <label>
                        Name:
                        <input type="text" value={this.state.value} onChange={this.handleNameChange} name="name" />
                    </label>
                    <button onClick={this.handleSubmit}>Submit</button>

                </form>
            </div>
        )
    }
}

