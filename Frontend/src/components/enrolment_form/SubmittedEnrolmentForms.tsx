import { useEffect, useState } from "react";
import { type EnrolmentPayload } from "../../handlers/EnrolmentFormHandler";
import axios from "axios";
import { API_BACKEND_URL } from "../../main";
import { Flex, Table } from "antd";
import countries from "country-list";
import dayjs from "dayjs";
import Search from "antd/es/input/Search";

export default function SubmittedEnrolmentForms() {
  const [forms, setForms] = useState<EnrolmentPayload[]>([])
  const [search, setSearch] = useState("");

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: "Middle Name(s)",
      dataIndex: "middleName",
      sorter: (a, b) => (a.middleName || "").localeCompare(b.middleName || ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Date of birth",
      dataIndex: "dateOfBirth",
      render: (dateOfBirth: string) => dayjs(dateOfBirth).format("DD/MM/YYYY"),
      sorter: (a, b) => dayjs(a.dateOfBirth).unix() - dayjs(b.dateOfBirth).unix(),
    },
    {
      title: "Age",
      dataIndex: "age",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      sorter: (a, b) => a.gender.localeCompare(b.gender),
    },
    {
      title: "Country of birth",
      dataIndex: "countryOfBirth",
      render: (countryCode: string) => countries.getName(countryCode),
      sorter: (a, b) => a.countryOfBirth.localeCompare(b.countryOfBirth),
    },
    {
      title: "Country of citizenship",
      dataIndex: "countryOfCitizenship",
      render: (countryCode: string) => countries.getName(countryCode),
      sorter: (a, b) => a.countryOfCitizenship.localeCompare(b.countryOfCitizenship),
    },
    {
      title: "Siblings",
      dataIndex: "siblings",
    },
    {
      title: "Submitted on",
      dataIndex: "createdAt",
      render: (createdAt: string) => dayjs(createdAt).format("DD/MM/YYYY hh:mm a"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
  ];

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get<EnrolmentPayload[]>(`${API_BACKEND_URL}/forms/enrolment?search=${encodeURIComponent(search)}`);
        setForms(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchForms();
  }, [search]);

  return (
    <>
      <Flex vertical>
        <Search
          placeholder="Search by name or email"
          allowClear
          enterButton="Search"
          size="large"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onSearch={e => setSearch(e)}
          style={{ maxWidth: 500 }}
        />
        <Table size="small" dataSource={forms} columns={columns}/>
      </Flex>
    </>
  );
}
