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
    <Box p='5'>
      {items.length < 1 && (
        <Alert status='warning'>
          <AlertIcon />
          You have not any items in your basket.
        </Alert>
      )}
      {items.length > 0 && (
        <>
          <ul style={({ listStyleType: "decimal" }, { display: "flex" })}>
            {items.map((item) => (
              <li key={item._id} style={({ margin: 20 }, { width: "25%" }, {height: "40%"})}>
                <Link to={`/product/${item._id}`}>
                  <Text fontSize='22'>
                    {item.title} - Rs. {item.price}
                  </Text>
                  <Image
                    htmlWidth={300}
                    loading='lazy'
                    src={item.photos[0]}
                    alt='basket item'
                    objectFit='cover'
                    borderRadius='20px'
                  />
                </Link>
                <Button
                  mt='2'
                  size='sm'
                  colorScheme='red'
                  onClick={() => removeFromBasket(item._id)}>
                  Remove from Basket
                </Button>
              </li>
            ))}
          </ul>
          <Box mt='10'>
            <Text fontSize='22'>Total: Rs. {total}</Text>
          </Box>
          <Button onClick={onOpen} colorScheme='green' mt={4}>
            Buy now
          </Button>

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
                    placeholder='Adress'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme='blue'
                  mr={3}
                  onClick={() => {
                    handleSubmitForm();
                  }}>
                  Order
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Box>
  );
}

export default Basket;
