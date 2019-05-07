import React from 'react';
import SynapsefiClient from "clients/SynapsefiClient";

export default class User extends React.Component {

    synapsefiClient = new SynapsefiClient();

    constructor(props) {
        super(props);
        this.state = {
            nameValue: '',
            emailValue: '',
            phoneValue: '',
            legalName: '',
            id:'',
            phoneNumber:'',
            userOauthKey:'',
            users: [],
            usersView:[],
            createUserObject: {
                "logins": [
                    {
                        "email": "test1@synapsepay.com"
                    }
                ],
                "phone_numbers": [],

                "legal_names": []
            },
        }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.oauthUser = this.oauthUser.bind(this);
    };



    handleNameChange(event) {
        this.setState({nameValue: event.target.value});
        console.log({...this.state.createUserObject})
    }

    handleEmailChange(event) {
        this.setState({emailValue: event.target.value});
    }

    handlePhoneChange(event) {
        this.setState({phoneValue: event.target.value});
        console.log({...this.state.createUserObject, logins:"WHOO", phone_numbers:"HI", legal_names:"BOO"})
    }

    handleSubmit(event) {
        event.preventDefault();
        let email = this.state.createUserObject.logins;
        let name = this.state.createUserObject.legal_names;
        let phone = this.state.createUserObject.phone_numbers;

        console.log(email,name,phone)

        email[0].email= this.state.emailValue;
        this.state.createUserObject.legal_names = [this.state.nameValue];
        this.state.createUserObject.phone_numbers = [this.state.phoneValue];

        console.log(email, name, phone)

        this.setState({...this.state.createUserObject, logins:email, phone_numbers:phone, legal_names:name});
        console.log(this.state.createUserObject)
        this.synapsefiClient.createUser(this.state.createUserObject).then(
            (result) => {
                if(result.error){
                    alert("Please fill out all the appropriate fields")
                }else{
                    alert("Success!")
                }
            }
        )
    }


    getUserInfo(userId){
        this.synapsefiClient.getUser(userId).then(
            (result) => {
                this.setState({legalName:result.legal_names, id:result._id, phoneNumber:result.phone_numbers[0]})
            }
        );
    }

    oauthUser(e){
        if(e.target.innerHTML === "UNVERIFIED"){
            let id = e.target.dataset.id;
            let tokenKey = e.target.dataset.token;
            let token = {};
            token.refresh_token = tokenKey
            console.log(token)
            console.log(e.target.dataset.id)
            this.synapsefiClient.oauthUser(token,id).then(
                (result) => {
                    let oauthKey = result.oauth_key
                    console.log(oauthKey)
                    console.log(result)
                    alert('oauth Success! OauthKey: ' + oauthKey)
                    this.setState({userOauthKey:result.oauth_key})
                }
            )
        }
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
                           <p><strong>{item.legal_names[0]}</strong></p>
                           <p><strong>ID: </strong>{item._id}</p>
                           <p><strong>EMAIL: </strong>{item.logins[0].email}</p>
                           <p data-token={item.refresh_token} data-id={item._id}>{item.permission}</p>
                           <br/><br/><br/>
                       </div>
                   )
                })
                this.setState({usersView:view})
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
                <div onClick={this.oauthUser}>
                    {this.state.usersView}
                </div>

                <h3>Create User</h3>
                <form>
                    <label>
                        Name:
                        <input type="text" value={this.state.nameValue} onChange={this.handleNameChange} name="name" />
                    </label>
                    <label>
                        Email:
                        <input type="text" value={this.state.emailValue} onChange={this.handleEmailChange} name="email" />
                    </label>
                    <label>
                        Phone Number:
                        <input type="text" value={this.state.phoneValue} onChange={this.handlePhoneChange} name="phoneNumber" />
                    </label>
                    <button onClick={this.handleSubmit}>Submit</button>

                </form>
            </div>
        )
    }
}

