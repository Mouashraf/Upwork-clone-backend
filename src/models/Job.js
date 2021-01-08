// Import mongoose (MongoDB ODM)
const mongoose = require("mongoose");

//Using mongoose Shcema constructor to create Job Schema
const jobSchema = new mongoose.Schema({
  EmployerEmail: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  JobType: {
    type: String,
    required: true,
    enum: ["One Time", "Ongoing", "Complex"],
  },
  Skills: {
    type: Array,
    default: [],
  },
  ExpertiseLevel: {
    type: String,
    required: true,
    enum: ["Entry", "Intermediate", "Expert"],
  },
  TalentsRequired: {
    type: Number,
    required: true,
    default: 1,
  },
  Country: {
    type: String,
    enum: ["Egypt", "UK", "US", ""],
    default: "",
  },
  JobSuccessScore: {
    type: Number,
    default: 0,
  },
  EnglishLevel: {
    type: String,
    enum: ["", "Basic", "Good", "Fluent", "Native"],
    default: "",
  },
  Earning: {
    type: Number,
    default: 0,
  },
  isFixedPrice: {
    type: Boolean,
    default: false,
  },
  Duration: {
    type: Number,

    // Number refers to min duration for the job, So if employer chooses 1 ==> (1-3) Months, and if he chooses 3 ==> (3-6) Months
    enum: [0, 1, 3, 6],

    default: 0,
  },
  WeeklyHoursRequired: {
    type: Number,

    // Number refer to Availability status
    // 0 ==> Available as needed
    // 30 ==> Less Than 30 hrs/week
    // 100 ==> More Than 30 hrs/week
    enum: [0, 30, 100],

    default: 0,
  },
});

// Export the Jobs Schema so we can use it whenever we want
module.exports = mongoose.model("Job", jobSchema);
