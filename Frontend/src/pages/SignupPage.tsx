import { Card, Flex, Result } from "antd";
import SignupForm from "../components/SignupForm";
import { useState } from "react";

export default function SignupPage() {
  const [success, setSuccess] = useState<boolean>(false);

  const signupSuccessful = (isSuccessful: boolean) => {
    setSuccess(isSuccessful);
  };

  return (
    <>
      <Flex className="h-screen justify-center items-center">
        <Card>
          {success ?
            <Result
              status={success ? "success" : "error"}
              title="Your Request is Pending"
              subTitle="An email will be sent to your inbox to notify if your request to become an admin was successful. You can exit this tab."
            />
          : <SignupForm onSignupSuccessful={signupSuccessful} /> }
        </Card>
      </Flex>
    </>
  );
}
