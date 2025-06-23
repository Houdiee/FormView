import { Card, Flex } from "antd";
import SubmittedEnrolmentForms from "../components/enrolment_form/SubmittedEnrolmentForms";

export default function AdminEnrolmentFormPage() {
  return (
    <>
      <Flex className="justify-center !mt-15">
        <Card>
          <SubmittedEnrolmentForms/>
        </Card>
      </Flex>
    </>
  );
}
