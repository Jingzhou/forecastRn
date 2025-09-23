import React, { useCallback, useContext } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Text,
  Pressable,
} from 'react-native';
import { Images } from '../../assets';
import { Avatar, Button, Image } from 'react-native-ui-lib';
import { AppContext, AppSetStateContext } from '../../../AppContext.tsx';
import post from '../../request/post.ts';

function CustomContent(props: any) {
  const appContext = useContext(AppContext);
  const setAppContext = useContext(AppSetStateContext);
  const { navigation } = props;
  // 跳转登录页
  const goToLogin = () => {
    navigation.navigate('LoginScreen');
  };
  // 跳转设置页
  const goToSetting = () => {
    navigation.navigate('SettingScreen');
  };
  // 判断是否显示用户信息
  const isShowUserInfo = useCallback(() => {
    if (appContext.isLogin) {
      return <Text style={styles.userName}>{appContext.userName}</Text>;
    } else {
      return (
        <Button
          link
          linkColor="#313131"
          label="去登录"
          labelStyle={styles.LoginButton}
          onPress={() => goToLogin()}
        />
      );
    }
  }, [appContext.isLogin, appContext.userName]);

  // 清空历史记录
  const clearHistory = async () => {
    try {
      await post.clearForecastList();
      setAppContext({
        ...appContext,
        historyList: [],
      });
    } catch (error) {
      console.log('清空历史记录失败', error);
    }
  };

  // 跳转历史记录
  const goToHistory = (id: string) => {
    navigation.replace('HomeDrawer', {
      screen: 'HomeScreen', // Drawer 里的屏幕
      params: { dataId: id },
    });
    navigation.closeDrawer();
  };

  // 判断是否展示历史记录
  const isShowHistoryList = useCallback(() => {
    if (appContext.isLogin) {
      // 展示历史记录
      if (appContext.historyList.length) {
        return (
          <View style={styles.historyList}>
            <View style={styles.historyListTitleContainer}>
              <Text style={styles.historyListTitle}>历史记录</Text>
              <Button
                link
                linkColor="#313131"
                label="清空历史"
                onPress={() => clearHistory()}
              />
            </View>
            <ScrollView
              style={styles.historyListScrollView}
              alwaysBounceVertical={false}
            >
              {appContext.historyList.map(
                (item: {
                  question: string;
                  id: string;
                  date: string;
                  short: string;
                }) => (
                  <Pressable
                    key={item.id}
                    onPress={() => goToHistory(item.id)}
                    style={({ pressed }) => [
                      pressed && styles.historyItemPressablePressed,
                    ]}
                  >
                    <View style={styles.historyListItemContainer}>
                      <Text style={{ color: '#8C8C8C' }}>{item.date}</Text>
                      <Text
                        style={styles.historyListItem}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        ({item.short}){item.question}
                      </Text>
                    </View>
                  </Pressable>
                ),
              )}
            </ScrollView>
          </View>
        );
      } else {
        return (
          <View style={styles.historyListLoginTip}>
            <Text
              style={{
                marginBottom: 16,
                fontSize: 16,
                color: '#8C8C8C',
              }}
            >
              暂无历史记录
            </Text>
          </View>
        );
      }
    } else {
      return (
        <View style={styles.historyListLoginTip}>
          <Text
            style={{
              marginBottom: 16,
              fontSize: 16,
              color: '#8C8C8C',
            }}
          >
            登录之后查看您的历史记录
          </Text>
          <Button
            label="去登录"
            borderRadius={12}
            backgroundColor="#f5f5f5"
            labelStyle={{
              fontWeight: 'bold',
              fontSize: 20,
              color: '#313131',
            }}
            onPress={() => goToLogin()}
          />
        </View>
      );
    }
  }, [appContext.isLogin, appContext.historyList]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Pressable onPress={appContext.isLogin ? () => goToSetting() : null}>
          <View style={styles.userInfo}>
            <View style={{ flexDirection: 'row' }}>
              <Avatar
                source={{
                  uri: appContext.isLogin
                    ? 'https://wixmp-1d257fba8470f1b562a0f5f2.wixmp.com/mads-docs-assets/assets/icons/icon%20examples%20for%20docs/avatar_1.jpg'
                    : '',
                }}
                size={60}
              />
              {isShowUserInfo()}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {appContext.isLogin ? null : (
                <Button
                  link
                  linkColor="#9E9E9E"
                  label="设置"
                  labelStyle={styles.settingButon}
                  onPress={() => goToSetting()}
                />
              )}
              <Image
                style={styles.rightArrowImage}
                source={Images.rightArrow}
              />
            </View>
          </View>
        </Pressable>
        {isShowHistoryList()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    padding: 12,
  },
  userInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 100,
    marginBottom: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userName: {
    lineHeight: 60,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#313131',
  },
  LoginButton: {
    lineHeight: 60,
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 12,
  },
  settingButon: {
    lineHeight: 60,
    fontSize: 20,
  },
  rightArrowImage: {
    width: 18,
    height: 18,
    verticalAlign: 'middle',
  },
  historyList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flex: 1,
    padding: 20,
  },
  historyListTitleContainer: {
    marginBottom: 10,
    height: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyListTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  historyListScrollView: {
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    flex: 1,
    paddingVertical: 20,
  },
  historyListItemContainer: {
    marginBottom: 18,
  },
  historyListItem: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
  },
  historyListLoginTip: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyItemPressable: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  historyItemPressablePressed: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
  },
  historyItem: {
    height: 80,
    backgroundColor: 'red',
    marginBottom: 12,
  },
});

export default CustomContent;
