import React, { Component } from 'react'
import Web3 from "web3";
import web3 from "../web3";
import campaign from './campaigns'
import { AddCampaign } from '../api/campaignFactory';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default class App extends Component {
  constructor() {
    super()
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
    }
  }

  // **************** ON CHANGE FUNCTION *******************

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    this.setState({ errorMsg: null });
    this.setState({ successMsg: null });
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
    if(typeof url !== 'string') return false;
    return(url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) != null);
  }

  validation = () => {
    if (!this.state.title) return this.setState({errorMsg : "Please Provide Campaign title"});
    else if (!this.state.amount) return this.setState({errorMsg : "Please Provide minimum amount"});
    else if (! this.isNumeric(this.state.amount)) return this.setState({errorMsg : "Please Provide Valid Minimum Amount"})
    else if (this.state.banner.trim().length > 0){
      if(!this.checkURL(this.state.banner)){return this.setState({errorMsg : "Please Provide Valid Banner Url Link"})}
    }
    else if (!this.state.description) return this.setState({errorMsg : "Please Provide Campaign Description"})
    else return true
  }


  // ************************ GET CONTRACT DETAILS FUNCTION *****************

  createCampaign = async () => {
    this.setState({ errorMsg: null })
    let valid = await this.validation()
    if (valid === true) {
        try {
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
                        this.setState({ successMsg: "Campaign Created Successfully !!!" })
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

    let successMsg = null;
    if (this.state.successMsg !== null) {
      successMsg = <div class="alert alert-success" role="alert" style={{ marginTop: "10px" }}>
        {this.state.successMsg} </div>
    }

    return (
      <div>
          <Navbar/>
        <div className="container-fluid splash" id="splash">
          <div className="container">
            <h1>D-Campaign</h1>
            <span className="lead">Start you campain<br /> Now</span>
            <span className="continue"><a href="#contact"><i className="fa fa-angle-down" /></a></span>
          </div>
        </div>
        <div className="container-fluid portfolio" id="portfolio">
          <div className="container cf">
            <h2 className="h2_black">Top Campaigns</h2>
            <div className="gallery">
              <div className="gallery-image"><img src="https://unsplash.it/800/450?image=250" alt="" /></div>
              <div className="gallery-image"><img src="https://unsplash.it/800/450?image=249" alt="" /></div>
              <div className="gallery-image"><img src="https://unsplash.it/800/450?image=248" alt="" /></div>
              <div className="gallery-image"><img src="https://unsplash.it/800/450?image=247" alt="" /></div>
              <div className="gallery-image"><img src="https://unsplash.it/800/450?image=239" alt="" /></div>
              <div className="gallery-image"><img src="https://unsplash.it/800/450?image=238" alt="" /></div>
            </div>
          </div>
        </div>
        <div className="container-fluid contact" id="contact">
          <div className="container">
            <form>
              <h2>Start Campaign</h2>
              <div className="row">
                <div className="col">
                  <input type="text" value={this.state.userAddress} placeholder="Recipient Address * : 0x000000000000" id="address" name="address" className="form-control" />
                </div>
                <div className="col">
                  <input type="text" value={this.state.title} onChange={this.onChange} placeholder="Title *" id="title" name="title" className="form-control" />
                </div>
              </div>
              
              <div className="row">
                <div className="col">
                  <input type="text" value={this.state.amount} onChange={this.onChange} placeholder="Minium Amount *" id="amount" name="amount" className="form-control" />
                </div>
                <div className="col">
                  <input type="text" value={this.state.banner} onChange={this.onChange} placeholder="Banner url" id="banner" name="banner" className="form-control" />
                </div>
              </div>


              <textarea value={this.state.description} onChange={this.onChange} placeholder="Description *" id="description" name="description" defaultValue={""} />
              <button onClick={this.createCampaign} class="btn btn-primary" type="button" disabled={this.state.loading ? true : false}>
                {
                  this.state.loading ? <>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    {" "}Loading...
                  </>
                    :
                    <>ENTER</>
                }
              </button>
              <br />
              {errorMsg}
              {successMsg}

              {/* <input type="submit" defaultValue="Send" /> */}
            </form>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
