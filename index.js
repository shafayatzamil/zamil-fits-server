const express = require("express");
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");
require("colors");
const app = express();
const cors = require("cors");
const auth = require("./middleware/auth");
const port = process.env.PORT || 5000;
require("dotenv").config();

// app.use(express.json());
// app.use(cors({ origin: "http://localhost:3000/" }));

const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,authorization"
  );
  next();
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cruea6x.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);
// connection on database

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
const Review = client.db("zamilfits").collection("reviews");

app.get("/", auth, (req, res) => {
  res.send("server catch the data");
});

app.post("/signtoken", (req, res) => {
  const token = jwt.sign({ id: req.body.userid }, process.env.JWT_SECRET);

  res.json({
    token,
  });
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

app.post("/review", auth, async (req, res) => {
  try {
    const result = await Review.insertOne(req.body);

    const query = { _id: ObjectId(result.insertedId) };
    const review = await Review.findOne(query);

    if (result.insertedId) {
      res.send({
        success: true,
        message: `Successfully created the  with id ${result.insertedId}`,
        data: {
          review: review,
        },
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't create the review",
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

//all review
app.get("/review", async (req, res) => {
  try {
    const cursor = Review.find({});
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

app.get("/review/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const query = Review.find({ service: id });
    const reviews = await query.toArray();

    res.send({
      success: true,
      message: "Successfully got the data",
      data: reviews,
    });
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// singleid reviews delect
app.delete("/review/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Review.findOne({ _id: ObjectId(id) });

    if (!product?._id) {
      res.send({
        success: false,
        error: "Product doesn't exist",
      });
      return;
    }

    const result = await Review.deleteOne({ _id: ObjectId(id) });

    if (result.deletedCount) {
      res.send({
        success: true,
        message: `Successfully deleted the ${product.name}`,
      });
    } else {
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// user limited
app.get("/p-users", async (req, res) => {
  const users = await Service.find({}).limit(3).toArray();

  const count = await Service.estimatedDocumentCount();

  res.send({
    status: "success",
    data: users,
    count: count,
  });
});

app.listen(port, () => {
  console.log("server is running on port".cyan);
});
