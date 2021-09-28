
import React, { Component } from 'react';
import Web3 from "web3";
import { AddCampaign, existCampaign, updateCampaign } from '../api/campaignFactory';
import campaign from '../campaignFactory';
import mainCampaign from '../camapign';

import web3 from "../web3";

export default class AddEditForm extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            banner: "",
            userAddress: "",
            campaignAddress: "",
            description: "",
            fund: 0,
            amount: "",
            errorMsg: null,
            successMsg: null,
            loading: false,

            validTitle: "",
            validAmount: "",
            validUrl: "",
            validDescription: "",
        }
    }

    // ***************** onChange *************************

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.name === 'title') this.setState({ validTitle: '' })
        else if (e.target.name === 'amount') this.setState({ validAmount: '' })
        else if (e.target.name === 'banner') this.setState({ validUrl: '' })
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

    isNumeric = (value) => {
        return /^-?\d+$/.test(value);
    }

    checkURL = (url) => {
        if (typeof url !== 'string') return false;
        return (url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) != null);
    }

    validation = () => {
        if (!this.state.title) return this.setState({ validTitle: "is-invalid" });
        else if (!this.state.amount) return this.setState({ validAmount: "is-invalid" });
        else if (!this.isNumeric(this.state.amount)) return this.setState({ validAmount: "is-invalid" })
        else if (this.state.banner.length > 0 && this.checkURL(this.state.banner) === false) {
           return this.setState({ validUrl: "is-invalid" }) 
        }
        else if (!this.state.description) return this.setState({ validDescription: "is-invalid" })
        else return true
    }

    // ************************ GET CONTRACT DETAILS FUNCTION *****************

    createCampaign = async () => {
        this.setState({ errorMsg: null })
        let valid = await this.validation()
        if (valid === true) {
            try {

                let user_check = await existCampaign({userAddress : this.state.userAddress});
                if (user_check.success === true) {

                let data = {
                    title: this.state.title, userAddress: this.state.userAddress, amount: this.state.amount,
                    banner : this.state.banner,
                    description: this.state.description
                }
                this.setState({ loading: true })


                let rs = await campaign.methods.createCampaign(0).send({ from: this.state.userAddress }).then((result) => {
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

                    let resp = await AddCampaign(data);
                    if (resp.success === true) {
                        try {
                        const campaignList = await campaign.methods.deployedCampaigns().call();
                        if (campaignList.length > 0) {
                            let campAddress = []
                            let promises = await campaignList.map(async (it) => {
                                let new_campaign = await mainCampaign(it);
                                let manager = await new_campaign.methods.manager().call();
                                if (manager === this.state.userAddress){return it}
                                else {return null}
                            })
                            const respCamp = await Promise.all(promises);
                            respCamp.map((item) => {
                                if (item !== null) { return campAddress.push(item)}
                                else { return null;}})
                                
                            let updateContractInfo = updateCampaign({ id : resp.data[0].id ,campaignAddress : campAddress[0]})
                            if(updateContractInfo.success === true) {
                                this.setState({ successMsg: "Campaign Created Successfully !!!" })
                            }
                            this.props.toggle()
                            this.props.updateState(true);
                        }

                        }
                        catch (e) {
                            this.setState({ errorMsg: e.message })
                        }
                    }
                    else {
                        let msg = resp.message
                        this.setState({ errorMsg: msg })
                    }
                    this.setState({ loading: false })
                }
            }
            else {
                return this.setState({ errorMsg: "Sorry you can create only one campaign" });
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

        return (
            <form>
                <div class="row">
                    <div class="col">
                        <input type="text" value={this.state.userAddress} placeholder="Recipient Address * : 0x000000000000" id="address" name="address" className="form-control " />
                    </div>
                    <div class="col">
                        <input type="text" value={this.state.title} onChange={this.onChange} placeholder="Title *" id="title" name="title" className={`form-control ${this.state.validTitle}`} />
                        {
                            this.state.validTitle === "is-invalid" ?
                                <div class="invalid-feedback">
                                    Please provide a campaign title.
                                </div> : null
                        }
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col">
                        <input type="text" value={this.state.amount} onChange={this.onChange} placeholder="Minium Amount *" id="amount" name="amount" className={`form-control ${this.state.validAmount}`} />
                        {
                            this.state.validAmount === "is-invalid" ?
                                <div class="invalid-feedback">
                                    Please provide a min amount.
                                </div> : null
                        }
                    </div>
                    <div className="col">
                        <input type="text" value={this.state.banner} onChange={this.onChange} placeholder="Banner url" id="banner" name="banner" className={`form-control ${this.state.validUrl}`} />
                        {
                            this.state.validUrl === "is-invalid" ?
                                <div class="invalid-feedback">
                                    Please provide a valid banner Url.
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
                        <button onClick={this.createCampaign} className="btn btn-primary fr-2" type="button" disabled={this.state.loading ? true : false}>
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
