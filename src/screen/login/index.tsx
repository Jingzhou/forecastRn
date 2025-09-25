import React, { useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import {
  Image,
  Text,
  TextField,
  Button,
  LoaderScreen,
  Colors,
  Incubator,
} from 'react-native-ui-lib';
import { Images } from '../../assets';
import { useNavigation } from '@react-navigation/native';
import type { LoginScreenNavigationProp } from '../../types/navigation';
import { AppContext, AppSetStateContext } from '../../../AppContext.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import post from '../../request/post.ts';

// 定义初始登录页面组件
const LoginScreen: React.FC = () => {
  const { Toast } = Incubator;
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const navigation = useNavigation<LoginScreenNavigationProp>();
  const appContext = useContext(AppContext);
  const appSetStateContext = useContext(AppSetStateContext);
  const updateLoginState = async () => {
    setLoading(true);
    try {
      // 登录
      const res = await post.registerOrLogin({
        userName,
        password,
      });
      await AsyncStorage.setItem('token', res.data?.token);
      await AsyncStorage.setItem('userName', res.data?.user?.userName);
      // 登录成功，获取历史记录
      const listRes = await post.getForecastList();
      appSetStateContext({
        ...appContext,
        userName: res.data?.user?.userName || '',
        isLogin: true,
        historyList: listRes.data || [],
      });
      setTimeout(() => {
        setLoading(false);
        navigation.replace('HomeDrawer');
      }, 0);
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        setIsVisible(true);
        console.log('登录失败', error);
      }, 0);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.logoImage} source={Images.logo} />
      <Text style={styles.titleText}>欢迎使用小六壬</Text>
      <View style={styles.formContainer}>
        <TextField
          placeholder="请输入用户名"
          value={userName}
          onChangeText={setUserName}
          fieldStyle={styles.inputField}
          placeholderTextColor="#999"
          returnKeyType="done"
          floatOnFocus
        />

        <TextField
          placeholder="请输入密码"
          value={password}
          onChangeText={setPassword}
          fieldStyle={styles.inputField}
          placeholderTextColor="#999"
          returnKeyType="done"
          secureTextEntry
          floatOnFocus
        />

        <Button
          label="登录"
          style={styles.loginButton}
          labelStyle={styles.loginButtonText}
          onPress={() => updateLoginState()}
        />
      </View>
      <View style={styles.otherLoginType}>
        <Text style={styles.otherLoginTypeText}>其他登录方式</Text>
        <View style={styles.otherLoginImageContainer}>
          <Image style={styles.otherLoginImage} source={Images.loginByApple} />
          <Image style={styles.otherLoginImage} source={Images.loginByGoogle} />
        </View>
      </View>
      {loading && (
        <LoaderScreen
          color={Colors.blue30}
          message="正在获取结果..."
          overlay
          backgroundColor="rgba(0, 0, 0, 0.5)"
        />
      )}
      <Toast
        visible={isVisible}
        position={'top'}
        autoDismiss={2500}
        onDismiss={() => setIsVisible(false)}
        message="登录失败"
        preset="failure"
      />
    </SafeAreaView>
  );
};

// 定义样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logoImage: {
    width: 80,
    height: 80,
    marginTop: 60,
  },
  titleText: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginTop: 24,
    color: '#333',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 32,
    marginTop: 48,
    marginBottom: 32,
  },
  inputField: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
    width: 327,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    marginBottom: 16,
  },
  loginButton: {
    height: 48,
    width: 327,
    backgroundColor: '#6B46C1',
    borderRadius: 12,
    paddingVertical: 0,
  },
  loginButtonText: {
    lineHeight: 48,
    fontSize: 14,
    fontWeight: 'medium',
    color: '#fff',
  },
  otherLoginType: {
    width: 327,
    alignItems: 'center',
  },
  otherLoginTypeText: {
    lineHeight: 20,
    fontSize: 14,
    fontWeight: 'regular',
    color: '#9CA3AF',
  },
  otherLoginImageContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  otherLoginImage: {
    width: 48,
    height: 48,
  },
});

export default LoginScreen;
