import React from "react";
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import validationSchema from "./validations";
import { fetcRegister } from "../../../api";
import { useAuth } from "../../../contexts/AuthContext";

function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate(); // Get navigate function

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
    validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values, bag) => {
      try {
        await validationSchema.validate(values, { abortEarly: false });

        const registerResponse = await fetcRegister({
          email: values.email,
          password: values.password,
        });

        login(registerResponse);
        navigate("/"); // Redirect to products page
      } catch (e) {
        if (e.name === "ValidationError") {
          const errors = {};
          e.inner.forEach((error) => {
            errors[error.path] = error.message;
          });
          bag.setErrors(errors);
        } else {
          const errorMessage =
            e.response?.data?.message || "An unexpected error occurred.";
          bag.setErrors({ general: errorMessage });
        }
      }
    },
  });

  return (
    <div>
      <Flex align="center" width="full" justifyContent="center">
        <Box pt={10}>
          <Box textAlign="center">
            <Heading>Signup</Heading>
          </Box>

          {formik.errors.general && (
            <Alert status="error" mt={4}>
              {formik.errors.general}
            </Alert>
          )}

          <Box my={5} textAlign="left">
            <form onSubmit={formik.handleSubmit}>
              {/* Email Field */}
              <FormControl isInvalid={formik.touched.email && formik.errors.email}>
                <FormLabel>E-mail</FormLabel>
                <Input
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>

              {/* Password Field */}
              <FormControl mt="4" isInvalid={formik.touched.password && formik.errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              </FormControl>

              {/* Confirm Password Field */}
              <FormControl
                mt="4"
                isInvalid={formik.touched.passwordConfirm && formik.errors.passwordConfirm}
              >
                <FormLabel>Password Confirm</FormLabel>
                <Input
                  name="passwordConfirm"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.passwordConfirm}
                />
                <FormErrorMessage>{formik.errors.passwordConfirm}</FormErrorMessage>
              </FormControl>

              <Button mt="4" width="full" type="submit" isDisabled={formik.isSubmitting}>
                Sign Up
              </Button>
            </form>
          </Box>
        </Box>
      </Flex>
    </div>
  );
}

export default Signup;