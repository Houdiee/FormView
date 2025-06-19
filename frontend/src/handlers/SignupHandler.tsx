import axios from "axios";
import { API_BACKEND_URL } from "../main";

type SignupRequest =  {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default async function signupHandler(req: SignupRequest) {
  try {
    await Promise.all([
      axios.post(`${API_BACKEND_URL}/pending/request`, {
        "first_name": req.firstName,
        "last_name": req.lastName,
        "email": req.email,
      }),

      axios.post(`${API_BACKEND_URL}/pending/users`, {
        "first_name": req.firstName,
        "last_name": req.lastName,
        "email": req.email,
        "password": req.password,
      }),
    ]);
  } catch (error) {
    throw error;
  }
}
