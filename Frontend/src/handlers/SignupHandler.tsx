import axios from "axios";
import { API_BACKEND_URL } from "../main";
import type { SignupFormValues } from "../components/SignupForm";

export default async function signupHandler(req: SignupFormValues) {
  try {
    await axios.post(`${API_BACKEND_URL}/pending/signup`, {
      "firstName": req.firstName!,
      "lastName": req.lastName!,
      "email": req.email!,
      "password": req.password!,
      "confirmPassword": req.confirmPassword!,
    });
  } catch (error) {
    throw error;
  }
}
