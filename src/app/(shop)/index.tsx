import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native";

import { PRODUCTS } from "../../../assets/products";
import { ProductListItem } from "../../components/product-list-item";
import { ListHeader } from "../components/list-header";
import { getProductsAndCategories } from "../../api/api";

const Home = () => {
  const numColumns = 2;
  const { data, error, isLoading } = getProductsAndCategories();

  if (isLoading) return <ActivityIndicator />;
  if (error || !data)
    return <Text>Error{error?.message || "An error occurred"}</Text>;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data.products}
        renderItem={({ item }) => <ProductListItem product={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.flatListColumn}
        style={{ paddingHorizontal: 10, paddingVertical: 5 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    paddingBottom: 20,
  },
  flatListColumn: {
    justifyContent: "space-between",
  },
  titleText: {
    fontFamily: "Inter_900Black", // Ensure this matches the font in useFonts
    fontSize: 18,
  },
  headerText: {
    fontFamily: "Inter_900Black", // Ensure this matches the font in useFonts
    fontSize: 16,
    color: "#333",
  },
});

export default Home;
