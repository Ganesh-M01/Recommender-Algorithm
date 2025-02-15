import { Box, Text, Button, Flex, useColorModeValue, VStack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import "../style.css";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchProductList, deleteProduct } from "../../../api";
import { Table, Popconfirm } from "antd";

function AdminProducts() {
  const queryClient = useQueryClient();
  const { isLoading, isError, data, error } = useQuery(
    "admin:products",
    fetchProductList
  );

  const deleteMutation = useMutation(deleteProduct, {
    onSuccess: () => queryClient.invalidateQueries("admin:products"),
  });

  const columns = useMemo(() => {
    return [
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "Price",
        dataIndex: "price",
        key: "price",
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <>
            <Link to={`/admin/products/${record._id}`}>
              <Button colorScheme="green">Edit</Button>
            </Link>
            <Popconfirm
              title="Are you sure"
              onConfirm={() => {
                deleteMutation.mutate(record._id, {
                  onSuccess: () => {
                    alert("Product Deleted");
                  },
                });
              }}
              onCancel={() => console.log("Cancelled")}
              okText="Yes"
              cancelText="No"
              placement="left"
            >
              <Button colorScheme={"red"} ml="5">
                Delete
              </Button>
            </Popconfirm>
          </>
        ),
      },
    ];
  }, [deleteMutation]);

  const textColor = useColorModeValue("black", "white");
  const bgColor = useColorModeValue("white", "gray.700");
  const buttonBg = useColorModeValue("blue.500", "blue.300");
  const buttonHoverBg = useColorModeValue("blue.600", "blue.400");
  const linkColor = useColorModeValue("black", "white");

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={4}
          mr={10}
        >
          <Text fontSize="2xl" p="5" color={textColor}>
            Products
          </Text>
          <Link to="/admin/products/new">
            <Button colorScheme={"facebook"} color={linkColor}>
              Add a New Product
            </Button>
          </Link>
        </Box>

        <Table dataSource={data} columns={columns} rowKey="_id" />
      </Box>
    </Flex>
  );
}

export default AdminProducts;
