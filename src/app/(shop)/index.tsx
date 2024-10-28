import { StyleSheet, View, Text, FlatList } from "react-native";
import { PRODUCTS } from "../../../assets/products";
import { ProductListItem } from "../../components/product-list-item";
import { ListHeader } from "../components/list-header";

const Home = () => {
  const numColumns = 2;

  return (
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
});

export default Home;
