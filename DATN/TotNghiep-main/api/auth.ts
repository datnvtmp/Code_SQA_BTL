import axios from "axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: any;
}

export async function apiLogin(payload: LoginPayload): Promise<LoginResponse> {
  const res = await axios.post("http://172.20.10.2:8080/auth/login", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.data; // { token, user }
}
