import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorkerWeeklyCalendarScreen from "../screens/worker/WorkerWeeklyCalendarScreen";
import WorkerMonthlyCalendarScreen from "../screens/worker/WorkerMonthlyCalendarScreen";
import ProfileEditScreen from "../screens/worker/mypage/ProfileEditScreen";
import SentRequestsScreen from "../screens/worker/mypage/SentRequestsScreen";
import WithdrawScreen from "../screens/worker/mypage/WithdrawScreen";
import WorkplaceManageScreen from "../screens/worker/mypage/WorkplaceManageScreen";

export type WorkerStackParamList = {
	WorkerHomeMain: undefined;
	WorkerMonthlyCalendar: undefined;
	ProfileEdit: undefined;
	WorkplaceManage: undefined;
	SentRequests: undefined;
	AccountSettings: undefined;
	Withdraw: undefined;
};

const Stack = createNativeStackNavigator<WorkerStackParamList>();


const WorkerStack = () => {
       return (
	       <Stack.Navigator
		       screenOptions={{
			       headerShown: false,
		       }}
	       >
		       <Stack.Screen name="WorkerHomeMain" component={WorkerWeeklyCalendarScreen} />
		       <Stack.Screen name="WorkerMonthlyCalendar" component={WorkerMonthlyCalendarScreen} />
		       <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
		       <Stack.Screen name="WorkplaceManage" component={WorkplaceManageScreen} />
		       <Stack.Screen name="SentRequests" component={SentRequestsScreen} />
		       <Stack.Screen name="Withdraw" component={WithdrawScreen} />
	       </Stack.Navigator>
       );
};

export default WorkerStack;
