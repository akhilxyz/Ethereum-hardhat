const model = require("./modal");

// add Campaign in database by using modal.save() function
//The save() function is used to save the document to the database. Using this function, new documents can be added to the database.
const addCampaign = async (Campaign) => {
  return (await new model(Campaign).save()).toObject();
}

// Get Campaign in database by using modal.find() function
//The find() function is used to find particular data from the MongoDB database. 
// It takes 3 arguments and they are query (also known as a condition), query projection (used for mentioning which fields to include or exclude from the query), 
// and the last argument is the general query options (like limit, skip, etc).
const getCampaign = async (CampaignData) => {
    return (await model.find(CampaignData || {}))
}

// Update Campaign in database by using modal.updateOne() function
//The updateOne() function is used to update the first document that matches the condition. This function is the same as update(), 
//except it does not support the multi or overwrite options.
const updateCampaign = async (CampaignId,data) => {
  let updateResponse = await model.updateOne({ _id: CampaignId }, { $set: data }).exec() 
  if(updateResponse.ok == 1){
   return await getCampaign({_id:CampaignId});
  }
  else{ return {Error: "Something went wrong!!!"}}
}

// // Delete Campaign in database by using modal.deleteOne() function
// // The deleteOne() function is used to delete the first document that matches the conditions from the collection. It behaves like the remove()
// // function but deletes at most one document regardless of the single option
// const deleteCampaign = async (CampaignId) => {
//     let updateResponse = await model.deleteOne({ _id: CampaignId }).exec()  
//     if(updateResponse.ok == 1){
//     return {Message:"Campaign deleted Successfully!!!"}
//   }
//   else{ return {Error: "Something went wrong!!!"} }
// }

// // The findOne() function is used to find one document according to the condition. If multiple documents match the condition, 
// // then it returns the first document satisfying the condition.
// const getCampaignProfile = async(filters) => {
//   return await model.findOne(filters).exec()
// }

// exporting all the functions 
module.exports = { addCampaign, getCampaign ,updateCampaign}