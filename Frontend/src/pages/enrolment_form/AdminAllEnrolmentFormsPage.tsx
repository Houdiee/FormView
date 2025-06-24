import { Card, Flex } from "antd";
import SubmittedEnrolmentForms from "../../components/enrolment_form/SubmittedEnrolmentForms";

export default function AdminAllEnrolmentFormsPage() {
  return (
    <>
      <Flex className="justify-center !mt-15 !p-10">
        <Card>
          <SubmittedEnrolmentForms/>
        </Card>
      </Flex>
    </>
  );
}
