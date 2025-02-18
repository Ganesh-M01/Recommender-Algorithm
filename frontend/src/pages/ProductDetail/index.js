import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchProduct } from "../../api";
import ImageGallery from "react-image-gallery";
import {
  Card,
  Stack,
  Heading,
  Text,
  Button,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { useBasket } from "../../contexts/BasketContext";
import { useAuth } from "../../contexts/AuthContext"; // Import useAuth

function ProductDetail() {
  const { product_id } = useParams();
  const navigate = useNavigate();
  const { addToBasket, items } = useBasket();
  const { user } = useAuth(); // Get user from useAuth

  const { isLoading, isError, data } = useQuery(["product", product_id], () =>
    fetchProduct(product_id)
  );

  const trackEvent = async (eventType, productId) => {
    const userId = localStorage.getItem("userId"); // Get user ID from auth state

    await fetch("http://localhost:4000/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, productId, eventType }),
    });
  };

  const removeEvent = async (productId) => {
    const userId = localStorage.getItem("userId");

    await fetch("http://localhost:4000/event", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, productId }),
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error...</div>;
  }

  const findBasketItem = items.find((item) => item._id === product_id);
  const images = data.photos.map((url) => ({ original: url }));

  const handleAddToBasket = () => {
    if (!user) {
      navigate("/signin"); // Redirect to signin if user is not logged in
      return;
    }
    if (findBasketItem) {
      removeEvent(product_id);
    } else {
      trackEvent("add_to_cart", product_id);
    }
    addToBasket(data, findBasketItem);
  };

  return (
    <div>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow='hidden'
        variant='outline'>
        <ImageGallery items={images} showThumbnails={false} />

        <Stack>
          <CardBody>
            <Heading size='md'>{data.title}</Heading>

            <Text maxWidth={400} py='2'>
              {data.description}
            </Text>
            <Text color='blue.600' fontSize='2xl'>
              Rs. {data.price}
            </Text>
          </CardBody>

          <CardFooter>
            {user && (
              <Button
                variant='solid'
                colorScheme={findBasketItem ? "red" : "green"}
                onClick={handleAddToBasket}>
                {findBasketItem ? "Remove from basket" : "Add to Basket"}
              </Button>
            )}
          </CardFooter>
        </Stack>
      </Card>
    </div>
  );
}

export default ProductDetail;
