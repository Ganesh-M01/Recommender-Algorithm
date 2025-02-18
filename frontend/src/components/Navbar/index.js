import React, { useEffect, useState } from "react";
import { 
  Box, 
  Flex, 
  HStack, 
  Link, 
  Text, 
  Button,
  useColorMode,
  useColorModeValue,
  Container,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Collapse,
  IconButton,
  useDisclosure,
  VStack,
  Image // Import Image component
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { HamburgerIcon, CloseIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";
import SearchBar from "./searchbar";
import bag from '../../assets/bag.png';


function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { isOpen, onToggle } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const [scrolled, setScrolled] = useState(false);
  
  // Move all useColorModeValue calls to the top level
  const navbarBgLight = scrolled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
  const navbarBgDark = scrolled ? 'rgba(26, 32, 44, 0.3)' : 'rgba(26, 32, 44, 0.1)';
  const navbarBg = useColorModeValue(navbarBgLight, navbarBgDark);
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('rgba(237, 242, 247, 0.3)', 'rgba(74, 85, 104, 0.3)');
  const activeBg = useColorModeValue('rgba(237, 242, 247, 0.4)', 'rgba(74, 85, 104, 0.4)');
  const buttonBg = useColorModeValue('whiteAlpha.500', 'blackAlpha.500');
  const buttonHoverBg = useColorModeValue('whiteAlpha.700', 'blackAlpha.700');
  const menuListBg = useColorModeValue('whiteAlpha.800', 'blackAlpha.800');

  // Handle navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        as={RouterLink}
        to={to}
        px={3}
        py={2}
        rounded="md"
        _hover={{
          textDecoration: 'none',
          bg: hoverBg,
        }}
        bg={isActive ? activeBg : 'transparent'}
        color={textColor}
        fontWeight={isActive ? "semibold" : "medium"}
        transition="all 0.2s"
      >
        {children}
      </Link>
    );
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="1000"
      transition="all 0.3s ease"
      bg={navbarBg}
      backdropFilter="blur(8px)"
      borderBottom={scrolled ? "1px" : "none"}
      borderColor={borderColor}
    >
      <Container maxW="container.xl">
        <Flex
          h={20}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Logo Section */}
          <Flex align="center">
            <Link as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
              <Flex align="center">
                <img 
                  src="/assets/Logo2.webp" 
                  alt="Logo" 
                  style={{ 
                    height: '50px', 
                    marginRight: '12px',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color={textColor}
                  letterSpacing="tight"
                >
                  Aethine
                </Text>
              </Flex>
            </Link>
          </Flex>

          {/* Desktop Navigation */}

          {/* Auth Section */}
          <SearchBar/>
          <HStack spacing={4}>
            {user && user.role === "admin" && (
              <NavLink to="/admin">Admin</NavLink>
            )}
            {user && (
              <NavLink to="/basket">
                <Flex align="center">
                  <Image
                    src={bag}
                    alt="Basket"
                    boxSize="20px"
                    mr={2}
                  />
                  Basket
                </Flex>
              </NavLink>
            )}
            <Button onClick={toggleColorMode} bg={buttonBg} _hover={{ bg: buttonHoverBg }}>
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>
            {!user ? (
              <>
                <Button
                  as={RouterLink}
                  to="/signin"
                  variant="ghost"
                  colorScheme="blue"
                  size="md"
                  bg={buttonBg}
                  _hover={{
                    bg: buttonHoverBg
                  }}
                >
                  Sign In
                </Button>
                <Button
                  as={RouterLink}
                  to="/signup"
                  colorScheme="blue"
                  size="md"
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded="full"
                  variant="link"
                  cursor="pointer"
                  minW={0}
                >
                  <Avatar size="sm" name={user.name} src={user.avatar} />
                </MenuButton>
                <MenuList
                  bg={menuListBg}
                  backdropFilter="blur(8px)"
                >
                  <MenuItem as={RouterLink} to="/profile">Profile</MenuItem>
                  <MenuItem onClick={logout} color="red.400">Logout</MenuItem>
                </MenuList>
              </Menu>
            )}

            {/* Mobile menu button */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              onClick={onToggle}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              variant="ghost"
              aria-label="Toggle Navigation"
            />
          </HStack>
        </Flex>

        {/* Mobile Navigation */}
        <Collapse in={isOpen} animateOpacity>
          <Box pb={4} display={{ md: "none" }}>
            <VStack spacing={4}>
              {user && user.role === "admin" && (
                <NavLink to="/admin">Admin</NavLink>
              )}
              {user && (
                <NavLink to="/basket">
                  <Flex align="center">
                    <Image
                      src="/assets/basket-icon.png" // Path to the basket icon
                      alt="Basket"
                      boxSize="20px"
                      mr={2}
                    />
                    Basket
                  </Flex>
                </NavLink>
              )}
            </VStack>
          </Box>
        </Collapse>
      </Container>
    </Box>
  );
}

export default Navbar;