import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0284c7",
        tabBarInactiveTintColor: "#9ca3af",
        headerStyle: { backgroundColor: "#0369a1" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Mostly Medicine",
          tabBarLabel: "Home",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="cat1"
        options={{
          title: "AMC CAT 1",
          tabBarLabel: "CAT 1",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🧠</Text>,
        }}
      />
      <Tabs.Screen
        name="cat2"
        options={{
          title: "AMC CAT 2",
          tabBarLabel: "CAT 2",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🩺</Text>,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: "AU Jobs",
          tabBarLabel: "Jobs",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>💼</Text>,
        }}
      />
      <Tabs.Screen
        name="reference"
        options={{
          title: "Reference",
          tabBarLabel: "Reference",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📖</Text>,
        }}
      />
    </Tabs>
  );
}
