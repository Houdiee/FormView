import { Card, Flex } from "antd";
import EnrolmentForm from "../../components/enrolment_form/EnrolmentForm";
import { useParams } from "react-router";

export default function AdminEnrolmentFormPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <Flex className="justify-center !mt-15">
          <Card className="w-200">
            <EnrolmentForm formId={parseInt(id!)} onSubmitSuccessful={() => null}/>
          </Card>
      </Flex>
    </>
  );
}
