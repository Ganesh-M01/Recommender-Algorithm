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
  VStack,
  useColorModeValue,
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

  const bgColor = useColorModeValue("white", "gray.700");
  const boxShadow = useColorModeValue("lg", "dark-lg");

  return (
    <Flex align="center" justifyContent="center" height="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
      <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow={boxShadow} bg={bgColor}>
        <Box textAlign="center">
          <Heading>Sign Up</Heading>
        </Box>

        {formik.errors.general && (
          <Box my={5}>
            <Alert status="error">{formik.errors.general}</Alert>
          </Box>
        )}

        <Box my={5} textAlign="left">
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={4}>
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

              <FormControl isInvalid={formik.touched.password && formik.errors.password}>
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

              <FormControl isInvalid={formik.touched.passwordConfirm && formik.errors.passwordConfirm}>
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

              <Button mt={4} width="full" type="submit" colorScheme="blue" isLoading={formik.isSubmitting}>
                Sign Up
              </Button>
            </VStack>
          </form>
        </Box>
      </Box>
    </Flex>
  );
}

export default Signup;
