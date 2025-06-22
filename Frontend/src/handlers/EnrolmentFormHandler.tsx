import axios from "axios";
import { API_BACKEND_URL } from "../main";

type EnrolmentFormRequest =  {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  age: number;
  gender: "male" | "female";
  countryOfBirth: string;
  countryOfCitizenship: string;
  siblings: string[][]
}

export default async function enrolmentformHandler(req: EnrolmentFormRequest) {
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
