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
import dayjs from 'dayjs';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  const appContext = useContext(AppContext);
  const appSetStateContext = useContext(AppSetStateContext);
  useEffect(() => {
    const appGlobalContext = { ...appContext };
    const fetchData = async () => {
      const today = dayjs().format('YYYY-MM-DD');
      const token = await AsyncStorage.getItem('token');
      const userName = await AsyncStorage.getItem('userName');
      const lunar = await AsyncStorage.getItem('lunar');
      // 判断是否有农历信息
      if (lunar) {
        try {
          const parsedLunar = JSON.parse(lunar);
          // 如果是新的日期，更新农历信息
          if (parsedLunar.date !== today) {
            // 获取农历信息
            const res = await post.getLunarInfoByDate({ date: today });
            appGlobalContext.lunar = {
              date: today,
              lunarInfo: res.data.lunarInfo || {},
            };
            AsyncStorage.setItem(
              'lunar',
              JSON.stringify({
                date: today,
                lunarInfo: res.data.lunarInfo || {},
              }),
            );
          } else {
            // 如果是旧的日期，使用缓存的农历信息
            appGlobalContext.lunar = {
              date: parsedLunar.date,
              lunarInfo: parsedLunar.lunarInfo || {},
            };
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        // 如果没有农历信息，获取农历信息
        const res = await post.getLunarInfoByDate({ date: today });
        appGlobalContext.lunar = {
          date: today,
          lunarInfo: res.data.lunarInfo || {},
        };
        AsyncStorage.setItem(
          'lunar',
          JSON.stringify({ date: today, lunarInfo: res.data.lunarInfo || {} }),
        );
      }
      // app冷启动判断token是否存在，获取历史记录
      if (token) {
        try {
          // 获取历史记录
          const res = await post.getForecastList();
          appGlobalContext.historyList = res.data || [];
          appGlobalContext.isLogin = true;
          appGlobalContext.userName = userName || '';
        } catch (error) {
          // token失效，移除token和userName
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('userName');
          appGlobalContext.historyList = [];
          appGlobalContext.isLogin = false;
          appGlobalContext.userName = '';
        }
      }
      appSetStateContext(appGlobalContext);
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
      {/* 首页 */}
      <Stack.Screen
        name="HomeDrawer"
        component={HomeDrawer}
        options={{ title: '' }}
      />
      {/* 设置页 */}
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
      {/* 登录页 */}
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default RootStack;
