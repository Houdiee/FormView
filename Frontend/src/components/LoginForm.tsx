import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, type FormProps } from "antd";
import { Link } from "react-router";
import { validateEmail, validateText } from "../common/validator";

export default function LoginForm() {
  type FieldType = {
    email?: string;
    password?: string;
  };

  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className="w-100"
    >
      <Form.Item<FieldType>
        name="email"
        rules={validateEmail(true)}
      >
        <Input placeholder="Email" prefix={ <UserOutlined/> } />
      </Form.Item>

      <Form.Item<FieldType>
        name="password"
        hasFeedback
        rules={validateText(true)}
      >
        <Input.Password
          placeholder="Password"
          type="password"
          prefix={ <LockOutlined/> }
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="!w-full"
        >
          Log In
        </Button>
      </Form.Item>

      <Link to="/signup">
        <Button type="link" className="w-full">
          Don't have an account? Request one here
        </Button>
      </Link>
    </Form>
  );
}
