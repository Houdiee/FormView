import axios from "axios";
import type { LoginFormValues } from "../components/LoginForm";
import { API_BACKEND_URL } from "../main";

export default async function loginHandler(values: LoginFormValues) {
 try {
   const response = await axios.post(`${API_BACKEND_URL}/login`, {
     "email": values.email!,
     "password": values.password!,
   });
   return response;
 } catch (error) {
  throw error;
  }
}
