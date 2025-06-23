import axios from "axios";
import { API_BACKEND_URL } from "../main";
import type { EnrolmentFormValues, SiblingFormValues } from "../components/enrolment_form/EnrolmentForm";

export type EnrolmentPayload = {
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  dateOfBirth: string;
  age: number;
  gender: "male" | "female";
  countryOfBirth: string;
  countryOfCitizenship: string;
  siblings: SiblingFormValues[];
}

export default async function enrolmentFormHandler(req: EnrolmentFormValues, method: "POST" | "PUT", id?: number) {
  try {
    const payload: EnrolmentPayload = {
      firstName: req.firstName!,
      middleName: req.middleName! || null,
      lastName: req.lastName!,
      email: req.email!,
      dateOfBirth: req.dateOfBirth!.format("DD/MM/YYYY"),
      age: parseInt(req.age!),
      gender: req.gender!,
      countryOfBirth: req.countryOfBirth!,
      countryOfCitizenship: req.countryOfCitizenship!,
      siblings: req.siblings || [],
    };

    let response;
    switch (method) {
      case "POST":
        response = await axios.post(`${API_BACKEND_URL}/forms/enrolments`, payload);
        break;

      case "PUT":
        response = await axios.put(`${API_BACKEND_URL}/forms/enrolments/${id}`, payload);
        break;

      default:
        throw new Error(`Invalid HTTP method: ${method}`);
    }
    return response;

  } catch (error) {
    throw error;
  }
}
