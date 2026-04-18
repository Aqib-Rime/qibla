import { Icon, type IconName } from "@/components/ui/icon"
import { Tabs } from "expo-router"

function TabIcon({ name, color }: { name: IconName; color: string }) {
  return <Icon name={name} size={22} color={color} />
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2e5d45",
        tabBarInactiveTintColor: "#6b7a70",
        tabBarLabelStyle: { fontFamily: "Geist_500Medium", fontSize: 11 },
        tabBarStyle: {
          backgroundColor: "#faf6ec",
          borderTopColor: "#e6e0cc",
        },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => <TabIcon name="pin" color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color }) => <TabIcon name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <TabIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  )
}
