import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useCartStore } from "../../store/cart-store";
import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { getProduct } from "../../api/api";

const ProductDetails = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const toast = useToast();
  const { data: product, error, isLoading } = getProduct(slug);
  const { items, addItem, incrementItem, decrementItem } = useCartStore();
  const cartItem = items.find((product) => product.id === product?.id);
  const initialQuantity = cartItem ? cartItem.quantity : 1;
  const [quantity, setQuantity] = useState(initialQuantity);
  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error : {error.message}</Text>;
  if (!product) return <Redirect href={`/404`} />;

  const increaseQuantity = () => {
    if (quantity < product.maxQuantity) {
      setQuantity((prev) => prev + 1);
      incrementItem(product.id);
    } else {
      toast.show(`Only ${product.maxQuantity} items are in stock`, {
        type: "warning",
        placement: "top",
        duration: 1500,
        style: {
          backgroundColor: "#ff0000", // Red background for warning
          padding: 10,
          borderWidth: 1,
          borderColor: "#ff2222", // Darker red for the border
          borderRadius: 6,
          marginBottom: 100,
        },
        textStyle: {
          color: "#ffffff", // White text for visibility
          fontSize: 16,
          fontWeight: "bold",
          letterSpacing: 1,
        },
        icon: <Feather name="alert-circle" size={24} color="#ffffff" />, // Warning icon
      });
    }
  };
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      decrementItem(product.id);
    }
  };

  const totalPrice = (product.price * quantity).toFixed(2);
  const addToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      image: product.heroImage,
      price: product.price,
      quantity,
    });
    toast.show("Added to cart", {
      type: "success",
      placement: "bottom",
      duration: 1500,
      animationType: "zoom-in",
      style: {
        backgroundColor: "#333333", // Dark background
        padding: 10,
        borderWidth: 1,
        borderColor: "#555555",
        borderRadius: 6,
        marginBottom: 100,
      },
      textStyle: {
        color: "#ffffff", // White text to match button
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 1,
      },
      icon: <Feather name="package" size={24} color="#ffffff" />,
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.title }} />
      <Image source={{ uri: product.heroImage }} style={styles.heroImage} />
      <View style={{ padding: 16, flex: 1 }}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.slug}>{product.slug}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            Unit price: ₹{product.price.toFixed(2)}
          </Text>
          <Text style={styles.price}>Total Price: ₹{totalPrice}</Text>
        </View>
        <FlatList
          data={product.imagesUrl}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.image} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imagesContainer}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={decreaseQuantity}
            disabled={quantity < 1}
          >
            <Text style={styles.quantityButtonText}>
              <Feather name="minus" size={24} color="white" />
            </Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={increaseQuantity}
            disabled={quantity >= 10}
          >
            <Text style={styles.quantityButtonText}>
              <Feather name="plus" size={24} color="white" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              { opacity: quantity === 0 ? 0.5 : 1 },
            ]}
            onPress={addToCart}
            disabled={quantity === 0}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.addToCartText}>Add to cart</Text>
              <Feather
                name="shopping-bag"
                size={22}
                color="white"
                style={{ marginLeft: 8 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  heroImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
  },
  slug: {
    fontSize: 18,
    color: "#555",
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  price: {
    fontWeight: "bold",
    color: "#000",
  },

  imagesContainer: {
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  quantityButtonText: {
    fontSize: 24,
    color: "#fff",
  },
  quantity: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 16,
  },
  addToCartButton: {
    marginLeft: 15,
    flex: 1,
    backgroundColor: "#1f1f20",
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 6,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorMessage: {
    fontSize: 18,
    color: "#f00",
    textAlign: "center",
    marginTop: 20,
  },
});
export default ProductDetails;
