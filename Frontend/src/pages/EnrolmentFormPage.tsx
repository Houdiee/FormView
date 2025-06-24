import { Card, Flex, Result } from "antd";
import StudentForm from "../components/enrolment_form/EnrolmentForm";
import { useState } from "react";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router";

export default function EnrolFormPage() {
  const [success, setSuccess] = useState<boolean>(false);

  const formSubmitSuccessful = (isSuccessful: boolean) => {
    setSuccess(isSuccessful);
  };

  return (
    <>
      <Link to="/">
        <Button type="primary" className="m-2"><ArrowLeftOutlined/>Back</Button>
      </Link>
      <Flex className="justify-center">
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
