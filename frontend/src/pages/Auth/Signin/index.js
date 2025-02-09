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
import validationSchema from "./validations";
import { fetchLogin } from "../../../api";
import { useAuth } from "../../../contexts/AuthContext";

function Signin({ history }) {
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, bag) => {
      try {
        const loginResponse = await fetchLogin({
          email: values.email,
          password: values.password,
        });
        login(loginResponse);
        history.push("/profile");
      } catch (e) {
        bag.setErrors({ general: e.response?.data?.message});
      }
    },
  });

  return (
    <Flex align="center" width="full" justifyContent="center">
      <Box pt={10}>
        <Box textAlign="center">
          <Heading>Signin</Heading>
        </Box>

        {/* General error message */}
        {formik.errors.general && (
          <Box my={5}>
            <Alert status="error">{formik.errors.general}</Alert>
          </Box>
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

            <Button mt="4" width="full" type="submit">
              Sign In
            </Button>
          </form>
        </Box>
      </Box>
    </Flex>
  );
}

export default Signin;
