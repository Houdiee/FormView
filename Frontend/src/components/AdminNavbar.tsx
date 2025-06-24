import { EditOutlined, LogoutOutlined, ProfileFilled } from '@ant-design/icons';
import { Menu, Flex, Typography } from 'antd';
import { Link } from 'react-router';

export default function AdminNavbar() {
  const items = [
    {
      key: "form-submissions",
      label: (
        <Link to="/admin">
          Form Submissions
        </Link>
      ),
      icon: <EditOutlined />,
    },
    {
      key: "logout",
      label: (
        <Link to="/login">
          Logout
        </Link>
      ),
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Flex
      justify="start"
      align="center"
      className="bg-white h-20"
    >
      <Link to="/admin" className="ml-6 mt-2">
        <Typography.Title level={3}>
          <ProfileFilled/> Admin Dashboard
        </Typography.Title>
      </Link>

      <Menu
        mode="horizontal"
        items={items}
        className="flex-grow justify-end h-full h"
        style={{
          lineHeight: '90px',
        }}
      />
    </Flex>
  );
}
