import * as yup from "yup";

const validations = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Email is required"),
  password: yup
    .string()
    .min(10, "Password must be at least 10 characters long.")
    .required("Password is required"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

export default validations;
