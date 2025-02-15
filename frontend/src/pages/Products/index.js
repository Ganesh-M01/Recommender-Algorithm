import React from "react";
import Cards from "../../components/Card";
import { Grid, Box, Flex, Button, Container, useColorMode } from "@chakra-ui/react";
import { useInfiniteQuery } from "react-query";
import { fetchProductList } from "../../api.js";
import LIGHT_BG from "../../assets/BG-IMG-LIGHT.png"; // Light mode background
import DARK_BG from "../../assets/BG-IMG-DARK.png";   // Dark mode background

function Products() {
  const { colorMode } = useColorMode(); // Detects current theme
  const bgImage = colorMode === "dark" ? DARK_BG : LIGHT_BG; // Switch background

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
      backgroundAttachment="fixed" // Keeps background fixed on scroll
    >
      <Container maxW="container.xl">
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
