// In App.js in a new project

import React, { useContext, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import HomeDrawer from '../drawer/index.tsx';
import SettingScreen from '../setting/index.tsx';
import LoginScreen from '../login/index.tsx';
import { AppContext, AppSetStateContext } from '../../../AppContext.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import post from '../../request/post.ts';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  const appContext = useContext(AppContext);
  const appSetStateContext = useContext(AppSetStateContext);
  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('token');
      const userName = await AsyncStorage.getItem('userName');
      if (token) {
        try {
          // 获取历史记录
          const res = await post.getForecastList();
          console.log('获取历史记录', res.data);
          appSetStateContext({
            ...appContext,
            userName: userName || '',
            isLogin: true,
            historyList: res.data || [],
          });
        } catch (error) {
          // token失效，移除token和userName
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('userName');
          appSetStateContext({
            ...appContext,
            isLogin: false,
            historyList: [],
            userName: '',
          });
        }
      }
    };
    fetchData();
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="HomeDrawer"
      screenOptions={{
        headerShown: false,
        keyboardHandlingEnabled: false,
      }}
    >
      <Stack.Screen
        name="HomeDrawer"
        component={HomeDrawer}
        options={{ title: '' }}
      />
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          headerShown: true,
          headerTitle: '设置',
          headerTintColor: '#191919',
          headerBackButtonMenuEnabled: false,
        }}
      />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default RootStack;
