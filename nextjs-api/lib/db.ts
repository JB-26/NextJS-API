import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
  // check if connected, so we don't connect twice
  const connectionState = mongoose.connection.readyState;
  if (connectionState === 1) {
    console.log("Already connected to MongoDB");
    return;
  }

  if (connectionState === 2) {
    console.log("Connecting to MongoDB...");
    return;
  }

  try {
    mongoose.connect(MONGODB_URI!, {
      dbName: "nextrestapi",
      bufferCommands: true,
    });
    console.log("Connected!");
  } catch (err) {
    console.log(`Error - ${err}`);
    throw new Error(`Error - ${err}`);
  }
};
export default connect;
