import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EmployerHomeScreen from "../screens/employer/EmployerHomeScreen";
import WorkerManageScreen from "../screens/employer/WorkerManageScreen";
import RemittanceManageScreen from "../screens/employer/RemittanceManageScreen";
import EmployerWorkplaceManageScreen from "../screens/employer/EmployerWorkplaceManageScreen";

export type EmployerStackParamList = {
  EmployerHomeMain: undefined;
  WorkerManage: undefined;
  RemittanceManage: undefined;
  EmployerWorkplaceManage: undefined;
};

const Stack = createNativeStackNavigator<EmployerStackParamList>();

const EmployerStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >
      <Stack.Screen name="EmployerHomeMain" component={EmployerHomeScreen} />
      <Stack.Screen name="WorkerManage" component={WorkerManageScreen} />
      <Stack.Screen name="RemittanceManage" component={RemittanceManageScreen} />
      <Stack.Screen name="EmployerWorkplaceManage" component={EmployerWorkplaceManageScreen} />
    </Stack.Navigator>
  );
};

export default EmployerStack;
