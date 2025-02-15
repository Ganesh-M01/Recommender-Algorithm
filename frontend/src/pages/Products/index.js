import React from "react";
import { useInfiniteQuery } from "react-query";
import { fetchProductList } from "../../api.js";
import {
  Box,
  Grid,
  Flex,
  Button,
  Text,
  Image,
  Stack,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Container,
  VStack,
  useColorModeValue
} from "@chakra-ui/react";
import { useBasket } from "../../contexts/BasketContext"; // Import useBasket

const ProductCard = ({ item }) => {
  const { addToBasket } = useBasket(); // Get addToBasket function
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      borderColor={borderColor}
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'lg',
      }}
    >
      <Box position="relative" paddingTop="100%">
        <Image
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          src={item.photos[0] || "/api/placeholder/400/400"}
          alt={item.title}
          objectFit="cover"
          transition="transform 0.2s"
          _groupHover={{ transform: 'scale(1.05)' }}
        />
      </Box>

      <Stack p={4} spacing={2}>
        <Text fontSize="lg" fontWeight="semibold" noOfLines={1}>
          {item.title}
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
          Rs. {item.price}
        </Text>
        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {item.description}
        </Text>
        <Button colorScheme="blue" size="md" width="100%" onClick={() => addToBasket(item)}>
          Add to Basket
        </Button>
      </Stack>
    </Box>
  );
};

const LoadingSkeleton = () => (
  <Stack spacing={4}>
    <Skeleton height="200px" />
    <Skeleton height="20px" />
    <Skeleton height="20px" />
    <Skeleton height="40px" />
  </Stack>
);

export default function Products() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery("products", fetchProductList, {
    getNextPageParam: (lastGroup, allGroups) => {
      const morePagesExist = lastGroup?.length === 12;
      return morePagesExist ? allGroups.length + 1 : undefined;
    },
  });

  const renderContent = () => {
    if (status === "loading") {
      return (
        <Container maxW="container.xl" py={8}>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
            {[...Array(6)].map((_, i) => (
              <Box key={i}>
                <LoadingSkeleton />
              </Box>
            ))}
          </Grid>
        </Container>
      );
    }

    if (status === "error") {
      return (
        <Container maxW="container.xl" py={8}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={1}>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error.message || "Failed to load products. Please try again later."}
              </AlertDescription>
            </VStack>
          </Alert>
        </Container>
      );
    }

    return (
      <Container maxW="container.xl" py={8}>
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)"
          }}
          gap={6}
        >
          {data.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.map((item) => (
                <Box key={item._id}>
                  <ProductCard item={item} />
                </Box>
              ))}
            </React.Fragment>
          ))}
        </Grid>

        <Flex justify="center" mt={12}>
          <Button
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            isDisabled={!hasNextPage || isFetchingNextPage}
            loadingText="Loading more..."
            size="lg"
            minW="200px"
            colorScheme={hasNextPage ? "blue" : "gray"}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Load More Products"
              : "No More Products"}
          </Button>
        </Flex>
      </Container>
    );
  };

  return (
    <Box bg={bgColor} minH="100vh">
      {renderContent()}
    </Box>
  );
}
