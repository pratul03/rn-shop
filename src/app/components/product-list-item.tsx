import { Image, StyleSheet, Text, View } from "react-native";
import { Product } from "../../../assets/types/product";

export const ProductListItem = ({ product }: { product: Product }) => {
  return (
    <View>
      <View style={styles.itemImageContainer}>
        <Image source={product.heroImage} style={styles.itemImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width: "48%",
    backgroundColor: "white",
    marginVertical: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  itemImageContainer: {
    borderRadius: 10,
    width: "100%",
    height: 150,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  itemTextContainer: {
    padding: 8,
    alignItems: "flex-start",
    gap: 4,
  },
  itemTitle: {
    fontSize: 16,
    color: "#888",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
