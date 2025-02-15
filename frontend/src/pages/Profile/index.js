import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Text, Button, Alert, AlertIcon, Box, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import "./a1.css";

function Profile() {
  const { user, logout, loggedIn } = useAuth();

  const handleLogout = async () => {
    logout();
  };

  return (
    <div className="profile-container">
      {loggedIn === false && (
        <>
          <Alert status="warning">
            <AlertIcon />
            You are not logged in. Please login and try again.
          </Alert>
          <Link to="/signin">
            <Button mt={4} colorScheme="green">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button mt={4} ml={4} colorScheme="pink">
              Register
            </Button>
          </Link>
        </>
      )}

      {loggedIn === true && (
        <div className="profile-card">
          <Image
            src={"/assets/unknown-person-icon.png"} 
            alt="Profile Picture"
            className="profile-pic"
          />
          <Text className="profile-text">Profile</Text>

          <Box className="profile-info">
            <Text>Email: {user.email}</Text>
            <Text>Role: {user.role}</Text>
          </Box>

          <br />
          <br />
          <Link to="/">
            <Button colorScheme="pink" onClick={handleLogout}>
              Logout
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Profile;
