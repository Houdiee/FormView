import { useEffect, useState } from "react";
import { type EnrolmentPayload } from "../handlers/EnrolmentFormHandler";
import axios from "axios";
import { API_BACKEND_URL } from "../main";
import { Table, type TableProps } from "antd";
import countries from "country-list";
import dayjs from "dayjs";

export default function SubmittedFormsList() {
  const [forms, setForms] = useState<EnrolmentPayload[]>([])

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Date of birth",
      dataIndex: "dateOfBirth",
      render: (dateOfBirth: string) => dayjs(dateOfBirth).format("DD/MM/YYYY")
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Gender",
      dataIndex: "gender",
    },
    {
      title: "Country of birth",
      dataIndex: "countryOfBirth",
      render: (countryCode: string) => countries.getName(countryCode),
    },
    {
      title: "Country of citizenship",
      dataIndex: "countryOfCitizenship",
      render: (countryCode: string) => countries.getName(countryCode),
    },
    {
      title: "Siblings",
      dataIndex: "siblings",
    },
    {
      title: "Submitted on",
      dataIndex: "createdAt",
      render: (createdAt: string) => dayjs(createdAt).format("DD/MM/YYYY hh:mm a")
    },
  ];

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get<EnrolmentPayload[]>(`${API_BACKEND_URL}/forms/enrolment`);
        setForms(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchForms();
  }, []);

  return (
    <>
      <Table dataSource={forms} columns={columns}/>

    </>
  );
}
