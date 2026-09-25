import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer"; //add gallery
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";
import nodemailer from "nodemailer";
import ForgotPassword from "./models/ForgotPassword.js";
import Event from "./models/Event.js";
import Leader from "./models/Leader.js";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const mailTransporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  }),
);

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// ==========================================
// CLOUDINARY
// ==========================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10 MB
//   },
// }); //add gallery

console.log("====== CLOUDINARY CHECK ======");
console.log("CLOUD NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API KEY:", process.env.CLOUDINARY_API_KEY ? "LOADED" : "MISSING");
console.log(
  "API SECRET:",
  process.env.CLOUDINARY_API_SECRET ? "LOADED" : "MISSING",
);
console.log("==============================");

// ==========================================
// MONGODB
// ==========================================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Atlas connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// ==========================================
// NEWS SCHEMA
// ==========================================

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    date: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "समाचार",
    },

    status: {
      type: String,
      default: "प्रकाशित",
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// MEMBER SCHEMA
// ==========================================

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      required: true,
    },

    district: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    profession: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// GALLERY SCHEMA photo gallery
// ==========================================

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    date: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "जनता",
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// VIDEO SCHEMA
// ==========================================

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "जनता",
    },

    description: {
      type: String,
      default: "",
    },

    date: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      default: "",
    },

    thumbnailUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// contact schema

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    consent: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["नया", "पढ़ा गया"],
      default: "नया",
    },
  },
  {
    timestamps: true,
  },
);

// =====================================================
// OUR POLITICS / ISSUES SCHEMA
// =====================================================

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "सामान्य",
      trim: true,
    },

    shortDescription: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["प्रकाशित", "ड्राफ्ट"],
      default: "प्रकाशित",
    },
  },
  {
    timestamps: true,
  },
);

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    paymentMethod: {
      type: String,
      default: "Razorpay",
    },

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    transactionId: {
      type: String,
      default: "",
      trim: true,
    },

    message: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["नया", "भुगतान शुरू", "सत्यापित", "असफल", "रद्द"],
      default: "नया",
    },
  },
  {
    timestamps: true,
  },
);

// ==========================================
// MODELS
// ==========================================

const News = mongoose.model("News", newsSchema);
const Member = mongoose.model("Member", memberSchema);
const Gallery = mongoose.model("Gallery", gallerySchema);
const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);
const Contact = mongoose.model("Contact", contactSchema);
const Issue = mongoose.model("Issue", issueSchema);
const Donation = mongoose.model("Donation", donationSchema);

// ==========================================
// GALLERY FILE UPLOAD
// ==========================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("सिर्फ image file upload करें"));
    }
  },
});

// ==========================================
// VIDEO FILE UPLOAD
// ==========================================

const videoUpload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
  },

  fileFilter: (req, file, cb) => {
    if (file.fieldname === "video" && file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else if (
      file.fieldname === "thumbnail" &&
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid video या thumbnail file"));
    }
  },
});

// ==========================================
// AUTH MIDDLEWARE
// ==========================================

function auth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      message: "Login required",
    });
  }

  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

// ==========================================
// HOME
// ==========================================

app.get("/", (_, res) => {
  res.json({
    message: "Bharatiya Lok Vani API is running",
  });
});

// ==========================================
// ADMIN LOGIN
// ==========================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("\n========== LOGIN ATTEMPT ==========");
    console.log("Email received:", email);
    console.log("Password received:", password ? "YES" : "NO");

    if (!email || !password) {
      return res.status(400).json({
        message: "Email और password required हैं",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const admin = await Admin.findOne({
      email: cleanEmail,
    });

    console.log("Admin found:", admin ? "YES" : "NO");

    if (!admin) {
      console.log("❌ Admin email not found:", cleanEmail);

      return res.status(401).json({
        message: "Email या password गलत है",
      });
    }

    console.log("Admin name:", admin.name);
    console.log("Admin email:", admin.email);
    console.log("Password hash exists:", admin.password ? "YES" : "NO");

    const passwordMatch = await bcrypt.compare(password, admin.password);

    console.log("Password match:", passwordMatch);

    if (!passwordMatch) {
      console.log("❌ Password mismatch");

      return res.status(401).json({
        message: "Email या password गलत है",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
      JWT_SECRET,
      {
        expiresIn: "8h",
      },
    );

    console.log("✅ LOGIN SUCCESS");

    return res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

/// forgot pass

app.post("/api/admin/forgot-password", async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({
        message: "Email required hai",
      });
    }

    const admin = await Admin.findOne({ email });

    // Security ke liye same response
    // registered/unregistered dono cases me
    if (!admin) {
      return res.status(404).json({
        message: "यह email किसी admin account में registered नहीं है",
      });
    }

    // Purane OTP delete
    await ForgotPassword.deleteMany({ email });

    // 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP ko hash karke store karenge
    const otpHash = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await ForgotPassword.create({
      email,
      otpHash,
      expiresAt,
    });

    await mailTransporter.sendMail({
      from: `"भारती लोक वाणी Admin" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Admin Password Reset OTP",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 12px;
        ">

          <h2>Password Reset</h2>

          <p>
            आपके admin account का password reset करने के लिए
            नीचे दिया गया OTP इस्तेमाल करें।
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            text-align: center;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 10px;
          ">
            ${otp}
          </div>

          <p>
            यह OTP <b>10 मिनट</b> तक valid है।
          </p>

          <p>
            अगर आपने password reset request नहीं की है,
            तो इस email को ignore करें।
          </p>

        </div>
      `,
    });

    res.json({
      message: "Agar ye email registered hai, to OTP bhej diya gaya hai.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      message: "OTP send nahi ho paya",
    });
  }
});
// ==========================================
// DASHBOARD STATS
// ==========================================

app.get("/api/dashboard/stats", auth, async (_, res) => {
  try {
    const [news, events, members, grievances] = await Promise.all([
      News.countDocuments(),
      Event.countDocuments(),
      Member.countDocuments(),
      Promise.resolve(0),
    ]);

    res.json({
      news,
      events,
      members,
      grievances,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not load dashboard",
    });
  }
});

// ==========================================
// ADMIN CRUD ROUTES
// ==========================================

function crudRoutes(path, Model) {
  // GET
  app.get(`/api/${path}`, auth, async (_, res) => {
    try {
      const items = await Model.find().sort({
        createdAt: -1,
      });

      res.json(items);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: `Could not load ${path}`,
      });
    }
  });

  // CREATE
  app.post(`/api/${path}`, auth, async (req, res) => {
    try {
      const item = await Model.create(req.body);

      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  });

  // UPDATE
  app.put(`/api/${path}/:id`, auth, async (req, res) => {
    try {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!item) {
        return res.status(404).json({
          message: "Not found",
        });
      }

      res.json(item);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  });

  // DELETE
  app.delete(`/api/${path}/:id`, auth, async (req, res) => {
    try {
      const item = await Model.findByIdAndDelete(req.params.id);

      if (!item) {
        return res.status(404).json({
          message: "Not found",
        });
      }

      res.json({
        message: "Deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: "Delete failed",
      });
    }
  });
}

crudRoutes("news", News);
crudRoutes("members", Member);
crudRoutes("leaders", Leader);

// ==========================================
// GALLERY ROUTES - FILE UPLOAD
// ==========================================

// ADMIN GET GALLERY
app.get("/api/gallery", auth, async (_, res) => {
  try {
    const gallery = await Gallery.find().sort({
      createdAt: -1,
    });

    res.json(gallery);
  } catch (error) {
    console.error("Gallery fetch error:", error);

    res.status(500).json({
      message: "Gallery load नहीं हो सकी",
    });
  }
});

// ADMIN ADD GALLERY IMAGE
app.post("/api/gallery", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, description, date, category } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Image title जरूरी है",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "कृपया image file select करें",
      });
    }

    // Buffer को Cloudinary stream में upload करें
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "bharati-lokvani/gallery",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      stream.end(req.file.buffer);
    });

    const gallery = await Gallery.create({
      title,
      description: description || "",
      date: date || "",
      category: category || "सभी",
      imageUrl: uploadResult.secure_url,
    });

    res.status(201).json({
      message: "Image successfully uploaded",
      gallery,
    });
  } catch (error) {
    console.error("Gallery upload error:", error);

    res.status(500).json({
      message: "Image upload करने में समस्या हुई",
    });
  }
});

// ADMIN UPDATE GALLERY
app.put("/api/gallery/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery image नहीं मिली",
      });
    }

    const { title, description, date, category } = req.body;

    if (title !== undefined) {
      gallery.title = title;
    }

    if (description !== undefined) {
      gallery.description = description;
    }

    if (date !== undefined) {
      gallery.date = date;
    }

    if (category !== undefined) {
      gallery.category = category;
    }

    // अगर नई image select की गई है
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "bharati-lokvani/gallery",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );

        stream.end(req.file.buffer);
      });

      gallery.imageUrl = uploadResult.secure_url;
    }

    await gallery.save();

    res.json({
      message: "Gallery updated successfully",
      gallery,
    });
  } catch (error) {
    console.error("Gallery update error:", error);

    res.status(500).json({
      message: "Gallery update नहीं हो सकी",
    });
  }
});

// ADMIN DELETE GALLERY
app.delete("/api/gallery/:id", auth, async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery image नहीं मिली",
      });
    }

    res.json({
      message: "Gallery image deleted successfully",
    });
  } catch (error) {
    console.error("Gallery delete error:", error);

    res.status(500).json({
      message: "Gallery delete नहीं हो सकी",
    });
  }
});

// ==========================================
// VIDEO ROUTES
// ==========================================

// GET ALL VIDEOS - ADMIN

app.get("/api/videos", auth, async (req, res) => {
  try {
    const videos = await Video.find().sort({
      createdAt: -1,
    });

    res.json(videos);
  } catch (error) {
    console.error("Get videos error:", error);

    res.status(500).json({
      message: "Videos fetch नहीं हो पाए",
    });
  }
});

// ==========================================
// CREATE VIDEO
// ==========================================

app.post(
  "/api/videos",
  auth,
  videoUpload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, category, description, date } = req.body;

      if (!title) {
        return res.status(400).json({
          message: "Video title जरूरी है",
        });
      }

      if (!req.files?.video?.[0]) {
        return res.status(400).json({
          message: "Video file जरूरी है",
        });
      }

      // =========================
      // VIDEO UPLOAD
      // =========================

      const videoFile = req.files.video[0];

      const videoUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "bharati-lok/videos",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          },
        );

        stream.end(videoFile.buffer);
      });

      // =========================
      // THUMBNAIL UPLOAD
      // =========================

      let thumbnailUrl = "";

      if (req.files?.thumbnail?.[0]) {
        const thumbnailFile = req.files.thumbnail[0];

        thumbnailUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "image",
              folder: "bharati-lok/video-thumbnails",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            },
          );

          stream.end(thumbnailFile.buffer);
        });
      }

      // =========================
      // SAVE MONGODB
      // =========================

      const video = await Video.create({
        title,
        category: category || "जनता",
        description: description || "",
        date: date || "",
        videoUrl,
        thumbnailUrl,
      });

      res.status(201).json(video);
    } catch (error) {
      console.error("Create video error:", error);

      res.status(500).json({
        message: "Video upload failed",
        error: error.message,
      });
    }
  },
);

// ==========================================
// UPDATE VIDEO
// ==========================================

app.put(
  "/api/videos/:id",
  auth,
  videoUpload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const video = await Video.findById(req.params.id);

      if (!video) {
        return res.status(404).json({
          message: "Video नहीं मिला",
        });
      }

      const { title, category, description, date } = req.body;

      if (title !== undefined) {
        video.title = title;
      }

      if (category !== undefined) {
        video.category = category;
      }

      if (description !== undefined) {
        video.description = description;
      }

      if (date !== undefined) {
        video.date = date;
      }

      // =========================
      // NEW VIDEO
      // =========================

      if (req.files?.video?.[0]) {
        const videoFile = req.files.video[0];

        const videoUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "video",
              folder: "bharati-lok/videos",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            },
          );

          stream.end(videoFile.buffer);
        });

        video.videoUrl = videoUrl;
      }

      // =========================
      // NEW THUMBNAIL
      // =========================

      if (req.files?.thumbnail?.[0]) {
        const thumbnailFile = req.files.thumbnail[0];

        const thumbnailUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              resource_type: "image",
              folder: "bharati-lok/video-thumbnails",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            },
          );

          stream.end(thumbnailFile.buffer);
        });

        video.thumbnailUrl = thumbnailUrl;
      }

      await video.save();

      res.json(video);
    } catch (error) {
      console.error("Update video error:", error);

      res.status(500).json({
        message: "Video update failed",
        error: error.message,
      });
    }
  },
);

// ==========================================
// DELETE VIDEO
// ==========================================

app.delete("/api/videos/:id", auth, async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);

    if (!video) {
      return res.status(404).json({
        message: "Video नहीं मिला",
      });
    }

    res.json({
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Delete video error:", error);

    res.status(500).json({
      message: "Video delete failed",
    });
  }
});

// ==========================================
// PUBLIC VIDEOS
// ==========================================

app.get("/api/public/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    console.error("Public videos error:", error);

    res.status(500).json({
      message: "Videos fetch नहीं हो पाए",
    });
  }
});

// =========================================
// CONTACT FORM
// =========================================

// Frontend se contact message receive
app.post("/api/contact", async (req, res) => {
  try {
    const { name, phone, district, message, consent } = req.body;

    if (!name || !phone || !district || !message) {
      return res.status(400).json({
        message: "सभी required fields भरें",
      });
    }

    if (!consent) {
      return res.status(400).json({
        message: "Consent जरूरी है",
      });
    }

    const contact = await Contact.create({
      name,
      phone,
      district,
      message,
      consent,
    });

    res.status(201).json({
      message: "Contact message successfully saved",
      contact,
    });
  } catch (error) {
    console.error("Contact create error:", error);

    res.status(500).json({
      message: "Contact message save नहीं हो पाया",
    });
  }
});

// =========================================
// ADMIN - GET CONTACTS
// =========================================

app.get("/api/contacts", auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json(contacts);
  } catch (error) {
    console.error("Get contacts error:", error);

    res.status(500).json({
      message: "Contacts fetch नहीं हो पाए",
    });
  }
});

// =========================================
// ADMIN - UPDATE CONTACT STATUS
// =========================================

app.put("/api/contacts/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!contact) {
      return res.status(404).json({
        message: "Contact नहीं मिला",
      });
    }

    res.json(contact);
  } catch (error) {
    console.error("Contact status error:", error);

    res.status(500).json({
      message: "Status update नहीं हो पाया",
    });
  }
});

// =========================================
// ADMIN - DELETE CONTACT
// =========================================

app.delete("/api/contacts/:id", auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact नहीं मिला",
      });
    }

    res.json({
      message: "Contact successfully deleted",
    });
  } catch (error) {
    console.error("Delete contact error:", error);

    res.status(500).json({
      message: "Contact delete नहीं हो पाया",
    });
  }
});

// ==========================================
// PUBLIC NEWS
// ==========================================

app.get("/api/public/news", async (_, res) => {
  try {
    const news = await News.find().sort({
      createdAt: -1,
    });

    res.json(news);
  } catch (error) {
    console.error("Public news error:", error);

    res.status(500).json({
      message: "Could not load public news",
    });
  }
});

// ==========================================
// PUBLIC APPROVED MEMBERS
// ==========================================

app.get("/api/public/members", async (_, res) => {
  try {
    const members = await Member.find({
      status: "सक्रिय",
    }).sort({
      createdAt: -1,
    });

    res.json(members);
  } catch (error) {
    console.error("Public members error:", error);

    res.status(500).json({
      message: "Could not load public members",
    });
  }
});

// ==========================================
// PUBLIC GALLERY
// ==========================================

app.get("/api/public/gallery", async (_, res) => {
  try {
    const gallery = await Gallery.find().sort({
      createdAt: -1,
    });

    res.json(gallery);
  } catch (error) {
    console.error("Public gallery error:", error);

    res.status(500).json({
      message: "Could not load public gallery",
    });
  }
});

// ==========================================
// PUBLIC MEMBERSHIP
// JSON + BASE64 IMAGE
// ==========================================

app.post("/api/public/membership", async (req, res) => {
  console.log("=================================");
  console.log("MEMBERSHIP API HIT");
  console.log("=================================");

  try {
    const {
      name,
      phone,
      email,
      state,
      district,
      age,
      profession,
      address,
      purpose,
      image,
    } = req.body;

    console.log("Member Name:", name);
    console.log("Phone:", phone);
    console.log("State:", state);
    console.log("District:", district);
    console.log("Image received:", image ? "YES" : "NO");

    // ======================================
    // REQUIRED FIELDS
    // ======================================

    if (
      !name ||
      !phone ||
      !state ||
      !district ||
      !age ||
      !profession ||
      !address ||
      !purpose
    ) {
      return res.status(400).json({
        message: "सभी जरूरी जानकारी भरें",
      });
    }

    // ======================================
    // IMAGE CHECK
    // ======================================

    if (!image) {
      return res.status(400).json({
        message: "कृपया अपनी फोटो अपलोड करें",
      });
    }

    // ======================================
    // CLOUDINARY UPLOAD
    // ======================================

    let imageUrl = "";

    try {
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: "membership",
      });

      imageUrl = uploadResult.secure_url;

      console.log("Cloudinary upload successful");
    } catch (cloudinaryError) {
      console.error("Cloudinary Error:", cloudinaryError);

      return res.status(500).json({
        message: "फोटो upload करने में समस्या हुई",
      });
    }

    // ======================================
    // SAVE TO MONGODB
    // ======================================

    const member = await Member.create({
      name,
      phone,
      email: email || "",
      state,
      district,
      age: Number(age),
      profession,
      address,
      purpose,
      imageUrl,
      status: "Pending",
    });

    console.log("MEMBER SAVED:", member._id.toString());

    // ======================================
    // SUCCESS RESPONSE
    // ======================================

    return res.status(201).json({
      message: "सदस्यता आवेदन सफलतापूर्वक भेज दिया गया",

      member: {
        id: member._id,
        name: member.name,
        imageUrl: member.imageUrl,
        status: member.status,
      },
    });
  } catch (error) {
    console.error("MEMBERSHIP ERROR:", error);

    return res.status(500).json({
      message: error.message || "सदस्यता आवेदन भेजने में समस्या हुई",
    });
  }
});

// ==========================================
// GET MEMBERSHIP APPLICATION BY PHONE
// ==========================================

app.get("/api/public/membership/:phone", async (req, res) => {
  try {
    const { phone } = req.params;

    if (!phone) {
      return res.status(400).json({
        message: "मोबाइल नंबर जरूरी है",
      });
    }

    const member = await Member.findOne({ phone });

    if (!member) {
      return res.status(404).json({
        message: "सदस्यता आवेदन नहीं मिला",
      });
    }

    return res.status(200).json({
      member: {
        id: member._id,
        name: member.name,
        phone: member.phone,
        email: member.email,
        state: member.state,
        district: member.district,
        age: member.age,
        profession: member.profession,
        address: member.address,
        purpose: member.purpose,
        imageUrl: member.imageUrl,
        status: member.status,
      },
    });
  } catch (error) {
    console.error("GET MEMBERSHIP ERROR:", error);

    return res.status(500).json({
      message: "सदस्यता आवेदन प्राप्त करने में समस्या हुई",
    });
  }
});

// change password route
app.put("/api/admin/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current और new password required हैं",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password कम से कम 8 characters का होना चाहिए",
      });
    }

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        message: "Admin नहीं मिला",
      });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Current password गलत है",
      });
    }

    const samePassword = await bcrypt.compare(newPassword, admin.password);

    if (samePassword) {
      return res.status(400).json({
        message: "New password पुराने password से अलग होना चाहिए",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    admin.password = hashedPassword;

    await admin.save();

    res.json({
      message: "Password successfully changed",
    });
  } catch (error) {
    console.error("Change password error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

//verify otp route
app.post("/api/admin/verify-otp", async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const otp = req.body.otp?.trim();

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email aur OTP required hai",
      });
    }

    const resetData = await ForgotPassword.findOne({
      email,
    });

    if (!resetData) {
      return res.status(400).json({
        message: "OTP invalid ya expire ho gaya hai",
      });
    }

    if (new Date() > resetData.expiresAt) {
      await ForgotPassword.deleteOne({
        _id: resetData._id,
      });

      return res.status(400).json({
        message: "OTP expire ho gaya hai",
      });
    }

    if (resetData.attempts >= 5) {
      await ForgotPassword.deleteOne({
        _id: resetData._id,
      });

      return res.status(429).json({
        message: "Bahut zyada incorrect attempts",
      });
    }

    const validOtp = await bcrypt.compare(otp, resetData.otpHash);

    if (!validOtp) {
      resetData.attempts += 1;
      await resetData.save();

      return res.status(400).json({
        message: "OTP galat hai",
      });
    }

    res.json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    res.status(500).json({
      message: "OTP verify nahi ho paya",
    });
  }
});

// reset-pass otp

app.post("/api/admin/reset-password", async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const otp = req.body.otp?.trim();
    const newPassword = req.body.newPassword;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP aur new password required hain",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password kam se kam 8 characters ka hona chahiye",
      });
    }

    const resetData = await ForgotPassword.findOne({
      email,
    });

    if (!resetData) {
      return res.status(400).json({
        message: "Reset request invalid ya expire ho gayi hai",
      });
    }

    if (new Date() > resetData.expiresAt) {
      await ForgotPassword.deleteOne({
        _id: resetData._id,
      });

      return res.status(400).json({
        message: "OTP expire ho gaya hai",
      });
    }

    const validOtp = await bcrypt.compare(otp, resetData.otpHash);

    if (!validOtp) {
      return res.status(400).json({
        message: "OTP galat hai",
      });
    }

    const admin = await Admin.findOne({
      email,
    });

    if (!admin) {
      return res.status(400).json({
        message: "Reset request invalid hai",
      });
    }

    const samePassword = await bcrypt.compare(newPassword, admin.password);

    if (samePassword) {
      return res.status(400).json({
        message: "New password purane password se alag hona chahiye",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    admin.password = hashedPassword;

    await admin.save();

    // OTP immediately invalidate
    await ForgotPassword.deleteOne({
      _id: resetData._id,
    });

    res.json({
      message: "Password successfully reset",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      message: "Password reset nahi ho paya",
    });
  }
});

// ======================================================
// EVENTS API
// ======================================================

// GET ALL EVENTS - Admin Panel
app.get("/api/events", auth, async (req, res) => {
  try {
    const events = await Event.find().sort({
      createdAt: -1,
    });

    res.json(events);
  } catch (error) {
    console.error("Get Events Error:", error);

    res.status(500).json({
      message: "Events fetch नहीं हो पाए",
    });
  }
});

// CREATE EVENT - Admin Panel
app.post("/api/events", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      imageUrl,
      zoomLink,
      zoomMeetingId,
      zoomPassword,
      status,
    } = req.body;

    // Required fields
    if (!title || !date || !time) {
      return res.status(400).json({
        message: "Title, date और time required हैं",
      });
    }

    const event = await Event.create({
      title,
      description: description || "",
      date,
      time,
      location: location || "",
      imageUrl: imageUrl || "",
      zoomLink: zoomLink || "",
      zoomMeetingId: zoomMeetingId || "",
      zoomPassword: zoomPassword || "",
      status: status || "प्रकाशित",
    });

    res.status(201).json({
      message: "Event successfully created",
      event,
    });
  } catch (error) {
    console.error("Create Event Error:", error);

    res.status(500).json({
      message: "Event create नहीं हो पाया",
    });
  }
});

// UPDATE EVENT - Admin Panel
app.put("/api/events/:id", auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({
        message: "Event नहीं मिला",
      });
    }

    res.json({
      message: "Event successfully updated",
      event,
    });
  } catch (error) {
    console.error("Update Event Error:", error);

    res.status(500).json({
      message: "Event update नहीं हो पाया",
    });
  }
});

// DELETE EVENT - Admin Panel
app.delete("/api/events/:id", auth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event नहीं मिला",
      });
    }

    res.json({
      message: "Event successfully deleted",
    });
  } catch (error) {
    console.error("Delete Event Error:", error);

    res.status(500).json({
      message: "Event delete नहीं हो पाया",
    });
  }
});

// GET PUBLIC EVENTS - Frontend
app.get("/api/public/events", async (req, res) => {
  try {
    const events = await Event.find({
      status: "प्रकाशित",
    }).sort({
      date: 1,
      time: 1,
    });

    res.json(events);
  } catch (error) {
    console.error("Public Events Error:", error);

    res.status(500).json({
      message: "Public events fetch नहीं हो पाए",
    });
  }
});

//leader
app.get("/api/public/leaders", async (req, res) => {
  try {
    const leaders = await Leader.find({
      status: "प्रकाशित",
    }).sort({ createdAt: -1 });

    res.json(leaders);
  } catch (error) {
    console.error("Public leaders error:", error);

    res.status(500).json({
      message: "Leaders fetch नहीं हो पाए",
    });
  }
});

// ===============================
// PUBLIC SINGLE ISSUE
// ===============================
app.get("/api/public/issues/:id", async (req, res) => {
  try {
    const issue = await Issue.findOne({
      _id: req.params.id,
      status: "प्रकाशित",
    });

    if (!issue) {
      return res.status(404).json({
        message: "मुद्दा नहीं मिला",
      });
    }

    res.json(issue);
  } catch (error) {
    console.error("Public single issue error:", error);

    res.status(500).json({
      message: "मुद्दा fetch नहीं हो पाया",
    });
  }
});

// =====================================================
// PUBLIC - OUR POLITICS / ISSUES
// =====================================================

app.get("/api/public/issues", async (req, res) => {
  try {
    const issues = await Issue.find({
      status: "प्रकाशित",
    }).sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    console.error("Public issues error:", error);

    res.status(500).json({
      message: "मुद्दे प्राप्त नहीं हो पाए",
    });
  }
});
// =====================================================
// ADMIN - ISSUES
// =====================================================

// GET ALL ISSUES
app.get("/api/issues", auth, async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    console.error("Issues fetch error:", error);

    res.status(500).json({
      message: "मुद्दे प्राप्त नहीं हो पाए",
    });
  }
});

// ADD ISSUE
app.post("/api/issues", auth, async (req, res) => {
  try {
    const { title, category, shortDescription, description, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "मुद्दे का नाम आवश्यक है",
      });
    }

    const issue = new Issue({
      title: title.trim(),
      category: category?.trim() || "सामान्य",
      shortDescription: shortDescription?.trim() || "",
      description: description?.trim() || "",
      status: status || "प्रकाशित",
    });

    const savedIssue = await issue.save();

    res.status(201).json(savedIssue);
  } catch (error) {
    console.error("Issue create error:", error);

    res.status(500).json({
      message: "मुद्दा जोड़ने में समस्या हुई",
    });
  }
});

// UPDATE ISSUE
app.put("/api/issues/:id", auth, async (req, res) => {
  try {
    const { title, category, shortDescription, description, status } = req.body;

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      {
        title: title?.trim(),
        category: category?.trim() || "सामान्य",
        shortDescription: shortDescription?.trim() || "",
        description: description?.trim() || "",
        status: status || "प्रकाशित",
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!issue) {
      return res.status(404).json({
        message: "मुद्दा नहीं मिला",
      });
    }

    res.json(issue);
  } catch (error) {
    console.error("Issue update error:", error);

    res.status(500).json({
      message: "मुद्दा अपडेट नहीं हो पाया",
    });
  }
});

// DELETE ISSUE
app.delete("/api/issues/:id", auth, async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);

    if (!issue) {
      return res.status(404).json({
        message: "मुद्दा नहीं मिला",
      });
    }

    res.json({
      message: "मुद्दा सफलतापूर्वक हटाया गया",
    });
  } catch (error) {
    console.error("Issue delete error:", error);

    res.status(500).json({
      message: "मुद्दा हटाया नहीं जा सका",
    });
  }
});

app.get("/api/donations", auth, async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    console.error("Get donations error:", error);

    res.status(500).json({
      message: "Donations fetch नहीं हो पाए",
    });
  }
});
// =====================================================
// CREATE RAZORPAY DONATION ORDER
// =====================================================

app.post("/api/donations/create-order", async (req, res) => {
  try {
    const { donorName, phone, email, amount, message } = req.body;

    if (!donorName || !phone || !amount) {
      return res.status(400).json({
        message: "नाम, मोबाइल और राशि आवश्यक है",
      });
    }

    const donationAmount = Number(amount);

    if (!Number.isFinite(donationAmount) || donationAmount <= 0) {
      return res.status(400).json({
        message: "कृपया सही donation amount दर्ज करें",
      });
    }

    // Amount must be sent to Razorpay in paise
    const amountInPaise = Math.round(donationAmount * 100);

    const receipt = `donation_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        donorName,
        phone,
        email: email || "",
      },
    });

    // Save donation before payment
    const donation = await Donation.create({
      donorName,
      phone,
      email: email || "",
      amount: donationAmount,
      paymentMethod: "Razorpay",
      razorpayOrderId: order.id,
      message: message || "",
      status: "भुगतान शुरू",
    });

    res.status(201).json({
      message: "Razorpay order created",
      key: process.env.RAZORPAY_KEY_ID,

      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },

      donationId: donation._id,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);

    res.status(500).json({
      message: "Payment order create नहीं हो पाया",
    });
  }
});

// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

app.post("/api/donations/verify-payment", async (req, res) => {
  try {
    const {
      donationId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !donationId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Payment verification data incomplete",
      });
    }

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({
        message: "Donation record नहीं मिला",
      });
    }

    // Make sure order belongs to this donation
    if (donation.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        message: "Invalid Razorpay order",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      donation.status = "असफल";

      await donation.save();

      return res.status(400).json({
        message: "Payment signature verification failed",
      });
    }

    donation.razorpayPaymentId = razorpay_payment_id;

    donation.razorpaySignature = razorpay_signature;

    donation.transactionId = razorpay_payment_id;

    donation.status = "सत्यापित";

    await donation.save();

    res.json({
      success: true,
      message: "Payment successfully verified",
      donation,
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    res.status(500).json({
      message: "Payment verification नहीं हो पाया",
    });
  }
});

// ==========================================
// DELETE DONATION
// ==========================================

app.delete("/api/donations/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await Donation.findById(id);

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    await Donation.findByIdAndDelete(id);

    res.json({
      message: "Donation deleted successfully",
    });
  } catch (error) {
    console.error("Delete donation error:", error);

    res.status(500).json({
      message: "Donation delete नहीं हो पाया",
    });
  }
});

// GET donations
app.get("/api/donations", auth, async (req, res) => {
  // ...
});

// CREATE ORDER
app.post("/api/donations/create-order", async (req, res) => {
  // ...
});

// VERIFY PAYMENT
app.post("/api/donations/verify-payment", async (req, res) => {
  // ...
});

// UPDATE STATUS
app.put("/api/donations/:id/status", auth, async (req, res) => {
  // ...
});

// DELETE
app.delete("/api/donations/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const donation = await Donation.findById(id);

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found",
      });
    }

    await Donation.findByIdAndDelete(id);

    res.json({
      message: "Donation deleted successfully",
    });
  } catch (error) {
    console.error("Delete donation error:", error);

    res.status(500).json({
      message: "Donation delete नहीं हो पाया",
    });
  }
});

// ==========================================
// SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
