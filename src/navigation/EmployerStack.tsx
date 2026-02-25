import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EmployerHomeScreen from "../screens/employer/EmployerHomeScreen";
import EmployerWorkerManageScreen from "../screens/employer/EmployerWorkerManageScreen";
import EmployerRemittanceManageScreen from "../screens/employer/EmployerRemittanceManageScreen";
import EmployerWorkplaceManageScreen from "../screens/employer/mypage/EmployerWorkplaceManageScreen";
import EmployerProfileEditScreen from "../screens/employer/mypage/EmployerProfileEditScreen";
import EmployerReceivedRequestsScreen from "../screens/employer/mypage/EmployerReceivedRequestsScreen";
import EmployerWithdrawScreen from "../screens/employer/mypage/EmployerWithdrawScreen";

export type EmployerStackParamList = {
  EmployerHomeMain: undefined;
  WorkerManage: undefined;
  RemittanceManage: undefined;
  EmployerWorkplaceManage: undefined;
  EmployerProfileEdit: undefined;
  EmployerReceivedRequests: undefined;
  EmployerWithdraw: undefined;
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
      <Stack.Screen name="EmployerWorkplaceManage" component={EmployerWorkplaceManageScreen} />
      <Stack.Screen name="EmployerProfileEdit" component={EmployerProfileEditScreen} />
      <Stack.Screen name="EmployerReceivedRequests" component={EmployerReceivedRequestsScreen} />
      <Stack.Screen name="EmployerWithdraw" component={EmployerWithdrawScreen} />
    </Stack.Navigator>
  );
};

export default EmployerStack;
