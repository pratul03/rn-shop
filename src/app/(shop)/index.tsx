import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";
import * as Font from "expo-font";
import { PRODUCTS } from "../../../assets/products";
import { ProductListItem } from "../../components/product-list-item";
import { ListHeader } from "../components/list-header";
import Auth from "../auth";

const Home = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const numColumns = 2;

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Inter-Black": require("../../../assets/font/Inter-Black.ttf"),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    // <Auth />
    <View>
      <FlatList
        data={PRODUCTS}
        renderItem={({ item }) => <ProductListItem product={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        key={`flatlist-${numColumns}`} // Unique key to force re-render
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
    fontFamily: "Inter-Black",
    fontSize: 18,
  },
  headerText: {
    fontFamily: "Inter-Black",
    fontSize: 16,
    color: "#333",
  },
});

export default Home;
