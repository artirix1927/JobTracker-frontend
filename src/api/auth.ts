import api, { authApi } from "./axios";

export const login = async (email: string, password: string, isRememberMe: boolean) => {
  const res = await authApi.post("/auth/login", {
    email,
    password,
    isRememberMe,
  });

  const data = res.data;

  if (data.require2FA) {
    return data;
  }

  const { accessToken, refreshToken } = data;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  return data;
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  return authApi.post("/auth/register", {
    name,
    email,
    password,
  });
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch {
    // ignore – user is logging out anyway
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

export const verify2fa = async (email: string, code: number, isRememberMe: boolean) => {
  const res = await authApi.post("/auth/verify-2fa", {
    email,
    code,
    isRememberMe,
  });

  const { accessToken, refreshToken } = res.data;

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  return res.data;
};


// Supposed to be used when user already logged in so we use regular api instance
export const enable2FA = async () => {
  const res = await api.post("/auth/enable-2fa");
  return res.data;
}

export const verify2FaSetup = async (code: number) => {
  const res = await api.post("/auth/verify-2fa-setup", { code });
  return res.data;
}

