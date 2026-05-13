export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/user/api/v1/public/login",
    CHECK_SESSION: "/user/api/v1/public/check-session",
    OTP_SEND: "/user/api/v1/public/auth/otp/send",
    LOGOUT: "/user/api/v1/public/logout",
    RE_REQUEST_TOKEN: "/user/api/v1/public/refresh",
    OTP_VERIFY: "/user/api/v1/public/auth/otp/verify",
    PASSWORD_FORGOT: "/user/api/v1/public/password/forgot",
    PASSWORD_RESET_VERIFY: "/user/api/v1/public/password/reset/verify",
    PASSWORD_RESET: "/user/api/v1/public/password/reset",
  },
  ROLES: {
    GET_LIST: "user/api/v1/roles",
    GET_FEATURES: "user/api/v1/roles/features",
    GET_ALL_FEATURES: "user/api/v1/features/grouped",
    GET_USERS: "user/api/v1/roles/users",
    CRUD: "user/api/v1/roles",
    GET_FILTERS: "user/api/v1/roles/filters",
    CHANGE_STATUS: "user/api/v1/roles/status",
  },
  USERS: {
    GET_LIST: "user/api/v1/users",
    GET_ONE: (userId: string | number) => `user/api/v1/users/${userId}`,
    CRUD: "user/api/v1/users",
    CHANGE_STATUS: "user/api/v1/users/status",
    SEARCH_USER: "user/api/v1/users/ldap",
    GET_FILTERS: "user/api/v1/users/filters",
    GET_FEATURES: "user/api/v1/roles/features",
    USER_ACTIVATION: "user/api/v1/public/user-activation",
    GET_ALL_FEATURES: "user/api/v1/features/grouped",
    UPDATE: (userId: string | number) => `user/api/v1/users/${userId}`,
    DELETE: (userId: string | number) => `user/api/v1/users/${userId}`,
    GET_PROFILE: "user/api/v1/users/profile",
    UPLOAD_PROFILE_PICTURE: "user/api/v1/users/profile/picture-base64",
    PROFILE_PICTURE: "user/api/v1/users/profile/picture",
    UPDATE_PROFILE: "user/api/v1/users/profile",
  },
  PRODUCTS: {
    GET_LIST: "v1/product", //list products grid dan table
    GET_ONE: "v1/product",
    CREATE: "v1/product",
    UPDATE: (id: string | number) => `v1/product/${id}`,
    DELETE: (id: string | number) => `v1/product/${id}`,
  },
  CUSTOMER: {
    GET_LIST: "v1/customer", //dropdown customer filter by product
    GET_ONE: (id: string | number) => `v1/customer/${id}`, //list customer
    CREATE: "v1/customer",
    UPDATE: (id: string | number) => `v1/customer/${id}`,
    DELETE: (id: string | number) => `v1/customer/${id}`,
  },
  FEATURE: {
    GET_LIST: "v1/feature",
    GET_ONE: "v1/feature",
    CREATE: "v1/feature",
    UPDATE: (id: string | number) => `v1/feature/${id}`,
    DELETE: (id: string | number) => `v1/feature/${id}`,
  },
  CONNECTOR: {
    // hide dulu form connector
    GET_LIST: "v1/connector",
    GET_ONE: (id: string | number) => `v1/connector/${id}`,
    CREATE: "v1/connector",
    UPDATE: (id: string | number) => `v1/connector/${id}`,
    DELETE: (id: string | number) => `v1/connector/${id}`,
  },
  TIER: {
    GET_LIST: "v1/tier",
    GET_ONE: "v1/tier",
    CREATE: "v1/tier",
    UPDATE: (id: string | number) => `v1/tier/${id}`,
    DELETE: (id: string | number) => `v1/tier/${id}`,
  },
  LICENSE: {
    GET_LIST: "v1/license", //list license
    GET_ONE: (id: string | number) => `v1/license/${id}`, //detail license
  },
  ISSUANCE: {
    ISSUE: "v1/issuance/issue", // form license
    SIGN_DOWNLOAD: "/v1/issuance/sign/download",
  },
};
