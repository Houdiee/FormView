import type { Rule } from "antd/es/form";

export const validateNotEmpty = (required: boolean): Rule[] => [
  { required, message: "Cannot be empty" },
];

export const validateAlphabetical = (required: boolean): Rule[] => [
  { required, message: "Cannot be empty" },
  { max: 128, message: "Too long" },
  {
    validator: (_: any, value: string) => {
      if (/\d/.test(value)) {
        return Promise.reject(new Error("Cannot include numbers"));
      }
      return Promise.resolve();
    },
  },
];

export const validateNumerical = (required: boolean): Rule[] => [
  { required, message: "Cannot be empty" },
  {
    validator: (_: any, value: string) => {
      if (/[a-zA-Z]/.test(value)) {
        return Promise.reject(new Error("Cannot include letters"));
      }
      return Promise.resolve();
    },
  },
];

export const validateText = (required: boolean): Rule[] => [
  { required, message: "Cannot be empty" },
  { max: 128, message: "Too long" },
];

export const validateEmail = (required: boolean): Rule[] => [
  { required, message: "Cannot be empty" },
  { type: "email", message: "Invalid email " },
  { max: 128, message: "Too long" },
];
