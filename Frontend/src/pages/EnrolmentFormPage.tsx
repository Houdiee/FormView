import { Card, Flex, Result } from "antd";
import StudentForm from "../components/enrolment_form/EnrolmentForm";
import { useState } from "react";

export default function EnrolFormPage() {
  const [success, setSuccess] = useState<boolean>(false);

  const formSubmitSuccessful = (isSuccessful: boolean) => {
    setSuccess(isSuccessful);
  };

  return (
    <>
      <Flex className="justify-center !mt-15">
          <Card className="w-200">
            {success ?
              <Result
                status={success ? "success" : "error"}
                title="Your form has been submitted"
                subTitle="Your form is up for review. You can safely close this tab."
              />
              : <StudentForm onSubmitSuccessful={formSubmitSuccessful}/>
          }
          </Card>
      </Flex>
    </>
  );
}
