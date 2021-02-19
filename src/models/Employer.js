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
  Type:{
    type: String,
    default: "Employer"
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
    // enum: ["Egypt", "UK", "US"],
    default: "Egypt",
  },
  Jobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  }, ],
}, {
	timestamps: true,
});

// Add Method into Employer Schema to add new job
employerSchema.methods.addToJobs = function (job) {
  const updatedJobsList = [...this.Jobs];

  updatedJobsList.push(job._id);

  this.Jobs = updatedJobsList;

  return this.save();
};

// Add Method into Employer Schema to remove a job
employerSchema.methods.removeFromJobs = function (jobID) {
  const updatedlist = this.Jobs.filter((item) => {
    return item.toString() !== jobID.toString();
  });

  this.Jobs = updatedlist;

  return this.save();
};

// Export the Employers Schema so we can use it whenever we want
module.exports = mongoose.model("Employer", employerSchema);