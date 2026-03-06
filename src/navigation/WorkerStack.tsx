import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorkerWeeklyCalendarScreen from "../screens/worker/WorkerWeeklyCalendarScreen";
import WorkerMonthlyCalendarScreen from "../screens/worker/WorkerMonthlyCalendarScreen";
import ProfileEditScreen from "../screens/worker/mypage/WorkerProfileEditScreen";
import SentRequestsScreen from "../screens/worker/mypage/WorkerSentRequestsScreen";
import WithdrawScreen from "../screens/worker/mypage/WorkerWithdrawScreen";
import WorkplaceManageScreen from "../screens/worker/mypage/WorkerWorkplaceManageScreen";
import NotificationScreen from "../screens/common/NotificationScreen";
import NotificationSettingsScreen from "../screens/common/NotificationSettingsScreen";

export type WorkerStackParamList = {
	WorkerHomeMain: undefined;
	WorkerMonthlyCalendar: undefined;
	ProfileEdit: undefined;
	WorkplaceManage: undefined;
	SentRequests: undefined;
	AccountSettings: undefined;
	Withdraw: undefined;
	Notifications: undefined;
	NotificationSettings: undefined;
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
		       <Stack.Screen name="Notifications" component={NotificationScreen} />
		       <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
	       </Stack.Navigator>
       );
};

export default WorkerStack;
