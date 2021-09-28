import React, { Component } from 'react'
import Footer from '../components/footer'
import Navbar from '../components/navbar'
import Modal from '../components/modal'
import { GetCampaign } from '../api/campaignFactory'
import { Link } from 'react-router-dom'

export default class campaigns extends Component {

  constructor() {
    super()
    this.state = {
      items : [],
      update : false
    }
  }

  dataUpdated = (updated) => {
    this.setState({update : true})
  }

  getData = async() => {
    
    let resp =  await GetCampaign()
    if (resp.success = true){
      this.setState({items : resp.data})
    }
   }

   componentDidMount () {
    this.getData()
  }

  componentDidUpdate () {
    if(this.state.update){
      this.getData()
      this.setState({update :false})
    }
  }


  render() {

    let data = this.state.items

    let tempUrl ="https://img.freepik.com/free-vector/public-relations-concept-illustrated_23-2148904290.jpg?size=626&ext=jpg"

    return (
      <div>
        <Navbar />
        <div className="container heading_bar mb-3 mt-6">
        <span style={{flex : 1  }}> <h5>Campaigns</h5> </span>  
        <Modal buttonLabel={"+ ADD"} updateState={this.dataUpdated}/>
        </div>
        <div className="container grid-container">
          <div className="row">
            { data.length  > 0 ?
              data.map((item) => {
                return (
                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="card">
                      <img className="card-img-top img-card-sz" src={item.banner !== null ? item.banner : tempUrl} alt="Card image cap" />
                      <div className="card-body">
                      <div class="container">
                        <div class="row">
                          <div class="col">
                          <h5 className="card-title">{item.title}</h5>
                          </div>
                          <div class="col" style={{color : "green"}}>
                            <span className="fr-2"><h5>{item.fund} wei</h5></span>
                          </div>
                        </div>
                        </div>
                        <br/>
                        <div class="row">
                          <div class="col">
                          <p className="card-text">{item.description}</p>
                          </div>
                          <div class="col" style={{color : "green"}}>
                          <Link to={{ pathname : `campaign/${item.campaignAddress}`, state : {address : item.campaignAddress, title : item.title, description: item.description, banner : item.banner }}}><button type="button" class="btn btn-info fr-2" style={{color : 'white'}}>More Info</button></Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
              :
              null
            }
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
