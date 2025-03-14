
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://deepakmahajan3028:ZMqZbfwrrANaSi7k@cluster0.ejacp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
  buyerName: String,
  date: Date,
  totalAmount: Number,
  totalQuantity: Number,
  isPaid: Boolean,
  items: [{
      name: String,
      quantity: Number,
      pricePerUnit: Number
  }]
});;

const Invoice = mongoose.model("Invoice", invoiceSchema);

// ✅ **1. Get All Invoices**
app.get("/get-invoices", async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch invoices" });
    }
});

// ✅ **2. Update Invoice Payment Status**
app.patch("/update-invoice-status/:id", async (req, res) => {
    const { id } = req.params;
    const { isPaid } = req.body;

    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(id, { isPaid }, { new: true });
        if (!updatedInvoice) return res.status(404).json({ error: "Invoice not found" });

        res.json(updatedInvoice);
    } catch (error) {
        res.status(500).json({ error: "Failed to update invoice status" });
    }
});

// ✅ **3. Add a New Invoice**
app.post("/add-invoice", async (req, res) => {
    try {
        const newInvoice = new Invoice(req.body);
        await newInvoice.save();
        res.json(newInvoice);
    } catch (error) {
        res.status(500).json({ error: "Failed to create invoice" });
    }
});

// ✅ **4. Delete an Invoice**
app.delete("/delete-invoice/:id", async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!deletedInvoice) return res.status(404).json({ error: "Invoice not found" });

        res.json({ message: "Invoice deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete invoice" });
    }
});

// ✅ **5. Get Single Invoice by ID**
app.get("/get-invoice/:id", async (req, res) => {
  try {
      const invoice = await Invoice.findById(req.params.id);
      if (!invoice) return res.status(404).json({ error: "Invoice not found" });

      res.json(invoice);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoice details" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// 

