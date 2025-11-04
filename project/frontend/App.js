"use client"

import { useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { colors } from "./src/theme/colors"


import SplashWelcome from "./src/screens/SplashWelcome"
import AuthLogin from "./src/screens/AuthLogin"
import AtletaHome from "./src/screens/AtletaHome"
import TreinadorDashboard from "./src/screens/TreinadorDashboard"
import ESRModal from "./src/screens/ESRModal"
import SessionDetail from "./src/screens/SessionDetail"
import SessionsList from "./src/screens/SessionsList"
import History from "./src/screens/History"
import ProfileAtleta from "./src/screens/ProfileAtleta"
import AthleteDetailTreinador from "./src/screens/AthleteDetailTreinador"
import PlanEditor from "./src/screens/PlanEditor"
import AssessmentCreate from "./src/screens/AssessmentCreate"
import MessagesInbox from "./src/screens/MessagesInbox"

import { HomeIcon, ListIcon, ChartIcon, MessageIcon, UserIcon } from "./src/components/Icons"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function AthleteTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 64,
          paddingBottom: 12,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.white,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={AtletaHome}
        options={{
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          tabBarLabel: "Início",
        }}
      />
      <Tab.Screen
        name="Sessions"
        component={SessionsList}
        options={{
          tabBarIcon: ({ color }) => <ListIcon color={color} />,
          tabBarLabel: "Sessões",
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: ({ color }) => <ChartIcon color={color} />,
          tabBarLabel: "Histórico",
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesInbox}
        options={{
          tabBarIcon: ({ color }) => <MessageIcon color={color} />,
          tabBarLabel: "Mensagens",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileAtleta}
        options={{
          tabBarIcon: ({ color }) => <UserIcon color={color} />,
          tabBarLabel: "Perfil",
        }}
      />
    </Tab.Navigator>
  )
}

function CoachTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 64,
          paddingBottom: 12,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.white,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={TreinadorDashboard}
        options={{
          tabBarIcon: ({ color }) => <ChartIcon color={color} />,
          tabBarLabel: "Dashboard",
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesInbox}
        options={{
          tabBarIcon: ({ color }) => <MessageIcon color={color} />,
          tabBarLabel: "Mensagens",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileAtleta}
        options={{
          tabBarIcon: ({ color }) => <UserIcon color={color} />,
          tabBarLabel: "Perfil",
        }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  const [userRole, setUserRole] = useState(null)

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashWelcome} />
          <Stack.Screen name="Auth">{(props) => <AuthLogin {...props} onLogin={setUserRole} />}</Stack.Screen>
          <Stack.Screen name="AthleteMain" component={AthleteTabNavigator} />
          <Stack.Screen name="CoachMain" component={CoachTabNavigator} />
          <Stack.Screen name="SessionDetail" component={SessionDetail} />
          <Stack.Screen name="AthleteDetail" component={AthleteDetailTreinador} />
          <Stack.Screen name="PlanEditor" component={PlanEditor} />
          <Stack.Screen name="Assessment" component={AssessmentCreate} />
          <Stack.Screen
            name="ESRModal"
            component={ESRModal}
            options={{
              presentation: "modal",
              cardStyle: { backgroundColor: "transparent" },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}
