// TODO upload photo
import { Button, Card, DatePicker, Flex, Form, Input, notification, Radio, Select, Space, Upload, type FormProps } from "antd";
import dayjs from "dayjs";
import countries from "country-list";
import getCountryFlag from "country-flag-icons/unicode";
import { useEffect, useState } from "react";
import { EditOutlined, MinusCircleOutlined, PlusOutlined, StopOutlined, UploadOutlined } from "@ant-design/icons";
import { validateAlphabetical, validateEmail, validateNotEmpty, validateNumerical } from "../../common/validator";
import enrolmentFormHandler from "../../handlers/EnrolmentFormHandler";
import axios from "axios";
import { API_BACKEND_URL } from "../../main";

interface EnrolmentFormProps {
  onSubmitSuccessful: (isSuccessful: boolean) => void
  formId?: number,
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
  id?: string;
}

export type SiblingFormValues = {
  firstName?: string;
  lastName?: string;
};

export default function EnrolmentForm({ formId, onSubmitSuccessful }: EnrolmentFormProps) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [initialFormData, setInitialFormData] = useState<EnrolmentFormValues | null>(null);
  const [formDisabled, setFormDisabled] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const dateOfBirth = Form.useWatch("dateOfBirth", form);

  const onFinish: FormProps<EnrolmentFormValues>['onFinish'] = async (values) => {
    setSubmitting(true);
    try {
      if (formId !== undefined && formId !== null) {
        await enrolmentFormHandler(values, "PUT", formId);
        api["success"]({
          message: "Form updated",
          description: "The form has been updated",
        });
      }
      else {
        await enrolmentFormHandler(values, "POST");
        onSubmitSuccessful(true);
      }
    }
    catch (error) {
      api["error"]({
        message: "Submission failed",
        description: "An unexpected problem occurred",
      });
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const onFinishFailed: FormProps<EnrolmentFormValues>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleCancel = () => {
    if (initialFormData) {
      form.setFieldsValue(initialFormData);
    }
    setFormDisabled(true);
  };

  useEffect(() => {
    const fetchFormData = async () => {
      if (!formId) {
        return;
      }

      try {
        const fetchedData = (await axios.get(`${API_BACKEND_URL}/forms/enrolments/${formId}`)).data;
        const transformedData: EnrolmentFormValues = {
          ...fetchedData,
          siblings: fetchedData.siblings.map((sibling: any) => ({
            firstName: sibling.firstName,
            lastName: sibling.lastName,
          })),
          dateOfBirth: fetchedData.dateOfBirth ? dayjs(fetchedData.dateOfBirth) : undefined,
        };
        form.setFieldsValue(transformedData);
        setInitialFormData(transformedData);
        setFormDisabled(true);
      } catch (error) {
        api.error({
          message: "Error loading form",
          description: "Could not load the existing form data.",
        });
      }
    };

    fetchFormData();
  }, [formId]);

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
    {formId ?
      <Flex justify="end" className="!mb-4">
        {formDisabled ?
          <Button
            type="primary"
            onClick={() => setFormDisabled(false)}
            className="!bg-green-400"
          >
            <EditOutlined /> Edit
          </Button>
         :
          <Button
            type="primary"
            onClick={handleCancel}
            className="!bg-red-400"
            icon={<StopOutlined/>}
          >
            Cancel
          </Button>
        }
      </Flex>
    : null}

      <Form
        labelCol={{ span: 5 }}
        scrollToFirstError
        form={form}
        onFinish={onFinish}
        disabled={formDisabled}
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
                      name={[name, "firstName"]}
                      rules={validateAlphabetical(true)}
                      className="flex-grow"
                      hasFeedback
                    >
                      <Input placeholder="First Name" />
                    </Form.Item>
                    <Form.Item<SiblingFormValues>
                      {...restField}
                      name={[name, "lastName"]}
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
              <Button
                disabled={submitting || formDisabled}
                htmlType="submit"
                type="primary"
              >{formId ? "Update" : (submitting ? "Submitting..." : "Submit")}</Button>
          </Form.Item>
        </Flex>
      </Form>
  </>
  );
}
