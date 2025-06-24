import { FormOutlined } from "@ant-design/icons";
import { Card, Flex, List, Typography } from "antd";
import { Link } from "react-router";

export default function HomePage() {
  return (
    <>
    <Flex className="justify-center !mt-20">
      <Card className="w-150">
        <Typography.Title level={2}>
          <FormOutlined/> Available Forms
        </Typography.Title>
        <List>
          <Link to="forms/enrolment">
            <Typography.Link className="!text-base">Enrolment Form</Typography.Link>
          </Link>
        </List>
      </Card>
    </Flex>
    </>
  );
}
