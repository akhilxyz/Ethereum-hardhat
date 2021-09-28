const CampaignModal = require('./usecases')

// Get Campaign data 
const getCampaign = async (filters) => {
    let data = await CampaignModal.getCampaign(filters);
    let CampaignData = []
    if (data.length > 0) {
        data = data.map((Campaign) => {
            let data = { id : Campaign._id, title : Campaign.title, userAddress : Campaign.userAddress, banner : Campaign.banner || null,
                campaignAddress : Campaign.campaignAddress,description : Campaign.description , amount: Campaign.amount, fund : Campaign.fund }
                CampaignData.push(data) ;
            })
        return CampaignData ;
    }
    else return CampaignData ;
}


// Add New Campaign
const checkCampaign = async (props_userAddress) => {
    let CampaignRecord = await CampaignModal.getCampaign({ userAddress : props_userAddress});
    if (CampaignRecord.length > 0) throw new Error("Sorry !!! you can create only one Campaign")
    return {Message:"not exist"}
}


// Add New Campaign
const addCampaign = async (Campaign) => {
    // let CampaignRecord = await CampaignModal.getCampaign({ userAddress : Campaign.userAddress});
    // if (CampaignRecord.length > 0) throw new Error("Sorry !!! you can create only one Campaign")
    let saveCampaign = await CampaignModal.addCampaign(Campaign);
    let data = getCampaign({_id : saveCampaign._id})
    return data ;
}

// Upaate Campaign Information
const updateCampaign = async (id , userData) => {
    let updateCampaign = await CampaignModal.updateCampaign(id , userData);
    return updateCampaign ;
}

// // Delete User From DataBase
// const deleteUser = async (id) => {
//     let deleteUser = await userModal.deleteUser(id);
//     return deleteUser ;
// }

// // user Login 
// const loginUser = async (userData) => {
//     // Get User Records if user is registered or not
//     let userRecord = await userModal.getUser({ email: userData.email});
//     if (userRecord.length == 0) return { Error: "Invalid Credentials" }

//     // bcrypt compare Check User Password in hash is Matching with user password or not 
//     const PasswordMatch = await bcrypt.compare(userData.password, userRecord[0].password);
//     if (!PasswordMatch) return { Error: "Invalid Credentials" }

//     // jwt.sign(payload, secretOrPrivateKey, [options, callback])
//     // (Asynchronous) If a callback is supplied, the callback is called with the err or the JWT.
//     const token = jwt.sign({ userId: userRecord[0]._id ,userName : userRecord[0].name , userEmail :  userRecord[0].email },"secret", { expiresIn:(86400*30) });

//     // if email and password is valid then it will returns user information with token
//     userRecord = { token: token, user: userRecord[0]}
//     return userRecord ;
// }

// // get user profile information 
// const getUserProfile = async(userprops) => {
//     let filter = {}
//     if (userprops.id) filter._id = userprops.id;
//     let userData = await userModal.getUserProfile(filter);
//     return userData ;
// }


module.exports = {getCampaign, addCampaign, checkCampaign, updateCampaign}