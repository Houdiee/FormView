import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, type FormProps } from "antd";
import { Link } from "react-router";
import { validateEmail, validateText } from "../common/validator";
import loginHandler from "../handlers/LoginHandler";
import { useNavigate } from "react-router";
import axios from "axios";
import { useState } from "react";

export type LoginFormValues = {
  email?: string;
  password?: string;
};

export default function LoginForm() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const onFinish: FormProps<LoginFormValues>['onFinish'] = async (values) => {
    setSubmitting(true);
    try {
      const reponse = await loginHandler(values);
      localStorage.setItem("token", reponse.data.token);
      navigate("/admin");
    }
    catch (error) {
      let errorMessage = "An unexpected problem occurred";

      if (axios.isAxiosError(error) && error.response?.data.error) {
        errorMessage = error.response.data.error;
      }

      api["error"]({
        message: "Sign Up Failed",
        description: errorMessage,
      });
    }
    finally {
      setSubmitting(false);
    }
  };

  const onFinishFailed: FormProps<LoginFormValues>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="w-100"
      >
        <Form.Item<LoginFormValues>
          name="email"
          rules={validateEmail(true)}
        >
          <Input placeholder="Email" prefix={ <UserOutlined/> } />
        </Form.Item>

        <Form.Item<LoginFormValues>
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
            disabled={submitting}
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

    </>
  );
}
