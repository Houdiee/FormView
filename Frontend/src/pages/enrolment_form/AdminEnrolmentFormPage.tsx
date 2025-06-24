import { Button, Card, Flex, Space } from "antd";
import EnrolmentForm from "../../components/enrolment_form/EnrolmentForm";
import { useParams } from "react-router";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router";

export default function AdminEnrolmentFormPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <Link to="/admin/forms/enrolments">
        <Button type="primary" className="m-2"><ArrowLeftOutlined/>Back</Button>
      </Link>
      <Flex className="justify-center">
          <Card className="w-200">
            <EnrolmentForm formId={parseInt(id!)} onSubmitSuccessful={() => null}/>
          </Card>
      </Flex>
    </>
  );
}
