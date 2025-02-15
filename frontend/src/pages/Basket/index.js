import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Image,
  AlertIcon,
  Button,
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  Textarea,
  Grid,
  Container,
  Stack,
  Heading,
  Center,
} from "@chakra-ui/react";
import { useBasket } from "../../contexts/BasketContext";
import { postOrder } from "../../api.js";

function Basket() {
  const [address, setAddress] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);

  const { items, removeFromBasket, emptyBasket } = useBasket();
  const total = items.reduce((acc, obj) => acc + obj.price, 0);

  const handleSubmitForm = async () => {
    const userId = localStorage.getItem("userId");
    const itemIds = items.map((item) => item._id);
    const input = {
      address,
      items: JSON.stringify(itemIds),
    };

    await postOrder(input);
    await Promise.all(
      itemIds.map(async (productId) => {
        await fetch("http://localhost:4000/event", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, productId, eventType: "purchase" }),
        });
      })
    );

    emptyBasket();
    onClose();
  };

  return (
    <Box pt="100px"> {/* Added padding-top to prevent content overlap */}
      <Container maxW="container.xl">
        {items.length < 1 && (
          <Center height="50vh">
            <Alert status="warning" fontSize="2xl" p={10} borderRadius="md">
              <AlertIcon boxSize="40px" mr={4} />
              Your Basket is Empty.
            </Alert>
          </Center>
        )}
        {items.length > 0 && (
          <>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              {items.map((item) => (
                <Box w="100%" key={item._id} borderWidth="1px" borderRadius="lg" overflow="hidden" height="400px" boxShadow="lg">
                  <Link to={`/product/${item._id}`}>
                    <Image
                      htmlWidth={300}
                      loading="lazy"
                      src={item.photos[0]}
                      alt="basket item"
                      objectFit="cover"
                      borderRadius="20px"
                      height="200px"
                    />
                  </Link>
                  <Stack p={4} spacing={2} height="calc(100% - 200px)">
                    <Heading size="md">{item.title}</Heading>
                    <Text fontSize="lg">Rs. {item.price}</Text>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => removeFromBasket(item._id)}
                    >
                      Remove from Basket
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Grid>
            <Box mt="10" textAlign="center">
              <Text fontSize="22">Total: Rs. {total}</Text>
              <Button onClick={onOpen} colorScheme="green" mt={4}>
                Buy now
              </Button>
            </Box>

            <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Create your account</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl>
                    <FormLabel>Address</FormLabel>
                    <Textarea
                      ref={initialRef}
                      placeholder="Adress"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => {
                      handleSubmitForm();
                    }}
                  >
                    Order
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        )}
      </Container>
    </Box>
  );
}

export default Basket;
