const Activity = require("../models/Activity");

exports.createActivity = async (req, res) => {
  try {
    const tenantId = req.headers["x-tenant-id"];
    if (!tenantId) return res.status(400).json({ message: "Tenant ID is required" });

    const activity = await Activity.create({
      ...req.body,
      tenantId
    });
    res.status(201).json({ activity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create activity" });
  }
};
exports.getActivities = async (req, res) => {
  try {
    const tenantId = req.headers["x-tenant-id"];
    const { cursor, limit = 20 } = req.query;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    const query = {
      tenantId,
      ...(cursor && { createdAt: { $lt: new Date(cursor) } })
    };

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select("actorName type entityId metadata createdAt");

    const nextCursor =
      activities.length > 0
        ? activities[activities.length - 1].createdAt
        : null;

    res.json({
      activities,
      nextCursor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};


