export const endpoints = {
  auth: {
    login: "/auth/login",
    signup: "/auth/register",
    refresh: "/auth/refresh",
    username: "/auth/username",
    verifyOtp: "/auth/verify",
  },

  profile: "/users/me",
  users: { getAll: "/users" },
  reports: { getAll: "/reports" },
  reviews: {
    getAll: "/reviews",
    getQRCode: "/reviews/review-card",
  },
  business: {
    getAll: "/business",
    profile: "/business/profile",
  },
};
