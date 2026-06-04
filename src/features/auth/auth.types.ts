// src/features/auth/auth.types.ts

export type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type LogoutPayload = {
  refreshToken: string;
};

export type LoginResponse = {
  data: {
    accessToken: string;

    features: string[];

    fullname: string;

    refreshToken: string;
    role: string;

    token: string;

    username: string;
  };
};
