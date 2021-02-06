import mongoose from "mongoose";

export default function () {
  const connectionURL = process.env.MONGODB_URL;

  mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on("connected", () => {
    console.log(`Mongoose default connection ready at ${connectionURL}`);
  });

  mongoose.connection.on("error", (error) => {
    console.log("Mongoose default connection error:", error);
  });
}
