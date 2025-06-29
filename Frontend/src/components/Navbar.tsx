import { EditOutlined, ProfileFilled, UserOutlined } from '@ant-design/icons';
import { Flex, Menu, Typography } from 'antd';
import { Link } from 'react-router';

export default function Navbar() {
  const items = [
    {
      key: "available-forms",
      label: (
        <Link to="/">
          Available Forms
        </Link>
      ),
      icon: <EditOutlined />,
    },
    {
      key: "im-an-admin",
      label: (
        <Link to="/login">
          I'm an admin
        </Link>
      ),
      icon: <UserOutlined />,
    },
  ];

  return (
    <Flex
      justify="start"
      align="center"
      className="bg-white h-20"
    >
      <Link to="/" className="ml-6 mt-2">
        <Typography.Title level={3}>
          <ProfileFilled/> FormView
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
