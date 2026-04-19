import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TABS = [
  { name: 'index', label: 'Home', icon: 'home-outline' as IoniconsName, activeIcon: 'home' as IoniconsName },
  { name: 'cat1', label: 'CAT 1', icon: 'school-outline' as IoniconsName, activeIcon: 'school' as IoniconsName },
  { name: 'progress', label: 'Progress', icon: 'bar-chart-outline' as IoniconsName, activeIcon: 'bar-chart' as IoniconsName },
  { name: 'jobs', label: 'Jobs', icon: 'briefcase-outline' as IoniconsName, activeIcon: 'briefcase' as IoniconsName },
];

const HIDDEN = ['cat2', 'recalls', 'library', 'roleplay'];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor: '#1e293b',
          borderTopWidth: 1,
          paddingBottom: 6,
          paddingTop: 6,
          height: 64,
        },
        tabBarActiveTintColor: '#a78bfa',
        tabBarInactiveTintColor: '#475569',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      {TABS.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.label,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? t.activeIcon : t.icon} size={22} color={color} />
            ),
          }}
        />
      ))}
      {HIDDEN.map((name) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{ href: null }}
        />
      ))}
    </Tabs>
  );
}
