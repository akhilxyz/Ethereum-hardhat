
import React, { Component } from 'react';
import Web3 from "web3";
import Campaign from '../camapign';

import web3 from "../web3";

export default class AddEditForm extends Component {
    constructor() {
        super();
        this.state = {

            description: "",
            recipient: "",
            amount: "",

            userAddress : "",

            errorMsg: null,
            successMsg: null,
            loading: false,

            validAmount: "",
            validRecipient: "",
            validDescription: "",
        }
    }

    // ***************** onChange *************************

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.name === 'recipient') this.setState({ validRecipient: '' })
        else if (e.target.name === 'amount') this.setState({ validAmount: '' })
        else if (e.target.name === 'description') this.setState({ validDescription: '' })
    };

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


    // *************************** VALIDATIONS *******************************


    checkURL = (url) => {
        if (typeof url !== 'string') return false;
        return (url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) != null);
    }

    validation = () => {
        if (!this.state.amount) return this.setState({ validAmount: "is-invalid" });
        // else if (!this.isNumeric(this.state.amount)) return this.setState({ validAmount: "is-invalid" })
        if (!this.state.recipient) return this.setState({ validRecipient: "is-invalid" });
        else if (!this.state.description) return this.setState({ validDescription: "is-invalid" })
        else return true
    }

    // ************************ GET CONTRACT DETAILS FUNCTION *****************

    createRequest = async () => {
        this.setState({ errorMsg: null })
        let valid = await this.validation()
        if (valid === true) {
            try {
                this.setState({ loading: true })

                let {description, amount,  recipient} = this.state

                let campaign = Campaign(this.props.address)
                let resp = await campaign.methods.createRequest(
                    description,
                    web3.utils.toWei(amount, 'ether'),
                    recipient
                ).send({ from: this.state.userAddress }).then((result) => {
                    return result
                })
                    .catch((error) => {
                        return error
                        // If the request fails, the Promise will reject with an error.
                    });


                if (resp.code === 4001) {
                    this.setState({ loading: false })
                    return this.setState({ errorMsg: "Opps! user decline the transaction" });
                }

                else {

                    // const campaignList = await campaign.methods.deployedCampaigns().call();

                    this.props.toggle()
                    this.props.updateState(true);

                    this.setState({ loading: false })
                }
            }
            catch (e) {
                this.setState({ errorMsg: e.message })
                this.setState({ loading: false })
                this.props.toggle()

            }
        }
    };


    // ************************** COMPONENT-DID-MOUNT*************************************





    async componentDidMount() {
        // console.log("OP", this.props.address)
        this.getAccounts();
    }

    render() {

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

        let errorMsg = null;
        if (this.state.errorMsg !== null) {
            errorMsg = <div class="alert alert-danger" role="alert" style={{ marginTop: "10px" }}>
                {this.state.errorMsg} </div>
        }

        let successMsg = null;
        if (this.state.successMsg !== null) {
            successMsg = <div class="alert alert-danger" role="alert" style={{ marginTop: "10px" }}>
                {this.state.successMsg} </div>
        }

        return (
            <form>


                <div className="row">
                    <div className="col">
                        <input type="text" value={this.state.amount} onChange={this.onChange} placeholder="Amount* (eg: 1 ether)" id="amount" name="amount" className={`form-control ${this.state.validAmount}`} />
                        {
                            this.state.validAmount === "is-invalid" ?
                                <div class="invalid-feedback">
                                    Please provide  amount.
                                </div> : null
                        }
                    </div>
                    <div className="col">
                        <input type="text" value={this.state.recipient} onChange={this.onChange} placeholder="Recipient Address*" name="recipient" className={`form-control ${this.state.validRecipient}`} />
                        {
                            this.state.validRecipient === "is-invalid" ?
                                <div class="invalid-feedback">
                                    Please provide recipient Address
                                </div> : null
                        }
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col">
                        <textarea className={`form-control ${this.state.validDescription}`} name="description" value={this.state.description} onChange={this.onChange} placeholder="description *" id="exampleFormControlTextarea1" rows="2"></textarea>
                        {
                            this.state.validDescription === "is-invalid" ?
                                <div class="invalid-feedback"   >
                                    Please provide a description.
                                </div> : null
                        }
                    </div>
                </div>

                {errorMsg}

                <div className="row mt-3">
                    <div className="col">
                        <button onClick={this.createRequest} className="btn btn-primary fr-2" type="button" disabled={this.state.loading ? true : false}>
                            {
                                this.state.loading ? <>
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    {" "}Loading...
                                </>
                                    :
                                    <>SUBMIT</>
                            }
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}
