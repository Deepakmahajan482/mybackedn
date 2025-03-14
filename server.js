const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://deepakmahajan3028:ZMqZbfwrrANaSi7k@cluster0.ejacp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Define Schema and Model
const invoiceSchema = new mongoose.Schema({
  buyerName: String,
  totalAmount: Number,
  totalQuantity: Number,
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
      total: Number
    }
  ],
  date: { type: Date, default: Date.now }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

// API Route to Save Invoice
app.post('/save-invoice', async (req, res) => {
  try {
    const newInvoice = new Invoice(req.body);
    await newInvoice.save();
    res.json({ message: "Invoice saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Route to Get Invoices
app.get('/get-invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
