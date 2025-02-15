import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Text, Button, VStack, HStack, Heading } from "@chakra-ui/react";
import { fetchProducts } from "../../../api"; // Import fetchProducts
import "../style.css";

function AdminHome() {
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const getProductCount = async () => {
      const products = await fetchProducts();
      setProductCount(products.length);
    };

    getProductCount();
  }, []);

  return (
    <Box p={5}>
      <Heading as="h1" size="xl" mb={5} textAlign="center">
        Admin Dashboard
      </Heading>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="lg">Manage Orders</Text>
          <Link to="/admin/orders">
            <Button colorScheme="teal">Orders</Button>
          </Link>
        </HStack>
        <HStack justify="space-between">
          <Text fontSize="lg">
            Manage Products ({productCount})
          </Text>
          <Link to="/admin/products">
            <Button colorScheme="teal">Products</Button>
          </Link>
        </HStack>
        <HStack justify="space-between">
          <Text fontSize="lg">Upload New Products</Text>
          <Link to="/admin/products/new">
            <Button colorScheme="teal">New Products</Button>
          </Link>
        </HStack>
      </VStack>
    </Box>
  );
}

export default AdminHome;
