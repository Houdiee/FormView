// TODO upload photo
import { Button, DatePicker, Flex, Form, Input, notification, Radio, Select, Upload, type FormProps } from "antd";
import dayjs from "dayjs";
import countries from "country-list";
import getCountryFlag from "country-flag-icons/unicode";
import { useEffect } from "react";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { validateAlphabetical, validateEmail, validateNotEmpty, validateNumerical } from "../../common/validator";
import enrolmentFormHandler from "../../handlers/EnrolmentFormHandler";

interface EnrolmentFormProps {
  onSubmitSuccessful: (isSuccessful: boolean) => void
}

export type EnrolmentFormValues =  {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: dayjs.Dayjs;
  age?: string;
  gender?: "male" | "female";
  countryOfBirth?: string;
  countryOfCitizenship?: string;
  siblings?: SiblingFormValues[];
}

export type SiblingFormValues = {
  firstName?: string;
  lastName?: string;
};

export default function EnrolmentForm({ onSubmitSuccessful }: EnrolmentFormProps) {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const dateOfBirth = Form.useWatch("dateOfBirth", form);

  const onFinish: FormProps<EnrolmentFormValues>['onFinish'] = async (values) => {
    try {
      await enrolmentFormHandler(values);
      onSubmitSuccessful(true);
    }
    catch (error) {
      api["error"]({
        message: "Submission failed",
        description: "An unexpected problem occurred",
      });
      console.log(error);
    }
  };

  const onFinishFailed: FormProps<EnrolmentFormValues>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    if (dateOfBirth) {
      const birthDate = dayjs(dateOfBirth);
      const age = dayjs().diff(birthDate, "year");
      form.setFieldsValue({ age: String(age) });
    } else {
      form.setFieldsValue({ age: undefined });
    }
  }, [dateOfBirth, form]);

  return (
  <>
    {contextHolder}
    <Form
      labelCol={{ span: 5 }}
      scrollToFirstError
      form={form}
      onFinish={onFinish}
    >
      <Form.Item<EnrolmentFormValues>
        name="firstName"
        label="First Name"
        hasFeedback
        rules={validateAlphabetical(true)}
      >
        <Input/>
      </Form.Item>

      <Form.Item<EnrolmentFormValues>
        name="middleName" label="Middle Name(s)"
        hasFeedback
        rules={validateAlphabetical(false)}>
        <Input/>
      </Form.Item>

      <Form.Item<EnrolmentFormValues>
        name="lastName" label="Last Name"
        hasFeedback
        rules={validateAlphabetical(true)}>
        <Input/>
      </Form.Item>

      <Form.Item<EnrolmentFormValues>
        name="email" label="Email"
        hasFeedback
        rules={validateEmail(true)}>
        <Input/>
      </Form.Item>

      <Form.Item<EnrolmentFormValues>
        name="dateOfBirth"
        label="Date of birth"
        rules={validateNotEmpty(true)}
        hasFeedback
      >
        <DatePicker disabledDate={current => current > dayjs()} />
      </Form.Item>

      <Form.Item<EnrolmentFormValues>
        name="age"
        label="Age"
        rules={validateNumerical(true)}
      >
        <Input/>
      </Form.Item>

      <Form.Item<EnrolmentFormValues> name="gender" label="Gender">
        <Radio.Group
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
        />
      </Form.Item>

      <Form.Item<EnrolmentFormValues>
        name="countryOfBirth"
        label="Country of Birth"
        rules={validateNotEmpty(true)}
        hasFeedback
      >
        <Select
          showSearch
          placeholder="Select a country"
          options={countries.getCodes().map(code => ({
            countryName: countries.getName(code),
            value: code,
            label: getCountryFlag(code) + ' ' + countries.getName(code),
          }))}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            (optionA?.countryName ?? '').toLowerCase().localeCompare((optionB?.countryName ?? '').toLowerCase())
          }
        />
      </Form.Item>

      <Form.Item<EnrolmentFormValues>
        name="countryOfCitizenship"
        label="Country of Citizenship"
        rules={validateNotEmpty(true)}
        hasFeedback
      >
        <Select
          showSearch
          placeholder="Select a country"
          options={countries.getCodes().map(code => ({
            countryName: countries.getName(code),
            value: code,
            label: getCountryFlag(code) + ' ' + countries.getName(code),
          }))}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            (optionA?.countryName ?? '').toLowerCase().localeCompare((optionB?.countryName ?? '').toLowerCase())
          }
        />
      </Form.Item>

      <Form.Item<EnrolmentFormValues>
        label="Siblings"
      >
        <Form.List name="siblings">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Flex align="baseline" gap="small" key={key}>
                  <Form.Item<SiblingFormValues>
                    {...restField}
                    name={"firstName"}
                    rules={validateAlphabetical(true)}
                    className="flex-grow"
                    hasFeedback
                  >
                    <Input placeholder="First Name" />
                  </Form.Item>
                  <Form.Item<SiblingFormValues>
                    {...restField}
                    name={"lastName"}
                    rules={validateAlphabetical(true)}
                    className="flex-grow"
                    hasFeedback
                  >
                    <Input placeholder="Last Name" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Flex>
              ))}
              <Form.Item label={null}>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add sibling
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item label="Your Photo" name="photo" rules={validateNotEmpty(true)}>
        <Upload
          accept="image/*"
          maxCount={1}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>

      <Flex justify="end">
        <Form.Item>
          <Button htmlType="submit" type="primary">Submit</Button>
        </Form.Item>
      </Flex>

    </Form>

  </>
  );
}
