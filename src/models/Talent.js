// Import mongoose (MongoDB ODM)
const mongoose = require("mongoose");

//Using mongoose Shcema constructor to create Talents (Freelancers) Schema
const talentSchema = new mongoose.Schema({
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
      default: "",
    },
    Arabic: {
      type: String,
      enum: ["Basic", "Good", "Fluent", "Native"],
      default: "",
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
});

// Export the Talents Schema so we can use it whenever we want
module.exports = mongoose.model("Talent", talentSchema);
