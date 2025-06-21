// TODO upload photo
import { Button, DatePicker, Flex, Form, Input, Radio, Select, Upload } from "antd";
import dayjs from "dayjs";
import countries from "country-list";
import getCountryFlag from "country-flag-icons/unicode";
import { useEffect } from "react";
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { validateAlphabetical, validateNotEmpty, validateNumerical } from "../util/validator";

interface EnrolFormProps {
  onSubmitSuccessful: (isSuccessful: boolean) => void
}

export default function EnrolForm({ onSubmitSuccessful }: EnrolFormProps) {
  const [form] = Form.useForm();

  const dateOfBirth = Form.useWatch('date-of-birth', form);

  const onFinish = (values: any) => {
    onSubmitSuccessful(true);
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
    <Form
      labelCol={{ span: 5 }}
      scrollToFirstError
      form={form}
      onFinish={onFinish}
    >
      <Form.Item
        name="first-name"
        label="First Name"
        hasFeedback
        rules={validateAlphabetical(true)}
      >
        <Input/>
      </Form.Item>

      <Form.Item
        name="middle-name" label="Middle Name(s)"
        hasFeedback
        rules={validateAlphabetical(false)}>
        <Input/>
      </Form.Item>

      <Form.Item
        name="last-name" label="Last Name"
        hasFeedback
        rules={validateAlphabetical(true)}>
        <Input/>
      </Form.Item>

      <Form.Item
        name="date-of-birth"
        label="Date of birth"
        rules={validateNotEmpty(true)}
        hasFeedback
      >
        <DatePicker disabledDate={current => current > dayjs()} />
      </Form.Item>

      <Form.Item
        name="age"
        label="Age"
        rules={validateNumerical(true)}
      >
        <Input/>
      </Form.Item>

      <Form.Item name="gender" label="Gender">
        <Radio.Group
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
        />
      </Form.Item>

      <Form.Item
        name="country-of-birth"
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

      <Form.Item
        name="country-of-citizenship"
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

      <Form.Item
        label="Siblings"
      >
        <Form.List name="siblings">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Flex align="baseline" gap="small" key={key}>
                  <Form.Item
                    {...restField}
                    name={[name, "first-name"]}
                    rules={validateAlphabetical(true)}
                    className="flex-grow"
                    hasFeedback
                  >
                    <Input placeholder="First Name" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, "last-name"]}
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
  );
}
