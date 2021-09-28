const mongoose = require('mongoose')

// Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection 
// and defines the shape of the documents within that collection.

const campaignSchema = new mongoose.Schema({
  title:{ type: String, required: [true,"Campaign Title is Required"] },
  banner:{ type: String, default : null},
  userAddress :{ type: String, required: [true,"Campaign's manager address is Required"] },
  campaignAddress :{ type: String, default : null },
  amount:{ type: Number, required: [true,"Campaign minimum Ammount is Required"] },
  fund:{ type: Number , default : 0},
  description :{ type: String, required: [true,"Campaign description is Required"] },
  // active : {type : Boolean, default : false},
  created_on: {type: Date, default: Date.now},

});

module.exports = mongoose.model('Campaign', campaignSchema)