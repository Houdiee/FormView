import { useEffect, useState } from "react";
import { type EnrolmentPayload } from "../../handlers/EnrolmentFormHandler";
import axios from "axios";
import { API_BACKEND_URL } from "../../main";
import { Flex, Table } from "antd";
import countries from "country-list";
import dayjs from "dayjs";
import Search from "antd/es/input/Search";
import { useNavigate } from "react-router";

export default function SubmittedEnrolmentForms() {
  const [forms, setForms] = useState<EnrolmentPayload[]>([])
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 50,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      width: 150,
      ellipsis: true,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      width: 150,
      ellipsis: true,
    },
    {
      title: "Middle Name(s)",
      dataIndex: "middleName",
      sorter: (a, b) => (a.middleName || "").localeCompare(b.middleName || ""),
      width: 150,
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      width: 150,
      ellipsis: true,
    },
    {
      title: "Date of birth",
      dataIndex: "dateOfBirth",
      render: (dateOfBirth: string) => dayjs(dateOfBirth).format("DD/MM/YYYY"),
      sorter: (a, b) => dayjs(a.dateOfBirth).unix() - dayjs(b.dateOfBirth).unix(),
      width: 115,
      ellipsis: true,
    },
    {
      title: "Age",
      dataIndex: "age",
      sorter: (a, b) => a.age - b.age,
      width: 60,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      sorter: (a, b) => a.gender.localeCompare(b.gender),
      width: 85,
    },
    {
      title: "Country of birth",
      dataIndex: "countryOfBirth",
      render: (countryCode: string) => countries.getName(countryCode),
      sorter: (a, b) => a.countryOfBirth.localeCompare(b.countryOfBirth),
      width: 140,
      ellipsis: true,
    },
    {
      title: "Country of citizenship",
      dataIndex: "countryOfCitizenship",
      render: (countryCode: string) => countries.getName(countryCode),
      sorter: (a, b) => a.countryOfCitizenship.localeCompare(b.countryOfCitizenship),
      width: 140,
      ellipsis: true,
    },
    {
      title: "Siblings",
      dataIndex: "siblings",
      render: (siblings: { firstName: string; lastName: string }[]) => {
         if (!siblings || siblings.length === 0) {
           return "N/A";
         }
         return (
           <ul>
             {siblings.map((sibling, index) => (
               <li key={index}>
                 {sibling.firstName},
               </li>
             ))}
           </ul>
         );
       },
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
        const response = await axios.get<EnrolmentPayload[]>(`${API_BACKEND_URL}/forms/enrolments?search=${encodeURIComponent(search)}`);
        setForms(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchForms();
  }, [search]);

  return (
    <>
      <Flex vertical gap={30}>
        <Search
          placeholder="Search by name or email"
          allowClear
          enterButton="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onSearch={e => setSearch(e)}
        />
        <Table
          rowKey="id"
          dataSource={forms}
          columns={columns}
          size="small"
          className="cursor-pointer"
          onRow={(record) => {
            return {
              onClick: (event) => {
                navigate(`${record.id}`);
              },
            };
          }}
        />
      </Flex>
    </>
  );
}
