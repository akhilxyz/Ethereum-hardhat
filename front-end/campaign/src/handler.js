const CampaignController = require("./controller")
const validator = require("../lib/validator")
require('dotenv').config();

//Campaign Handler to Handle GET request of Campaign

const getCampaign = async (req, res, next) => {
    try {
        let data = await CampaignController.getCampaign()
        req.data = data
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}



const checkCampaign = async (req, res, next) => {
    try {
        if (!req.body.userAddress) throw new Error("Please Provide user address");
        let data = await CampaignController.checkCampaign(req.body.userAddress)
        req.data = data
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}
//Campaign Handler to Handle ADD request of Campaign it will validate data from req.body 
//and check if data is incoreected then it will throw error

const addCampaign = async (req, res, next) => {
    const { title, userAddress , amount, description} = req.body
    try {if (!title) throw new Error("Please Provide Campaign title");
        else if (!userAddress) throw new Error("Please Provide user address");
        else if (!amount) throw new Error("Please Provide minimum amount");
        else if (!description) throw new Error("Please Provide Campaign description");
        let data = await CampaignController.addCampaign(req.body)
        req.data = data
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

// Campaign Handler to Handle UPDATE request of Campaign

const updateCampaign = async (req, res, next) => {
    const { id, title, userAddress , amount, description, fund, campaignAddress } = req.body
    let filter = {}
    try {
        if (!id) throw new Error("Please Provide Campaign id");
        if (title) filter.title = title; 
        if (userAddress) filter.userAddress = userAddress; 
        if (amount) filter.amount = amount; 
        if (description) filter.description = description; 
        if (fund) filter.fund = fund; 
        if (campaignAddress) filter.campaignAddress = campaignAddress; 
        let data = await CampaignController.updateCampaign(id , filter)
        req.data = data
        next()
    }
    catch (e) {
        req.status = 400;
        next(e)
    }
}

// //Campaign Handler to Handle DELETE request of Campaign

// const deleteCampaign = async (req, res, next) => {
//     try {
//         if (!req.body.id) throw new Error("Please Provide Campaign id");
//         let data = await CampaignController.deleteCampaign(req.body.id)
//         req.data = data
//         next()
//     }
//     catch (e) {
//         req.status = 400;
//         next(e)
//     }
// }

// //Campaign Handler to Handle Login request of Campaign

// const loginCampaign = async (req, res, next) => {
//     if (!req.body.email) return next(new Error("Please Provide email"));
//     if (!req.body.password) return next(new Error("Please Provide Password"));
//     let filter = { email: req.body.email, password: req.body.password };
//     try {
//         let rep = await CampaignController.loginCampaign(filter)
//         if (rep.Error) {
//             req.data = null;
//             req.status = 403;
//             return next(new Error(rep.Error));
//         }
//         req.data = rep
//         next()
//     } catch (e) {
//         req.status = 400;
//         next(e)
//     }
// }


// const getCampaignProfile = async(req, res, next) => {
//     try {
//         let filter = { id: req.CampaignId }
//         let CampaignData = await CampaignController.getCampaignProfile(filter)
//         req.data = CampaignData
//         next()
//     } catch (e) {
//         req.status = 400;
//         next(e)
//     }
// }


module.exports = { getCampaign, addCampaign, checkCampaign , updateCampaign}