require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const path = require("path");

app.use(express.static("Build"));
app.use(express.json());
app.use(cors());

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "/Build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// const calculateOrderAmount = (amount) => {
//   // Replace this constant with a calculation of the order's amount
//   // Calculate the order total on the server to prevent
//   // people from directly manipulating the amount on the client
//   return amount * 400;
// };

app.post("/create-payment-intent", async (req, res) => {
  console.log(req.body);
  const { amount } = req.body;
  console.log(amount);

  //   const newPrice = price * amount;
  //   const newPrice = amount * 100;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));
