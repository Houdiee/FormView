import { Card, Flex } from "antd";
import SubmittedEnrolmentForms from "../../components/enrolment_form/SubmittedEnrolmentForms";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminAllEnrolmentFormsPage() {
  return (
    <>
      <AdminNavbar/>
      <Flex className="justify-center !p-10">
        <Card>
          <SubmittedEnrolmentForms/>
        </Card>
      </Flex>
    </>
  );
}
