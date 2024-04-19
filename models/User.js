const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    role: { type: String, enum: ["driver", "passenger"], required: true },
  });
   
  userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      this.hashedPassword = await bcrypt.hash(this.hashedPassword, 12);
    }
    next();
  });
   
  userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.hashedPassword);
  };
   
   
  const User = mongoose.model("User", userSchema);

module.exports = User;
