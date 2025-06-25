import { Button, DatePicker, Flex, Form, Input, notification, Radio, Select, Upload, type FormProps, type UploadFile } from "antd";
import dayjs from "dayjs";
import countries from "country-list";
import getCountryFlag from "country-flag-icons/unicode";
import { useEffect, useState } from "react";
import { EditOutlined, MinusCircleOutlined, PlusOutlined, StopOutlined, UploadOutlined } from "@ant-design/icons";
import { validateAlphabetical, validateEmail, validateNotEmpty, validateNumerical } from "../../common/validator";
import enrolmentFormHandler from "../../handlers/EnrolmentFormHandler";
import { API_BACKEND_URL } from "../../main";

interface EnrolmentFormProps {
  onSubmitSuccessful: (isSuccessful: boolean) => void;
  formId?: number;
}

export type EnrolmentFormValues = {
  id?: string;
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
  filePath?: string;
}

export type SiblingFormValues = {
  firstName?: string;
  lastName?: string;
};

export default function EnrolmentForm({ formId, onSubmitSuccessful }: EnrolmentFormProps) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [initialFormData, setInitialFormData] = useState<EnrolmentFormValues | null>(null);
  const [api, contextHolder] = notification.useNotification();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);


  const dateOfBirth = Form.useWatch("dateOfBirth", form);

  const handlePhotoChange = (info: any) => {
    setFileList(info.fileList.slice(-1));

    if (info.file.status === 'uploading') {
      setUploadingPhoto(true);
    } else if (info.file.status === 'done') {
      setUploadingPhoto(false);
      const uploadedFilePath = info.file.response?.filePath;

      if (uploadedFilePath) {
        form.setFieldsValue({ filePath: uploadedFilePath });
      } else {
        api.error({
          message: "Photo Upload Failed",
          description: "No file path returned from server. Please try again.",
        });
        form.setFieldsValue({ filePath: undefined });
        setFileList([]);
      }
    } else if (info.file.status === 'removed') {
      setUploadingPhoto(false);
      form.setFieldsValue({ filePath: undefined });
      setFileList([]);
    } else if (info.file.status === 'error') { // Add this block for error handling
      setUploadingPhoto(false);
      api.error({
        message: "Photo Upload Failed",
        description: "An error occurred during photo upload. Please try again.",
      });
      form.setFieldsValue({ filePath: undefined });
      setFileList([]);
    }
  };

  const onFinish: FormProps<EnrolmentFormValues>['onFinish'] = async (values) => {
    if (!values.filePath) {
      api.error({
        message: "Submission Failed",
        description: "Please upload your photo before submitting the form.",
      });
      return;
    }

    setSubmitting(true);
    try {
      if (formId !== undefined && formId !== null) {
        await enrolmentFormHandler({
          method: "PUT",
          req: values,
          id: formId,
          token: localStorage.getItem("token") || undefined,
        });
        api["success"]({
          message: "Form updated",
          description: "The form has been updated successfully.",
        });
        setFormDisabled(true);
      }
      else {
        await enrolmentFormHandler({
          method: "POST",
          req: values,
        });
        onSubmitSuccessful(true);
        api["success"]({
            message: "Form Submitted",
            description: "The form has been submitted successfully.",
        });
      }
    }
    catch (error) {
      api["error"]({
        message: "Submission failed",
        description: "An unexpected problem occurred during submission.",
      });
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const onFinishFailed: FormProps<EnrolmentFormValues>['onFinishFailed'] = (errorInfo) => {
    console.error('Form submission failed:', errorInfo);
    api.error({
      message: "Validation Error",
      description: "Please fill in all required fields correctly.",
    });
  };

  const handleCancel = () => {
    if (initialFormData) {
      form.setFieldsValue(initialFormData);
      if (initialFormData.filePath) {
        setFileList([
          {
            uid: '-1',
            name: initialFormData.filePath.split('/').pop() || 'Existing Photo',
            status: 'done',
            url: initialFormData.filePath,
            thumbUrl: initialFormData.filePath,
          },
        ]);
      } else {
        setFileList([]);
      }
    } else {
        form.resetFields();
        setFileList([]);
    }
    setFormDisabled(true);
    setUploadingPhoto(false);
  };

  useEffect(() => {
    const fetchFormData = async () => {
      if (!formId) {
        return;
      }

      try {
        const fetchedData = (await enrolmentFormHandler({
          method: "GET",
          token: localStorage.getItem("token") || undefined,
          id: formId,
        })).data;

        const transformedData: EnrolmentFormValues = {
          ...fetchedData,
          siblings: fetchedData.siblings.map((sibling: any) => ({
            firstName: sibling.firstName,
            lastName: sibling.lastName,
          })),
          dateOfBirth: fetchedData.dateOfBirth ? dayjs(fetchedData.dateOfBirth) : undefined,
          filePath: fetchedData.filePath || undefined,
        };

        form.setFieldsValue(transformedData);
        setInitialFormData(transformedData);
        setFormDisabled(true);

        if (transformedData.filePath) {
          setFileList([
            {
              uid: '-1',
              name: transformedData.filePath.split('/').pop() || 'Existing Photo',
              status: 'done',
              url: transformedData.filePath,
              thumbUrl: transformedData.filePath,
            },
          ]);
        } else {
          setFileList([]);
        }

      } catch (error) {
        api.error({
          message: "Error loading form",
          description: "Could not load the existing form data.",
        });
        console.error("Error fetching form data:", error);
      }
    };

    fetchFormData();
  }, [formId, api, form]);

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
              icon={<StopOutlined />}
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
        onFinishFailed={onFinishFailed}
        disabled={formDisabled}
      >
        <Form.Item<EnrolmentFormValues>
          name="firstName"
          label="First Name"
          hasFeedback
          rules={validateAlphabetical(true)}
        >
          <Input />
        </Form.Item>

        <Form.Item<EnrolmentFormValues>
          name="middleName" label="Middle Name(s)"
          hasFeedback
          rules={validateAlphabetical(false)}>
          <Input />
        </Form.Item>

        <Form.Item<EnrolmentFormValues>
          name="lastName" label="Last Name"
          hasFeedback
          rules={validateAlphabetical(true)}>
          <Input />
        </Form.Item>

        <Form.Item<EnrolmentFormValues>
          name="email" label="Email"
          hasFeedback
          rules={validateEmail(true)}>
          <Input />
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
          <Input />
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
                {fields.map(field => (
                  <Flex align="baseline" gap="small" key={field.key}>
                    <Form.Item<SiblingFormValues>
                      {...field}
                      // @ts-ignore
                      name={[field.name, "firstName"]}
                      rules={validateAlphabetical(true)}
                      className="flex-grow"
                      hasFeedback
                    >
                      <Input placeholder="First Name" />
                    </Form.Item>
                    <Form.Item<SiblingFormValues>
                      {...field}
                      // @ts-ignore
                      name={[field.name, "lastName"]}
                      rules={validateAlphabetical(true)}
                      className="flex-grow"
                      hasFeedback
                    >
                      <Input placeholder="Last Name" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
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

        <Form.Item<EnrolmentFormValues>
          label="Your Photo"
          name="filePath"
          rules={validateNotEmpty(true)}
        >
          <Upload
            accept="image/*"
            maxCount={1}
            action={`${API_BACKEND_URL}/forms/enrolments/upload`}
            fileList={fileList}
            onChange={handlePhotoChange}
            onRemove={() => {
              form.setFieldsValue({ filePath: undefined });
              setFileList([]);
              setUploadingPhoto(false);
              return true;
            }}
            listType="picture"
            disabled={formDisabled}
          >
            {fileList.length === 0 && !formDisabled && (
              <Button icon={<UploadOutlined />} loading={uploadingPhoto}>
                {uploadingPhoto ? "Uploading..." : "Select & Upload Photo"}
              </Button>
            )}
          </Upload>
        </Form.Item>

        <Flex justify="end">
          <Form.Item>
            <Button
              disabled={submitting || formDisabled || uploadingPhoto}
              htmlType="submit"
              type="primary"
            >
              {formId ? "Update" : (submitting ? "Submitting..." : "Submit")}
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    </>
  );
}
