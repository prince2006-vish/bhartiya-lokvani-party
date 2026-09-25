import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const admins = [
  {
    name: "Rahul Singh",
    email: "infotechsdp@gmail.com",
    password: "Admin@123",
  },
  {
    name: "Prince Vishwakarma",
    email: "princevishwaka123@gmail.com",
    password: "Admin@123",
  },
  {
    name: "Pankaj Dudey",
    email: "dwivedimanendra22@gmail.com",
    password: "Admin@123",
  },
  {
    name: "Arun Kumar Dudey",
    email: "adube22@gmail.com",
    password: "Admin@123",
  },
];

const createAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    for (const admin of admins) {
      const existingAdmin = await Admin.findOne({
        email: admin.email,
      });

      if (existingAdmin) {
        console.log(`${admin.email} already exists`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(admin.password, 12);

      await Admin.create({
        name: admin.name,
        email: admin.email,
        password: hashedPassword,
      });

      console.log(`${admin.email} created`);
    }

    console.log("All admins processed");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

createAdmins();
