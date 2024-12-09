import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { useCartStore } from "../store/cart-store";
import { StatusBar } from "expo-status-bar";
import Feather from "@expo/vector-icons/Feather";
import { createOrder, createOrderItem } from "../api/api";
import { Toast } from "react-native-toast-notifications";
import LottieView from "lottie-react-native"; // Import Lottie

type CartItemType = {
  id: number;
  title: string;
  heroImage: string;
  price: number;
  quantity: number;
  maxQuantity: number;
};

type CartItemProps = {
  item: CartItemType;
  onRemoveRequest: (item: CartItemType) => void;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
};

const CartItem = ({
  item,
  onDecrement,
  onIncrement,
  onRemoveRequest,
}: CartItemProps) => {
  return (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.heroImage }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => onDecrement(item.id)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>
              <Feather name="minus" size={18} color="black" />
            </Text>
          </TouchableOpacity>
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => onIncrement(item.id)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>
              <Feather name="plus" size={18} color="black" />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => onRemoveRequest(item)}
        style={styles.removeButton}
      >
        <Text style={styles.removeButtonText}>
          <Feather name="trash-2" color={"white"} size={22} /> Remove
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default function Cart() {
  const {
    items,
    removeItem,
    incrementItem,
    decrementItem,
    getTotalPrice,
    resetCart,
  } = useCartStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CartItemType | null>(null);

  const { mutateAsync: createSupabaseOrder } = createOrder();
  const { mutateAsync: createSupabaseOrderItem } = createOrderItem();

  const handleCheckOut = async () => {
    const totalPrice = parseFloat(getTotalPrice());
    try {
      await createSupabaseOrder(
        { totalPrice },
        {
          onSuccess: (data) => {
            createSupabaseOrderItem(
              items.map((item) => ({
                orderId: data.id,
                productId: item.id,
                quantity: item.quantity,
              })),
              {
                onSuccess: () => {
                  setModalVisible(true); // Show modal
                },
              }
            );
          },
        }
      );
    } catch (error) {
      console.log(error);
      Toast.show("Something went wrong", {
        type: "danger",
        placement: "bottom",
        duration: 2000,
      });
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    resetCart(); // Reset cart here after the modal closes
  };

  const handleRemoveRequest = (item: CartItemType) => {
    setSelectedItem(item);
    setRemoveModalVisible(true);
  };

  const confirmRemoveItem = () => {
    if (!selectedItem) {
      return;
    }
    removeItem(selectedItem.id);
    setRemoveModalVisible(false);
    setSelectedItem(null);
  };

  const cancelRemoveItem = () => {
    setRemoveModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar style={Platform.OS === "android" ? "auto" : "dark"} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onRemoveRequest={handleRemoveRequest}
            onIncrement={incrementItem}
            onDecrement={decrementItem}
          />
        )}
        contentContainerStyle={styles.cartList}
      />

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ₹{getTotalPrice()}</Text>
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            items.length === 0 && styles.disabledCheckoutButton,
          ]}
          onPress={handleCheckOut}
          disabled={items.length === 0}
        >
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>

      {/* Checkout Modal with Lottie Animation */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Lottie Animation */}
            <LottieView
              source={require("../../assets/animations/x7lDE2Nae2.json")} // Adjust path
              autoPlay
              loop={false}
              style={styles.animation}
            />
            <Text style={styles.modalTitle}>Order Placed Successfully!</Text>
            <Text style={styles.modalMessage}>Thank you for your order.</Text>
            <TouchableOpacity
              onPress={closeModal}
              style={styles.checkOutConfirmButton}
            >
              <Text style={styles.checkOutConfirmButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal
        transparent={true}
        visible={removeModalVisible}
        animationType="fade"
        onRequestClose={cancelRemoveItem}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Remove Item</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to remove this item from the cart?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={cancelRemoveItem}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmRemoveItem}
                style={[styles.modalButton, styles.confirmButton]}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  cartList: {
    paddingVertical: 16,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontFamily: "Inter_900Black",
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: "Inter_900Black",
    color: "#888",
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    fontFamily: "Inter_900Black",
    fontWeight: "800",
    color: "#666",
  },
  removeButton: {
    flexDirection: "row", // Align icon and text horizontally
    alignItems: "center", // Center items vertically
    paddingVertical: 10, // Slightly reduced padding for compact height
    paddingHorizontal: 10, // Reduced horizontal padding to make the button narrower
    backgroundColor: "#FF5252", // Red background color
    borderRadius: 4, // Rounded corners
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  removeButtonText: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    color: "#fff", // White text color
    textAlign: "center",
  },
  footer: {
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  disabledCheckoutButton: {
    backgroundColor: "#858585",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    letterSpacing: 1,
    fontFamily: "Inter_900Black",
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#ddd",
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  // New styles for Modal
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%", // Adjusted width for better responsiveness
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5, // Add shadow for Android
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  checkOutConfirmButton: {
    backgroundColor: "#000", // Dark button background
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center", // Center the button
    elevation: 2, // Shadow for Android
  },
  checkOutConfirmButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: "#FFFFFF", // White text for visibility
    textAlign: "center",
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#D1D1D1",
  },
  confirmButton: {
    backgroundColor: "#f03f3f", // Yellow background for Agree button
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4, // Slightly more rounded corners
  },

  confirmButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: "#ffffff", // Black text for contrast
    textAlign: "center",
  },
  cancelButton: {
    fontWeight: "semibold",
    backgroundColor: "#E0E0E0", // Light gray background for Cancel button
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "semibold",
    fontSize: 16,
    color: "#000", // Black text for Cancel button
    textAlign: "center",
  },
  animation: { width: 200, height: 200 },
});
