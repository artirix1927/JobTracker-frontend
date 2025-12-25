import api from "./axios";

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  console.log(res.data)
  // save tokens
  localStorage.setItem("accessToken", res.data.accessToken);

  return res.data;
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  return api.post("/auth/register", {
    name,
    email,
    password,
  });
};
