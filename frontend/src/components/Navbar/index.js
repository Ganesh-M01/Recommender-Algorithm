import { Box, Flex, HStack, Link, Text, Button, useColorMode } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "../../contexts/AuthContext"; // Import useAuth

function Navbar() {
  const { user, logout } = useAuth(); // Get user and logout function
  const { colorMode, toggleColorMode } = useColorMode(); // Get color mode and toggle function
  const navigate = useNavigate(); // Get navigate function

  const handleLogout = () => {
    logout();
    navigate("/signin"); // Redirect to Signin page
  };

  return (
    <Box
      position="fixed"
      top="0"
      width="100%"
      bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(10px)"
      zIndex="1000"
      p="4"
    >
      <Flex align="center" justify="space-between" wrap="wrap">
        <HStack spacing={8} color={colorMode === "light" ? "black" : "white"}>
          <Link as={RouterLink} to="/">
            <Flex align="center">
              <img src="/assets/Logo2.webp" alt="Logo" style={{ height: '60px', marginRight: '10px' }} />
              <Text fontSize="lg" fontWeight="bold">
                Website_Name
              </Text>
            </Flex>
          </Link>
          {user && (
            <>
              {user.role === "admin" && (
                <Link as={RouterLink} to="/admin">
                  Admin
                </Link>
              )}
              <Link as={RouterLink} to="/profile">
                Profile
              </Link>
              <Link as={RouterLink} to="/basket">
                Basket
              </Link>
            </>
          )}
        </HStack>
        <HStack spacing={4} color={colorMode === "light" ? "black" : "white"}>
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? "Dark" : "Light"} Mode
          </Button>
          {!user ? (
            <>
              <Link as={RouterLink} to="/signin">
                Sign In
              </Link>
              <Link as={RouterLink} to="/signup">
                Sign Up
              </Link>
            </>
          ) : (
            <Button onClick={handleLogout}>Logout</Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}

export default Navbar;