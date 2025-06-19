import { Card, Flex } from "antd";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <Flex className="h-screen justify-center items-center">
        <Card>
          <LoginForm />
        </Card>
      </Flex>
    </>
  );
}
