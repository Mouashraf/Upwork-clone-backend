// Import mongoose (MongoDB ODM)
const mongoose = require("mongoose");

//Using mongoose Shcema constructor to create Employer Schema
const employerSchema = new mongoose.Schema({
  Email: {
    type: String,
    unique: true,
    required: true,
  },
  UserName: {
    type: String,
    unique: true,
    required: true,
  },
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  ImageURL: {
    type: String,
    default: "https://www.djelfa.info/mobi/img/avatar/avatar.png",
  },
  Country: {
    type: String,
    enum: ["Egypt", "UK", "US"],
    default: "Egypt",
  },
  // Jobs: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Job"
  // }]
});

// Export the Employers Schema so we can use it whenever we want
module.exports = mongoose.model("Employer", employerSchema);
