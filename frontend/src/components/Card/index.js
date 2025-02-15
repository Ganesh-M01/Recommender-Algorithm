import React from "react";
import {
  Card,
  Text,
  Image,
  Stack,
  Heading,
  CardBody,
  CardFooter,
  Divider,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useBasket } from "../../contexts/BasketContext";

function Cards({ item }) {
  const { addToBasket, items } = useBasket();

  const findBasketItem = items.find(
    (basket_item) => basket_item._id === item._id
  );

  const trackEvent = async (eventType, productId) => {
    const userId = localStorage.getItem("userId"); // Get user ID from auth state
    console.log("Got the user ID as :",userId);
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

  return (
    <Card maxW='sm'>
      <Link
        to={`/product/${item._id}`}
        onClick={() => trackEvent("view", item._id)}>
        <CardBody>
          <Image
            src={item.photos[0]}
            alt='Product'
            borderRadius='lg'
            loading='lazy'
            height={235}
            width={535}
            // boxSize={300}
            objectFit='cover'
          />
          <Stack mt='6' spacing='3'>
            <Heading size='md'>{item.title}</Heading>
            <Text>{moment(item.createdAt).format("DD/MM/YYYY")}</Text>
            <Text color='blue.600' fontSize='2xl'>
              Rs. {item.price}
            </Text>
          </Stack>
        </CardBody>
        <Divider />
      </Link>
      <CardFooter>
        <ButtonGroup spacing='2'>
          <Button
            variant='solid'
            colorScheme={findBasketItem ? "red" : "green"}
            onClick={() => {
              if (findBasketItem) {
                removeEvent(item._id);
              } else {
                trackEvent("add_to_cart", item._id);
              }
              addToBasket(item, findBasketItem);
            }}>
            {findBasketItem ? "Remove from Basket" : "Add to Basket"}
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}

export default Cards;
