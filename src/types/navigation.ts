import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// 根路由参数列表
export type RootStackParamList = {
  LoginScreen: undefined;
  SettingScreen: undefined;
  HomeDrawer:
    | {
        screen?: string;
        params?: {
          dataId?: string;
        };
      }
    | undefined;
};

// 首页路由导航属性
export type HomeDrawerNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HomeDrawer'
>;

// 设置页路由导航属性
export type SettingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SettingScreen'
>;

// 登录路由导航属性
export type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LoginScreen'
>;

// 首页抽屉路由参数列表
export type HomeDrawerParamList = {
  HomeScreen: { dataId: string | undefined };
};

// 首页抽屉路由导航属性
export type HomeScreenNavigationProp = DrawerNavigationProp<
  HomeDrawerParamList,
  'HomeScreen'
>;
