import { Box, Flex, HStack, Link, Text, Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { ChevronDownIcon } from "@chakra-ui/icons";

function Navbar() {
  return (
    <Box bg="gray.800" p="4">
      <Flex align="center" justify="space-between" wrap="wrap">
        <HStack spacing={8} color="white">
          <Link as={RouterLink} to="/">
            <Flex align="center">
              <img src="/assets/Logo2.webp" alt="Logo" style={{ height: '60px', marginRight: '10px' }} />
              <Text fontSize="lg" fontWeight="bold">
                Website_Name
              </Text>
            </Flex>
          </Link>
          <Link as={RouterLink} to="/admin">
            Admin
          </Link>
          <Link as={RouterLink} to="/profile">
            Profile
          </Link>
        </HStack>
        <HStack spacing={4} color="white">
          <Link as={RouterLink} to="/signin">
            Sign In
          </Link>
          <Link as={RouterLink} to="/signup">
            Sign Up
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
}

export default Navbar;