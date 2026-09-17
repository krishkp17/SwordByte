import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "demo-user" },
    filename: { type: String, required: true },
    text: { type: String, required: true },
    summary: { type: mongoose.Schema.Types.Mixed, default: null },
    topics: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
