import { Button, Card, Flex, Space } from "antd";
import EnrolmentForm from "../../components/enrolment_form/EnrolmentForm";
import { useParams } from "react-router";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminEnrolmentFormPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <AdminNavbar/>
      <Flex className="justify-center !mt-6">
          <Card className="w-200">
            <EnrolmentForm formId={parseInt(id!)} onSubmitSuccessful={() => null}/>
          </Card>
      </Flex>
    </>
  );
}
