import axios from "axios";
import { API_BACKEND_URL } from "../main";
import type { SignupFormValues } from "../components/SignupForm";

export default async function signupHandler(req: SignupFormValues) {
  try {
    const response = await axios.post(`${API_BACKEND_URL}/pending/signup`, {
      "firstName": req.firstName!,
      "lastName": req.lastName!,
      "email": req.email!,
      "password": req.password!,
      "confirmPassword": req.confirmPassword!,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
