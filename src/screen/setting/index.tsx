import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-ui-lib';
import { AppContext, AppSetStateContext } from '../../../AppContext.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { SettingScreenNavigationProp } from '../../types/navigation';

function SettingScreen() {
  const navigation = useNavigation<SettingScreenNavigationProp>();
  const appContext = useContext(AppContext);
  const setAppContext = useContext(AppSetStateContext);
  const logOut = async () => {
    if (appContext.isLogin) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userName');
      setAppContext({
        ...appContext,
        isLogin: false,
        userName: '',
        historyList: [],
      });
    } else {
      navigation.navigate('LoginScreen');
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Button
          style={styles.LogOutButton}
          label={appContext.isLogin ? '退出登录' : '登录'}
          onPress={logOut}
          color="#000000"
          backgroundColor="#FFFFFF"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  LogOutButton: {
    width: '100%',
    borderRadius: 12,
    height: 52,
  },
});

export default SettingScreen;
