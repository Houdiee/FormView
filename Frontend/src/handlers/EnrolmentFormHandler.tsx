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

export default async function enrolmentFormHandler(req: EnrolmentFormValues) {
  try {
    const payload: EnrolmentPayload = {
      firstName: req.firstName!,
      middleName: req.middleName! || null,
      lastName: req.lastName!,
      email: req.email!,
      dateOfBirth: req.dateOfBirth!.format("DD/MM/YYYY"),
      age: parseInt(req.age!, 10),
      gender: req.gender!,
      countryOfBirth: req.countryOfBirth!,
      countryOfCitizenship: req.countryOfCitizenship!,
      siblings: req.siblings || [],
    };

    await axios.post(`${API_BACKEND_URL}/forms/enrolment`, payload);
  } catch (error) {
    throw error;
  }
}
