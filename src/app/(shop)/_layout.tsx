import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Feather>["name"];
  color: string;
}) {
  return <Feather size={24} {...props} style={{ color: "#1BC464" }} />;
}

const TabsLayout = () => {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#1BC646",
          tabBarInactiveTintColor: "gray",
          tabBarLabelStyle: { fontSize: 16 },
          tabBarStyle: {
            paddingVertical: 10,
            height: 60,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
            marginBottom: 5,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "shop",
            tabBarIcon(props) {
              return <TabBarIcon {...props} name="shopping-cart" />;
            },
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "orders",
            tabBarIcon(props) {
              return <TabBarIcon {...props} name="shopping-bag" />;
            },
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabsLayout;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
