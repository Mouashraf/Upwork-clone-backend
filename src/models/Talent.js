// Import mongoose (MongoDB ODM)
const mongoose = require("mongoose");

//Using mongoose Shcema constructor to create Talents (Freelancers) Schema
const talentSchema = new mongoose.Schema({
  Email: {
    type: String,
    unique: true,
    required: true,
    // match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
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
    minLength: 6,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  MainService: {
    type: String,
  },
  Skills: {
    type: Array,
    default: [],
  },
  ExpertiseLevel: {
    type: String,
    enum: ["Entry", "Intermediate", "Expert"],
    default: "Entry",
  },
  Languages: {
    type: Object,
    English: {
      type: String,
      enum: ["Basic", "Good", "Fluent", "Native"],
      default: "Basic",
    },
    Arabic: {
      type: String,
      enum: ["Basic", "Good", "Fluent", "Native"],
      default: "Basic",
    },
  },
  HourlyRate: {
    type: Number,
    default: 10,
  },

  Title: {
    type: String,
  },

  ProfessionalOverview: {
    type: String,
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

  PhoneNumber: {
    type: Number,
    unique: true,
  },

  Availability: {
    type: Number,

    // Number refer to Availability status
    // 0 ==> Available as needed
    // 30 ==> Less Than 30 hrs/week
    // 100 ==> More Than 30 hrs/week
    enum: [0, 30, 100],

    default: 0,
  },
  Jobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  ],
  SavedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  ],
  Connects: {
    type: Number,
    default: 0,
    min: 0
  },
});

// Add Method into Talent Schema to add new job
talentSchema.methods.addToJobs = function (job) {
  const updatedJobsList = [...this.Jobs];

  updatedJobsList.push(job._id);

  this.Jobs = updatedJobsList;

  return this.save();
};

// Add Method into Talent Schema to remove a job
talentSchema.methods.removeFromJobs = function (jobID) {
  const updatedlist = this.Jobs.filter((item) => {
    return item.toString() !== jobID.toString();
  });

  this.Jobs = updatedlist;

  return this.save();
};

// Add Method into Talent Schema to deduct connects
talentSchema.methods.deductFromConnects = function (num) {

  this.Connects -= num;

  return this.save();
};

// Add Method into Talent Schema to add new job to saved collection
talentSchema.methods.addToSavedJobs = function (job) {
  const updatedSavedJobsList = [...this.SavedJobs];

  updatedSavedJobsList.push(job._id);

  this.SavedJobs = updatedSavedJobsList;

  return this.save();
};

// Add Method into Talent Schema to remove a job from saved collection
talentSchema.methods.removeFromSavedJobs = function (jobID) {
  const updatedlist = this.SavedJobs.filter((item) => {
    return item.toString() !== jobID.toString();
  });

  this.SavedJobs = updatedlist;

  return this.save();
};
// Export the Talents Schema so we can use it whenever we want
module.exports = mongoose.model("Talent", talentSchema);
