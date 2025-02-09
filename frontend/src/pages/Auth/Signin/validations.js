import * as yup from "yup";

const validations = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required"),
});

export default validations;
