require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

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
