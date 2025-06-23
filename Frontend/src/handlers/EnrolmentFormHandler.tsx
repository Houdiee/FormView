import axios from "axios";
import { API_BACKEND_URL } from "../main";
import type { EnrolmentFormValues } from "../components/EnrolForm";

export default async function enrolmentFormHandler(req: EnrolmentFormValues) {
  try {
    await axios.post(`${API_BACKEND_URL}/forms/enrolment`, {
      "firstName": req.firstName,
      "middleName": req.middleName || null,
      "lastName": req.lastName,
      "email": req.email,
      "dateOfBirth": req.dateOfBirth!.format("DD/MM/YYYY"),
      "age": parseInt(req.age!, 10),
      "gender": req.gender,
      "countryOfBirth": req.countryOfBirth,
      "countryOfCitizenship": req.countryOfCitizenship,
      "siblings": req.siblings || [],
    });
  } catch (error) {
    throw error;
  }
}
