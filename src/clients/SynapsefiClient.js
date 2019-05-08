export default class SynapsefiClient {

    constructor(){

        this.oauthUser = this.oauthUser.bind(this);

    }

    userId = '5ca5162f774ea600675da363';

    headers = {
        'X-SP-GATEWAY': 'client_id_QGJbT1P9ftvFLMO3CkijW6H2a0RBnlAoZrSEp08I|client_secret_XT4KszhYWfjpEagvH0cS2trbyAFRMu31iJmdeZI0',
        'X-SP-USER-IP': '127.0.0.1',
        'X-SP-USER': '|123456',
        'Content-Type': 'application/json'
    };


    getUser(userId) {
        return fetch('https://uat-api.synapsefi.com/v3.1/users/' + this.userId,{
            // method:"GET",
            headers: this.headers
        })
        .then(res => res.json());
    }

    getUsers() {
        return fetch('https://uat-api.synapsefi.com/v3.1/users',{
            method: "GET",
            headers: this.headers
        })
            .then(res => res.json());
    }

    createUser(data) {
        return fetch('https://uat-api.synapsefi.com/v3.1/users', {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .catch(error => console.error(error));
    }

    oauthUser(token,userId){
        return fetch('https://uat-api.synapsefi.com/v3.1/oauth/' + userId, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(token)
        })
            .then(res => res.json())
            .catch(error => console.error(error));
    }
}