// In App.js in a new project

import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import type { HomeDrawerParamList } from '../../types/navigation';
import HomeScreen from '../home/index.tsx';
import CustomContent from './customContent.tsx';
import { Button } from 'react-native-ui-lib';
import { Images } from '../../assets';

const Drawer = createDrawerNavigator<HomeDrawerParamList>();

function HomeDrawer() {
  const goNewHomeScreen = (navigation: any) => {
    navigation.navigate('HomeDrawer', {
      screen: 'HomeScreen', // Drawer 里的屏幕
      params: { dataId: '' },
    });
  };
  return (
    <Drawer.Navigator
      initialRouteName="HomeScreen"
      backBehavior="initialRoute"
      drawerContent={(props: any) => <CustomContent {...props} />}
    >
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        initialParams={{ dataId: '' }}
        options={({ navigation }) => ({
          headerTintColor: '#191919',
          title: '',
          headerShadowVisible: false,
          headerRight: () => (
            <Button
              iconSource={Images.newScreen}
              backgroundColor="transparent"
              onPress={() => goNewHomeScreen(navigation)}
              style={{ width: 24, height: 24, marginRight: 16 }}
              iconStyle={{ width: 24, height: 24 }}
            />
          ),
        })}
      />
    </Drawer.Navigator>
  );
}

export default HomeDrawer;
