import { Card, Flex, Result } from "antd";
import SignupForm from "../components/SignupForm";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function SignupPage() {
  const [formCompleted, setFormCompleted] = useState<boolean>(false);

  const onFormCompletion = (completed: boolean) => {
    setFormCompleted(completed);
  };

  return (
    <>
      <Navbar/>
      <Flex className="justify-center !mt-35">
        <Card>
          {formCompleted ?
            <Result
              status="success"
              title="Your Request is Pending"
              subTitle="An email will be sent to your inbox to notify if your request to become an admin was successful. You can exit this tab."
            />
          : <SignupForm onFormCompletion={onFormCompletion} /> }
        </Card>
      </Flex>
    </>
  );
}
