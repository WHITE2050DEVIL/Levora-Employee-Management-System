const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

const cors = require("cors");
const hpp = require("hpp");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");

/* =========================
   APP INITIALIZATION 
========================= */

const app = express();
app.set("trust proxy", 1);


/* =========================
   ENV CONFIG
========================= */

dotenv.config();

/* =========================
   INTERNAL IMPORTS
========================= */

// ERROR HANDLERS
const {
  DefaultErrorHandler,
  NotFoundError,
} = require("./src/helper/ErrorHandler");


// DATABASE CONNECTION
const connectDB = require("./src/confiq/db");


// API ROUTES
const routes = require("./src/routes");

/* =========================
   DATABASE CONNECTION
========================= */

connectDB();

/* =========================
   SECURITY MIDDLEWARE
========================= */

// CORS
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS policy does not allow this origin"));
    },
    credentials: true,
  })
);


// HPP
app.use(hpp());


// HELMET (Updated configurations to allow local UI bundle assets to execute)
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false, 
  })
);


// MONGO SANITIZE
app.use(mongoSanitize());


// XSS CLEAN
app.use(xssClean());


/* =========================
   RATE LIMITER
========================= */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);


/* =========================
   DEFAULT MIDDLEWARE
========================= */

// JSON BODY PARSER
app.use(
  express.json({
    limit: "50mb",
  })
);


// URL ENCODED
app.use(
  express.urlencoded({
    extended: true,
  })
);


// MORGAN LOGGER
app.use(morgan("dev"));


/* =========================
   API ROUTES (Must Be Loaded First)
========================= */

app.use("/api/v1", routes);


/* =========================
   STATIC FILES & PRODUCTION UI BUILD
========================= */

// Serve public asset folder
app.use(
  "/",
  express.static(
    path.join(__dirname, "public")
  )
);

// Serve frontend assets if in production environment
if (process.env.NODE_ENV === "production") {
  // 1. Serve the compiled static assets (js, css, images)
  app.use(
    express.static(
      path.join(__dirname, "client", "build")
    )
  );

  // 2. Catch-all route to serve index.html for SPA client-side routing
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(
        __dirname,
        "client",
        "build",
        "index.html"
      )
    );
  });
} else {
  // Fallback Dev Test Route
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Leave Management Backend Running Successfully (Development Mode)",
    });
  });
}


/* =========================
   NOT FOUND ERROR
========================= */

app.use(NotFoundError);


/* =========================
   DEFAULT ERROR HANDLER
========================= */

app.use(DefaultErrorHandler);


/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));


/* =========================
   EXPORT APP
========================= */

module.exports = app;
