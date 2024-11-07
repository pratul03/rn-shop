import React, { useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { useFonts, Inter_900Black } from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { PRODUCTS } from "../../../assets/products";
import { ProductListItem } from "../../components/product-list-item";
import { ListHeader } from "../components/list-header";
import Auth from "../auth"; // Uncomment if needed

SplashScreen.preventAutoHideAsync();

const Home = () => {
  const [fontsLoaded] = useFonts({
    Inter_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Return null until fonts are loaded and splash screen is hidden
  }

  const numColumns = 2;

  return (
    <View style={{ flex: 1 }}>
      {/* Uncomment if you want to render the Auth component first */}
      {/* <Auth /> */}
      <FlatList
        data={PRODUCTS}
        renderItem={({ item }) => <ProductListItem product={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={numColumns}
        key={`flatlist-${numColumns}`}
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
    fontFamily: "Inter_900Black",
    fontSize: 18,
  },
  headerText: {
    fontFamily: "Inter_900Black",
    fontSize: 16,
    color: "#333",
  },
});

export default Home;
