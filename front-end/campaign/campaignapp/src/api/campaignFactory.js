import fetcher from "../lib/fetcher";


const URL = 'http://localhost:4000/api/campaign';

const GetCampaign = async () => {
    let resp = await fetcher({ method: "GET", url: URL })
    return resp
}

const AddCampaign = async (data) => {
  let d = {...data};
    let resp = await fetcher({ method: "POST", url: URL, data : d })
    return resp ;
}

const existCampaign = async (data) => {
  let d = {...data};
    let resp = await fetcher({ method: "POST", url: `${URL}/exists`, data : d })
    return resp ;
}

const updateCampaign = async (data) => {
  let d = {...data};
    let resp = await fetcher({ method: "PATCH", url: `${URL}`, data : d })
    return resp ;
}


export  { GetCampaign , AddCampaign, existCampaign , updateCampaign};