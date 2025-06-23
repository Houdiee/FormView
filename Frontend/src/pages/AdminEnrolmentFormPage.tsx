import { Card, Flex } from "antd";
import SubmittedFormsList from "../components/SubmittedFormsList";

export default function AdminEnrolmentFormPage() {
  return (
    <>
      <Flex className="justify-center !mt-15">
        <Card>
          <SubmittedFormsList/>
        </Card>
      </Flex>
    </>
  );
}
