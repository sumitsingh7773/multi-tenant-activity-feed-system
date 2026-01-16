const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  actorId: String,
  actorName: String,
  type: String,
  entityId: String,
  metadata: Object,
  createdAt: { type: Date, default: Date.now }
});

ActivitySchema.index({ tenantId: 1, createdAt: -1 });

module.exports = mongoose.model("Activity", ActivitySchema);
