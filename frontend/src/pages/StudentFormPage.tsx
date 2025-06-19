import { Card, Flex } from "antd";
import StudentForm from "../components/StudentForm";

export default function StudentFormPage() {
  return (
    <>
      <Flex justify="center" align="flex-start" className="!mt-10">
          <Card className="w-200">
            <StudentForm/>
          </Card>
      </Flex>
    </>
  );
}
