import React from "react";
import { Link } from "react-router-dom";
import { Box, Text, Button, Flex, useColorModeValue, VStack } from "@chakra-ui/react";
import "../style.css"; // Importing the separate CSS file

function AdminHome() {
  const textColor = useColorModeValue("black", "white");
  const bgColor = useColorModeValue("white", "gray.700");
  const buttonBg = useColorModeValue("blue.500", "blue.300");
  const buttonHoverBg = useColorModeValue("blue.600", "blue.400");

  return (
    <Flex className="admin-container">
      {/* Sidebar Navigation */}
      <Box className="admin-sidebar">
        <ul className="admin-menu">
          <li>
            <Link to="/admin">🏠 Home</Link>
          </li>
          <li>
            <Link to="/admin/products">🛍️ Products</Link>
          </li>
        </ul>
      </Box>

      {/* Main Content */}
      <Box className="admin-content" bg={bgColor} boxShadow="md">
        <Text fontSize="5xl" fontWeight="bold" p="5" color={textColor} textAlign="center">
          Welcome, Admin!
        </Text>

        <VStack spacing={4} align="center">
          <Link to="/admin/products">
            <Button className="admin-button" bg={buttonBg} _hover={{ bg: buttonHoverBg }} width="200px">
              Products
            </Button>
          </Link>

          <Link to="/admin/products">
            <Button className="admin-button" bg={buttonBg} _hover={{ bg: buttonHoverBg }} width="200px">
              Edit or Delete
            </Button>
          </Link>

          <Link to="/admin/products/new">
            <Button className="admin-button" bg={buttonBg} _hover={{ bg: buttonHoverBg }} width="200px">
              New Products
            </Button>
          </Link>
        </VStack>
      </Box>
    </Flex>
  );
}

export default AdminHome;
