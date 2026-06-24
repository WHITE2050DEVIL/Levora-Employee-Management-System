const DecodedToken = require("../utility/DecodedToken");

// ==========================================
// 1. JWT VERIFICATION (Standard for everyone)
// ==========================================
const CheckEmployeeAuth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Session Expired. Please Login." });
        }

        const token = authorization.split(" ")[1];
        const decoded = await DecodedToken(token);

        if (!decoded || !decoded.id) {
            return res.status(401).json({ success: false, message: "Invalid Session" });
        }

        // Attach data directly from decoded token payload
        req.EmployeeId = decoded.id;
        req.Email = decoded.Email; 
        req.Roles = decoded.Roles; // Raw role string from database (e.g., "admin", "Admin", or "ADMIN")

        next();
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error("Auth Error:", error);
        }
        return res.status(401).json({ success: false, message: "Unauthorized Access" });
    }
};

// ==========================================
// 2. HOD ROLE CHECK (CASE-INSENSITIVE)
// ==========================================
const CheckHodAuth = async (req, res, next) => {
    // 👇 FIXED: Convert to uppercase to prevent "hod" or "Hod" from being rejected
    const userRole = req.Roles?.toUpperCase();

    if (userRole === "HOD" || userRole === "ADMIN") {
        return next();
    }
    return res.status(403).json({ success: false, message: "Access Denied: HOD Access Required" });
};

// ==========================================
// 3. ADMIN ROLE CHECK (CASE-INSENSITIVE)
// ==========================================
const CheckAdminAuth = async (req, res, next) => {
    // 👇 FIXED: Convert to uppercase to prevent lowercase database strings from causing an access denial
    if (req.Roles?.toUpperCase() === "ADMIN") {
        return next();
    }
    return res.status(403).json({ success: false, message: "Access Denied: Administrative Privileges Required" });
};

module.exports = {
    CheckEmployeeAuth,
    CheckHodAuth,
    CheckAdminAuth,
};
