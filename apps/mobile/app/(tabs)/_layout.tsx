import { Tabs } from "expo-router";

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
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <TabIcon emoji="🏠" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cat1"
        options={{
          title: "AMC CAT 1",
          tabBarLabel: "CAT 1",
          tabBarIcon: ({ color }) => <TabIcon emoji="🧠" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cat2"
        options={{
          title: "AMC CAT 2",
          tabBarLabel: "CAT 2",
          tabBarIcon: ({ color }) => <TabIcon emoji="🩺" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reference"
        options={{
          title: "Reference",
          tabBarLabel: "Reference",
          tabBarIcon: ({ color }) => <TabIcon emoji="📖" color={color} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  const { Text } = require("react-native");
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}
