import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = React.lazy(() => import('./pages/home'))
const Campaign = React.lazy(() => import('./pages/campaigns'))
const CampaignDetails = React.lazy(() => import('./pages/campaignDetails'))
const PageNotFound = React.lazy(() => import('./pages/pageNotFound'))



const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

export default class App extends Component {
  render() {
    return (
      <>
      <BrowserRouter>
      <React.Suspense fallback={loading}>
       <Switch>
         <Route exact path='/' component={Home}></Route>
         <Route exact path='/campaign' component={Campaign}></Route>
         <Route path={`/campaign/:Id`} component={CampaignDetails}></Route>         
         <Route path="/page-not-found" component={PageNotFound} />
          <Redirect to="/page-not-found" />
       </Switch>
       </React.Suspense>
      </BrowserRouter>
      </>
    )
  }
}
