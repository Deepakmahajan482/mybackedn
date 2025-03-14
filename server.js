
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://deepakmahajan3028:ZMqZbfwrrANaSi7k@cluster0.ejacp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
    buyerName: String,
    date: Date,
    totalAmount: Number,
    totalQuantity: Number,
    isPaid: Boolean,
    items: [{ name: String, price: Number, quantity: Number, total: Number }]
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

// ✅ Fetch all invoices
app.get("/get-invoices", async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch invoices" });
    }
});

// ✅ Add a new invoice
app.post("/add-invoice", async (req, res) => {
    try {
        const newInvoice = new Invoice(req.body);
        await newInvoice.save();
        res.json({ message: "Invoice added successfully!", invoice: newInvoice });
    } catch (error) {
        res.status(500).json({ error: "Failed to create invoice" });
    }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
