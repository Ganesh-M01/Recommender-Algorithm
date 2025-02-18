import React, { useEffect, useState } from "react";
import Cards from "../../components/Card";
import { Grid, Box, Flex, Button, Container, useColorMode, Heading } from "@chakra-ui/react";
import { useInfiniteQuery } from "react-query";
import { fetchProductList, fetchProductById } from "../../api.js"; // Fetch function for product details
import LIGHT_BG from "../../assets/BG-IMG-LIGHT.png"; // Light mode background
import DARK_BG from "../../assets/BG-IMG-DARK.png";   // Dark mode background

function Products() {
  const { colorMode } = useColorMode();
  const bgImage = colorMode === "dark" ? DARK_BG : LIGHT_BG;
  
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // Fetch recommended products from localStorage
  useEffect(() => {
    const fetchRecommendations = async () => {
      var storedRecommendations = JSON.parse(localStorage.getItem("recommendations")) || [];
      storedRecommendations = storedRecommendations.collaborative || [];
      console.log(storedRecommendations);
      if (storedRecommendations.length > 0) {
        // Fetch product details based on stored IDs
        const productDetails = await Promise.all(
          storedRecommendations.map((productId) => fetchProductById(productId))
        );
        setRecommendedProducts(productDetails);
      }
    };

    fetchRecommendations();
  }, []);
  const collaborativeRecommendations = JSON.parse(localStorage.getItem("recommendations"));

  // Now, you can access the 'collaborative' array
  console.log(collaborativeRecommendations.collaborative);
  
  // Fetch normal product list
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

  if (status === "loading") return "Loading...";
  if (status === "error") return `An error has occurred: ${error.message}`;

  return (
    <Box
      minHeight="100vh"
      pt="100px"
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      backgroundAttachment="fixed"
    >
      <Container maxW="container.xl">
        {/* Specially Picked for You Section */}
        {recommendedProducts.length > 0 && (
          <>
            <Heading as="h2" size="lg" mb="4">
              Specially Picked for You
            </Heading>
            <Grid templateColumns="repeat(3, 1fr)" gap={4} mb="10">
              {recommendedProducts.map((item) => (
                <Box w="100%" key={item._id}>
                  <Cards item={item} />
                </Box>
              ))}
            </Grid>
          </>
        )}

        {/* Regular Product List */}
        <Heading as="h2" size="lg" mb="4">
          All Products
        </Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          {data.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.map((item) => (
                <Box w="100%" key={item._id}>
                  <Cards item={item} />
                </Box>
              ))}
            </React.Fragment>
          ))}
        </Grid>

        <Flex mt="10" justifyContent="center">
          <Button
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}

export default Products;
