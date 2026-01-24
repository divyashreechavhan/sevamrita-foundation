// filepath: api/create-order.js
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Add this to Vercel's environment variables
  key_secret: process.env.RAZORPAY_SECRET, // Add this to Vercel's environment variables
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { amount, currency } = req.body;

    try {
      const options = {
        amount: amount * 100, // Convert to paise
        currency: currency || "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.status(200).json(order); // Send the order details back to the client
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}