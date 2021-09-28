import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
// import { IconEdit } from "src/views/icon";
import AddEditForm from "./requestForm";

class ModalForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false
    }
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }))
  }

  render() {
      const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>
      return (
      <div>
        <button type="button" class="btn btn-primary mt-2" style={{paddingLeft : "20px", paddingRight  :"20px"}} onClick={this.toggle} >                 
        Request Amount
        </button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle} close={closeBtn}>Request Amount</ModalHeader>
          <ModalBody>
            <AddEditForm
            address = {this.props.address}
              updateState={this.props.updateState}
              toggle={this.toggle}
              item={this.props.item} />
          </ModalBody>
        </Modal>
      </div>
    )
  }
}

export default ModalForm