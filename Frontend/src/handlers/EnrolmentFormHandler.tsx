import axios from "axios";
import { API_BACKEND_URL } from "../main";
import type { EnrolmentFormValues, SiblingFormValues } from "../components/enrolment_form/EnrolmentForm";

export type EnrolmentPayload = {
  id?: number,
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

interface EnrolmentFormHandlerParams {
  method: "POST" | "PUT" | "GET" | "DELETE";
  req?: EnrolmentFormValues;
  id?: number;
  token?: string;
}

export default async function enrolmentFormHandler(
  {
    method,
    req,
    id,
    token,
  }: EnrolmentFormHandlerParams)
{
  try {
    const payload: EnrolmentPayload = {
      firstName: req?.firstName!,
      middleName: req?.middleName! || null,
      lastName: req?.lastName!,
      email: req?.email!,
      dateOfBirth: req?.dateOfBirth!.format("DD/MM/YYYY")!,
      age: parseInt(req?.age!),
      gender: req?.gender!,
      countryOfBirth: req?.countryOfBirth!,
      countryOfCitizenship: req?.countryOfCitizenship!,
      siblings: req?.siblings || [],
    };

    let response;
    switch (method) {
      case "POST":
        if (!payload) throw new Error("Payload is required for POST");
        response = await axios.post(`${API_BACKEND_URL}/forms/enrolments`, payload);
        break;

      case "PUT":
        if (!id) throw new Error("Id is required for PUT");
        if (!payload) throw new Error("Payload is required for PUT");
        if (!token) throw new Error("Token is required for PUT");
        response = await axios.put(`${API_BACKEND_URL}/forms/enrolments/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      break;

      case "GET":
        if (!token) throw new Error("Token is required for GET");
        if (id) {
          response = await axios.get(`${API_BACKEND_URL}/forms/enrolments/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } else {
          response = await axios.get(`${API_BACKEND_URL}/forms/enrolments`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }
        break;

      case "DELETE":
        if (!id) throw new Error("Id is required for GET");
        if (!token) throw new Error("Token is required for GET");
        response = await axios.delete(`${API_BACKEND_URL}/forms/enrolments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        break;
      default:
        throw new Error(`Invalid HTTP method: ${method}`);
    }
    return response;

  } catch (error) {
    throw error;
  }
}
