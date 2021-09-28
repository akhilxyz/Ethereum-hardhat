import React, { useEffect } from 'react'
import {useHistory } from "react-router-dom";
import CampaignCard from '../components/campaignCard';
import Navbar from '../components/navbar'
import Footer from '../components/footer';

export default function CampaignDetails(props) {
  let history = useHistory();
  useEffect(() => {
    if (!props.location.state) {
      history.push("/campaigns");
    }
  }, [props])
  return (
    <>
      <Navbar />
      <CampaignCard items={props.location.state}/>
      {/* <h3>Requested topic ID: {Id}</h3> */}
      <Footer/>
    </>
  )
}
