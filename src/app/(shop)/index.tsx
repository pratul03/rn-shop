import React from "react";
import { StyleSheet, View, FlatList } from "react-native";

import { PRODUCTS } from "../../../assets/products";
import { ProductListItem } from "../../components/product-list-item";
import { ListHeader } from "../components/list-header";

const Home = () => {
  const numColumns = 2;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={PRODUCTS}
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
