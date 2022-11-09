const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
require("colors");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cruea6x.mongodb.net/?retryWrites=true&w=majority`;

// const uri = "mongodb://localhost:27017";
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
app.get("/service/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const query = { _id: ObjectId(id) };
    const service = await Service.findOne(query);

    res.send({
      success: true,
      message: "Successfully got the data",
      data: service,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log("server is running on port".cyan);
});
