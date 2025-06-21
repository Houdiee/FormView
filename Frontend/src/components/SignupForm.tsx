import { Button, Form, Input, notification, type FormProps } from "antd";
import { Link } from "react-router";
import signupHandler from "../handlers/SignupHandler";
import axios from "axios";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { validateAlphabetical, validateText } from "../util/validator";

interface SignupFormProps {
  onSignupSuccessful: (isSuccessful: boolean) => void,
}

export default function SignupForm({ onSignupSuccessful }: SignupFormProps) {
  type FieldType = {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };

  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      if (values.password === values.confirmPassword) {
        await signupHandler({
          firstName: values.firstName!,
          lastName: values.lastName!,
          email: values.email!,
          password: values.password!,
        });
        onSignupSuccessful(true);
      }
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
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
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
        autoComplete="off"
      >
        <Form.Item<FieldType>
          name="firstName"
          hasFeedback
          rules={validateAlphabetical(true)}
        >
          <Input placeholder="First Name" />
        </Form.Item>

        <Form.Item<FieldType>
          name="lastName"
          hasFeedback
          rules={validateAlphabetical(true)}
        >
          <Input placeholder="Last Name" />
        </Form.Item>

        <Form.Item<FieldType>
          name="email"
          hasFeedback
          rules={[
            { required: true, message: "Invalid email", type: "email" },
            { max: 64, message: "Email cannot be longer than 64 characters" },
          ]}
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

        <Form.Item<FieldType>
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Password confirmation cannot be empty" },
            ({ getFieldValue }) => ({ validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Passwords do not match"));
            }})
          ]}
        >
          <Input.Password
            placeholder="Confirm Password"
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
            Request an Admin Account
          </Button>
        </Form.Item>

        <Link to="/login">
          <Button type="link" className="w-full">
            Already have an account? Log in
          </Button>
        </Link>
      </Form>
    </>
  );
}
