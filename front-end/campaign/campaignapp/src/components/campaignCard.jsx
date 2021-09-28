import React, { Component } from 'react';
import Web3 from 'web3';
import Campaign from '../camapign';
import web3 from '../web3';
import ModalForm from './requestModal';

export default class CampaignCard extends Component {
    constructor() {
        super()
        this.state = {
            summary: {},
            userAddress: "",
            title: "",
            banner: "",
            description: "",
            errorMsg: null,
            contributionAmount: "",
            validAmount: "",
            successMsg: null,
            update : false
        }
    }


    dataUpdated = (updated) => {
        this.setState({update : true})
      }
    

    // ************************ Validation **********************************


    validation = () => {
        if (!this.state.contributionAmount) return this.setState({ validAmount: "is-invalid" });
        else return true;
    }

    // **************** GET ETH ACCOUNT INFO FUNCTION *******************

    getAccounts() {
        web3.eth.getAccounts((error, result) => {
            if (error) {
                console.log(error);
            } else {
                this.setState({ userAddress: result[0] });
            }
        });
    }

    requestsData = async() => {
        const campaign = await Campaign(this.props.items.address);
        const requestsCount = await campaign.methods.getRequestsCount().call();
        console.log("count", requestsCount)

        // ____________________________________________________________________________

        const requests = await Promise.all(Array(requestsCount).fill()
        .map((element, index) => { return campaign.methods.viewRequest(index).call()}));

        console.log("requestes", requests)

        // _____________________________________________________________________________
    }


    createContribution = async () => {
        this.setState({ errorMsg: null })
        let valid = await this.validation()
        if (valid === true) {
            try {
                this.setState({ loading: true })
                const campaign = Campaign(this.props.items.address);
                let rs = await campaign.methods.contribute().send(
                    {
                        from: this.state.userAddress,
                        value: web3.utils.toWei(this.state.contributionAmount, 'ether')
                    })
                    .then((result) => {
                        return result
                    })
                    .catch((error) => {
                        return error
                        // If the request fails, the Promise will reject with an error.
                    });

                if (rs.code === 4001) {
                    this.setState({ loading: false })
                    return this.setState({ errorMsg: "Opps! user decline the transaction" });
                }

                else {
                    this.getCampaignDetails()
                    this.setState({ loading: false })
                    return this.setState({ successMsg: "Thanks !!! for contribution :)" });
                }
            }
            catch (e) {
                this.setState({ errorMsg: e.message })
            }
        }
    };

    getCampaignDetails = async () => {
        this.requestsData()
        const campaign = Campaign(this.props.items.address);
        const summary = await campaign.methods.getSummery().call();
        let data = {
            minimumContrubution: summary[0],
            balance: summary[1],
            requestCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
        }
        this.setState({ summary: data })
    }

    componentDidMount() {
        if (this.props) { 
            const { title, banner, description } = this.props.items
            this.setState({ title, banner, description });
        }
        this.getCampaignDetails();
        this.getAccounts();
    }

    componentDidUpdate () {
        if(this.state.update) {
            this.getCampaignDetails()
            this.setState({update : false})
        }
    }


    render() {

        let summary = this.state.summary
        let tempUrl = null;
        if (this.state.banner !== null) {
            tempUrl = this.state.banner
        }
        else {
            tempUrl = "https://img.freepik.com/free-vector/public-relations-concept-illustrated_23-2148904290.jpg?size=626&ext=jpg"
        }
        // Connecting with metamask extention
        if (window.ethereum) {
            new Web3(window.ethereum);
            try {
                window.ethereum.enable().then(function () {
                    // User has allowed account access to DApp...
                });
            } catch (e) {
                // User has denied account access to DApp...
            }
            window.ethereum.on("accountsChanged", function (accounts) { window.location.reload(); });
        }
        // Legacy DApp Browsers
        else if (window.web3) {
            new Web3(window.web3.currentProvider);
            window.location.reload();
        }
        // Non-DApp Browsers
        else {
            alert("You have to install MetaMask !");
        }
        let totalBalance = 0
        if (summary.balance !== undefined) {
            totalBalance = web3.utils.fromWei(summary.balance, 'ether')
        }

        let errorMsg = null;
        if (this.state.errorMsg !== null) {
            errorMsg = <div class="alert alert-danger" role="alert" style={{ marginTop: "10px" }}>
                {this.state.errorMsg} </div>
        }

        let successMsg = null;
        if (this.state.successMsg !== null) {
            successMsg = <div class="alert alert-success" role="alert" style={{ marginTop: "10px" }}>
                {this.state.successMsg} </div>
        }

        return (
            <div>
                <section>
                    <header>
                        <div className="mt-3">
                            <h1>Campaign Details</h1>
                        </div>
                        <h3>manager : {summary.manager}</h3>
                    </header>
                    <div data-product-detail>
                        <div className="img-card">
                            <div className="img">
                                <i className="far fa-heart" />
                                <img src={tempUrl} />
                            </div>
                        </div>
                        <div className="product-details">
                            <div class="container">
                                <div class="row">
                                    <div class="col">
                                        <h2>{this.state.title}</h2>
                                        <p className="mt-3">{this.state.description}</p>
                                        <p className="mt-3"><i className="fas fa-star " />{summary.requestCount}  | <span>Requests</span></p>
                                        <p>Minimum Contribution</p>
                                        <p>{summary.minimumContrubution} wei</p>
                                        <h4>Total Balance</h4>
                                        <h4><span className="text-success">{totalBalance}</span>{" "}<span className="text-primary">ETH </span></h4>
                                    </div>
                                    <div class="col">
                                        <div className="mb-3">
                                            <label for="exampleFormControlInput1" class="form-label">Enter Amount</label>
                                            <input type="number" className={`form-control ${this.state.validAmount}`} placeholder="1 ether" value={this.state.contributionAmount}
                                                onChange={(e) => {
                                                    this.setState({ contributionAmount: e.target.value });
                                                    this.setState({ validAmount: "" });
                                                    this.setState({ errorMsg: null })
                                                }} />
                                            {
                                                this.state.validAmount === "is-invalid" ?
                                                    <div class="invalid-feedback">
                                                        Please provide amount.
                                                    </div> : null
                                            }
                                            {errorMsg}
                                            {successMsg}

                                            <button type="button" class="btn btn-success mt-2" disabled={this.state.loading ? true : false} onClick={this.createContribution} >
                                                {
                                                    this.state.loading ? <>
                                                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        {" "}Loading.....
                                                    </>
                                                        :
                                                        <> Contribute Amount</>
                                                }
                                            </button>
                                            <br />
                                        </div>
                                        <ModalForm updateState={this.dataUpdated} loading={this.state.loading} address={this.props.items.address} label="Request Amount" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h1>requests</h1>
                            </div>
                        </div>
                    </div>
                </section>
               
            </div>
        )
    }
}
