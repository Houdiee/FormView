import { useEffect, useState } from "react";
import enrolmentFormHandler, { type EnrolmentFormDto } from "../../handlers/EnrolmentFormHandler";
import axios, { isAxiosError } from "axios";
import { API_BACKEND_URL } from "../../main";
import { Button, Flex, notification, Popconfirm, Table } from "antd";
import countries from "country-list";
import dayjs from "dayjs";
import Search from "antd/es/input/Search";
import { useNavigate } from "react-router";
import { DeleteOutlined } from "@ant-design/icons";

export default function SubmittedEnrolmentForms() {
  const [forms, setForms] = useState<EnrolmentFormDto[]>([])
  const [search, setSearch] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    try {
      await enrolmentFormHandler({
        method: "DELETE",
        id: id,
        token: localStorage.getItem("token") || undefined,
      });
      setForms(prevForms => prevForms.filter(form => form.id !== id));
    } catch (error) {
      let errorMsg = "An unexpected problem occurred";

      if (isAxiosError(error) && error.response) {
        errorMsg = error.response.data.error;
      }

      api.error({
        message: "Failed to delete form",
        description: errorMsg,
      });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 50,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      // @ts-ignore
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      ellipsis: true,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      // @ts-ignore
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      ellipsis: true,
    },
    {
      title: "Middle Name(s)",
      dataIndex: "middleName",
      // @ts-ignore
      sorter: (a, b) => (a.middleName || "").localeCompare(b.middleName || ""),
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      // @ts-ignore
      sorter: (a, b) => a.email.localeCompare(b.email),
      ellipsis: true,
    },
    {
      title: "Date of birth",
      dataIndex: "dateOfBirth",
      render: (dateOfBirth: string) => dayjs(dateOfBirth).format("DD/MM/YYYY"),
      // @ts-ignore
      sorter: (a, b) => dayjs(a.dateOfBirth).unix() - dayjs(b.dateOfBirth).unix(),
    },
    {
      title: "Age",
      dataIndex: "age",
      // @ts-ignore
      sorter: (a, b) => a.age - b.age,
      width: 60,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      // @ts-ignore
      sorter: (a, b) => a.gender.localeCompare(b.gender),
      width: 85,
    },
    {
      title: "Country of birth",
      dataIndex: "countryOfBirth",
      render: (countryCode: string) => countries.getName(countryCode),
      // @ts-ignore
      sorter: (a, b) => a.countryOfBirth.localeCompare(b.countryOfBirth),
    },
    {
      title: "Country of citizenship",
      dataIndex: "countryOfCitizenship",
      render: (countryCode: string) => countries.getName(countryCode),
      // @ts-ignore
      sorter: (a, b) => a.countryOfCitizenship.localeCompare(b.countryOfCitizenship),
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
                 {sibling.firstName}
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
      // @ts-ignore
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: "Action",
      // @ts-ignore
      render: (_, record) => (
        <Popconfirm
          title="Delete form"
          onConfirm={async (e) => {
            e?.stopPropagation();
            await handleDelete(record.id!);
          }}
          onCancel={(e) => {
            e?.stopPropagation();
          }}
          okText="Yes"
          okType="danger"
          cancelText="No"
        >
          <Button
            onClick={(e) => e.stopPropagation()}
            type="link" danger icon={<DeleteOutlined />}
          />
        </Popconfirm>
      ),
    },
  ];


  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get<EnrolmentFormDto[]>(
          `${API_BACKEND_URL}/forms/enrolments?search=${encodeURIComponent(search)}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}
        });
        setForms(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchForms();
  }, [search]);

  return (
    <>
      {contextHolder}
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
          className="cursor-pointer h-150"
          onRow={(record) => {
            return {
              //@ts-ignore
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
