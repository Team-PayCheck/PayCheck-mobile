import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EmployerHomeScreen from "../screens/employer/EmployerHomeScreen";
import EmployerWorkerManageScreen from "../screens/employer/EmployerWorkerManageScreen";
import EmployerRemittanceManageScreen from "../screens/employer/EmployerRemittanceManageScreen";

export type EmployerStackParamList = {
  EmployerHomeMain: undefined;
  WorkerManage: undefined;
  RemittanceManage: undefined;
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
      <Stack.Screen name="WorkerManage" component={EmployerWorkerManageScreen} />
      <Stack.Screen name="RemittanceManage" component={EmployerRemittanceManageScreen} />
    </Stack.Navigator>
  );
};

export default EmployerStack;
