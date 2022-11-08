const express = require("express");
const { MongoClient } = require("mongodb");
require("colors");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

// const uri =
//   "mongodb+srv://zamilfits:qCqaERLaLlduw2zw@cluster0.cruea6x.mongodb.net/?retryWrites=true&w=majority";

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function dbConnect() {
  try {
    await client.connect();
    console.log("Database connected".yellow.italic);
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
}
dbConnect();

const Service = client.db("zamilfits").collection("services");

app.get("/", (req, res) => {
  res.send("server catch the data");
});

// service add from user
app.post("/addservice", async (req, res) => {
  try {
    const result = await Service.insertOne(req.body);

    if (result.insertedId) {
      res.send({
        success: true,
        message: `Successfully created the  with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't create the product",
      });
    }
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// service get by user
app.get("/service", async (req, res) => {
  try {
    const cursor = Service.find({});
    const services = await cursor.toArray();

    res.send({
      success: true,
      message: "Successfully got the data",
      data: services,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("server is running on port".cyan);
});
