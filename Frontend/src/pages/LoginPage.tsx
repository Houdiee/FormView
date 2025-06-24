import { Card, Flex } from "antd";
import LoginForm from "../components/LoginForm";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  return (
    <>
      <Navbar/>
      <Flex className="justify-center !mt-50">
        <Card>
          <LoginForm />
        </Card>
      </Flex>
    </>
  );
}
