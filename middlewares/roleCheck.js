const {
  successResponse,
  errorResponse,
  unauthorized,
} = require("../utils/responseHandler");

exports.roleCheck = (allowedRoles) => {
  return (req, resp, next) => {
    if (!allowedRoles.includes(req.role)) {
      return unauthorized(resp);
    }
    next();
  };
};
