/**
 * seeder.js
 * Run `npm run data:import` or `npm run data:destroy` to manage test data.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import { users, templates } from "./data/testData.js";
import User from "./models/User.js";
import Template from "./models/Template.js";
import Order from "./models/Order.js";
import Payment from "./models/Payment.js";
import Message from "./models/Message.js";
import { connectDB } from "./utils/connectDB.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany();
    await Template.deleteMany();
    await Order.deleteMany();
    await Payment.deleteMany();
    await Message.deleteMany();

    console.log("👤 Seeding Users...");
    // Hash passwords manually because insertMany doesn't trigger Mongoose pre-save hooks
    const salt = await bcrypt.genSalt(12);
    const hashedUsers = users.map((user) => ({
      ...user,
      password: bcrypt.hashSync(user.password, salt),
    }));

    const createdUsers = await User.insertMany(hashedUsers);
    const adminUser = createdUsers[0]._id; // First user is admin from testData.js

    console.log("🎨 Seeding Templates...");
    const sampleTemplates = templates.map((template) => ({
      ...template,
      createdBy: adminUser,
    }));

    await Template.insertMany(sampleTemplates);

    console.log("✅ Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(`❌ Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    console.log("🗑️  Destroying all data...");
    await User.deleteMany();
    await Template.deleteMany();
    await Order.deleteMany();
    await Payment.deleteMany();
    await Message.deleteMany();

    console.log("✅ Data Destroyed Successfully!");
    process.exit();
  } catch (error) {
    console.error(`❌ Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
