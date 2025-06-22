import axios from "axios";
import { API_BACKEND_URL } from "../main";
import type { EnrolmentFormValues } from "../components/EnrolForm";

export default async function enrolmentFormHandler(req: EnrolmentFormValues) {
  try {
    axios.post(`${API_BACKEND_URL}/api/forms/enrolmentform`, {
      "firstName": req.firstName,
      "lastName": req.lastName,
      "email": req.email,
      "dateOfBirth": req.dateOfBirth,
      "age": req.age,
      "gender": req.gender,
      "countryOfBirth": req.countryOfBirth,
      "countryOfCitizenship": req.countryOfCitizenship,
      "siblings": req.siblings,
    });
  } catch (error) {
    throw error;
  }
}
