const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
  email: { type: String, required: true }, // Removed unique constraint
  loginTime: { type: Date, required: true }, // Required field for login time
  logoutTime: { type: Date }, // Optional field for logout time
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
