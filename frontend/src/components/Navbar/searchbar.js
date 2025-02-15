import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useColorMode, useColorModeValue, Input, Button, Box, List, ListItem, Image, Text } from "@chakra-ui/react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { colorMode } = useColorMode();
  const textColor = useColorModeValue("black", "white");
  const bgColor = useColorModeValue("white", "#2D3748");

  const handleButtonClick = async () => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:4000/product/search?q=${encodeURIComponent(query)}`);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
    }
  };

  const handleProductClick = async (product) => {
    if (!product._id || product._id.length !== 24) {
      console.error("Invalid product ID:", product._id);
      return;
    }

    try {
      await axios.post("http://localhost:4000/event", {
        userId: localStorage.getItem("userId"),
        productId: product._id,
        eventType: "search",
        weight: 2,
      });
      console.log("Search event tracked successfully");

      setResults([]);
      navigate(`/product/${product._id}`);
    } catch (error) {
      console.error("Error tracking search event:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleButtonClick();
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box position="relative">
      <Input
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        width="300px"
        padding="10px"
        color={textColor}
      />
      <Button onClick={handleButtonClick} marginLeft="10px" padding="10px" colorScheme="teal">
        Search
      </Button>
      {results.length > 0 && (
        <List
          ref={dropdownRef}
          position="absolute"
          top="100%"
          left={0}
          right={0}
          backgroundColor={bgColor}
          border="1px solid #ccc"
          borderRadius="4px"
          boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
          padding={0}
          margin={0}
          zIndex={1000}
          maxHeight="300px"
          overflowY="auto"
        >
          {results.map((product) => (
            <ListItem
              key={product._id}
              display="flex"
              alignItems="center"
              padding="10px"
              borderBottom="1px solid #eee"
              cursor="pointer"
              color={textColor}
              onClick={() => handleProductClick(product)}
            >
              {product.photos && product.photos.length > 0 && (
                <Image
                  src={product.photos[0]}
                  alt={product.title}
                  width="50px"
                  height="50px"
                  marginRight="10px"
                  objectFit="cover"
                />
              )}
              <Text>{product.title}</Text>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SearchBar;