import mongoose from "mongoose";

class Connection {
  constructor() {
    const url =
      process.env.MONGODB_URI ||
      `mongodb+srv://Abdulrahman:80EWOa7uLLr3iBoJ@upworkgraduationproject.bsr20.mongodb.net/Upwork?retryWrites=true&w=majority`;
    console.log("Establish new connection with url", url);
    mongoose.Promise = global.Promise;
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);
    mongoose.set("useUnifiedTopology", true);
    mongoose.connect(url);
  }
}

export default new Connection();