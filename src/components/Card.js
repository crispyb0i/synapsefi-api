export default class User extends React.Component {

    synapsefiClient = new SynapsefiClient();

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            legalName: '',
            id:'',
            phoneNumber:''
        }
    };



    handleChange(event) {
        this.setState({value: event.target.value});
        console.log(this.state.value)
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
        console.log(this.state)
    }

    createCard(userId){
        this.synapsefiClient.getUser(userId).then(
            (result) => {
                this.setState({legalName:result.legal_names,id:result._id,phoneNumber:result.phone_numbers[0]})
                console.log(result)
                console.log(result.legal_names[0])
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        );
    }

    componentDidMount() {
        // this.getUserInfo("5ca5162f774ea600675da363")
    }

    render(){
        return (
            <div>
                <p>Welcome {this.state.legalName}</p>
                <p>ID: {this.state.id}</p>
                <p>Phone #: {this.state.phoneNumber}</p>
                <br/>
                <h3>Update User Info</h3>
                <form>
                    <label>
                        Name:
                        <input type="text" value={this.state.value} onChange={this.handleChange} name="name" />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }
}