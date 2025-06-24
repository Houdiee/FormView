import { Card, Flex, List, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { API_BACKEND_URL } from "../main";
import AdminNavbar from "../components/AdminNavbar";

type DashboardFormItem = {
  formName: string,
  formSubmissionCount: number,
  formUrlPath: string,
}

export default function AdminDashboardPage() {
  const [formsList, setFormsList] = useState<DashboardFormItem[]>([]);

  useEffect(() => {
    const fetchForms = async () => {
      const response = await axios.get<DashboardFormItem[]>(`${API_BACKEND_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setFormsList(response.data);
    };

    fetchForms();
  }, []);

  return (
    <>
      <AdminNavbar/>
      <Flex className="justify-center !mt-20">
        <Card className="w-150">
          <Typography.Title level={2}>
            Dashboard
          </Typography.Title>

          <List
            dataSource={formsList}
            renderItem={item =>
              <List.Item>
                <Link to={item.formUrlPath}>
                  <Typography.Link className="!text-base">
                    {item.formName} ({item.formSubmissionCount})
                  </Typography.Link>
                </Link>
              </List.Item>
            }
          />
        </Card>
      </Flex>
    </>
  );
}
