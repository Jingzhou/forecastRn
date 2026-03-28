import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Text,
} from 'react-native';
import { LoaderScreen, Colors } from 'react-native-ui-lib';
import QuestionCom from '../../components/questionCom';
import { explain } from './dict';
import post from '../../request/post';
import { AppContext, AppSetStateContext } from '../../../AppContext.tsx';

function HomeScreen(props: any) {
  const appContext = useContext(AppContext);
  const setAppContext = useContext(AppSetStateContext);
  const { dataId } = props.route.params;
  const { navigation } = props;
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState<{
    question: string;
    short: string;
    paraphrase: string[];
    content: string[];
    date: string;
    id: string;
    userId: string;
  }>({
    question: '',
    short: '',
    paraphrase: [],
    content: [],
    date: '',
    id: '',
    userId: '',
  });

  useEffect(() => {
    if (dataId === resultData.id) return;
    if (dataId) {
      // 从本地存储中获取数据
      const historyData = appContext.historyList.find(
        (item: any) => item.id === dataId,
      );
      if (historyData) {
        setResultData(historyData);
      }
    } else {
      setResultData({
        question: '',
        short: '',
        paraphrase: [],
        content: [],
        date: '',
        id: '',
        userId: '',
      });
    }
  }, [dataId]);

  // 传入数字数组、问题，进行预测
  const calculate = async (parameters: number[], question: string) => {
    let explainIndex = 0;
    parameters.forEach(indexValue => {
      let j = 0;
      explainIndex = explainIndex - 1;
      while (j < indexValue) {
        explainIndex = explainIndex + 1;
        if (explainIndex > 5) {
          explainIndex = 0;
        }
        j++;
      }
    });

    try {
      // 接口请求数据
      const data = {
        question: question,
        short: explain[explainIndex].short,
        paraphrase: explain[explainIndex].paraphrase,
      };
      const res = await post.gerForecast(data);
      console.log('预测结果', res.data);
      setResultData({
        ...res.data,
      });
      setLoading(false);

      // 加入历史列表
      setAppContext({
        ...appContext,
        historyList: [res.data, ...appContext.historyList],
      });
      navigation.setParams({
        dataId: res.data.id,
      });
    } catch (error) {
      console.log('预测失败', error);
      setLoading(false);
    }
  };
  // 返回占卜结果
  const renderResultData = useCallback(() => {
    if (resultData.id) {
      return (
        <View style={styles.resultTips}>
          <Text style={styles.resultTipsTitle}>
            问题：{resultData.question}
          </Text>
          <Text style={styles.resultTipsDesc}>结果：{resultData.short}</Text>
          <Text style={styles.resultTipsDesc}>
            释义：{resultData.paraphrase[0]}
          </Text>
          <Text style={styles.resultTipsDesc}>
            口诀：{resultData.paraphrase[1]}
          </Text>
          <Text style={styles.resultTipsDesc}>
            断辞：{resultData.paraphrase[2]}
          </Text>
          {/* 解析 */}
          {Object.keys(resultData.content).map((item: any, index) => (
            <Text style={styles.resultTipsDesc} key={index}>
              {`${item}：${resultData.content[item]}`}
            </Text>
          ))}
        </View>
      );
    } else {
      return (
        <View style={styles.lunarContainer}>
          {/* <Text style={styles.resultTipsTitle}>小六壬</Text>
          <Text style={styles.resultTipsDesc}>
            不急不占，无事不占，不动不占！
          </Text> */}
          {/* 农历日期 */}
          <View style={styles.lunarDateInfo}>
            <Text style={styles.lunarDateInfoText}>
              {appContext.lunar?.date || ''}
            </Text>
            <Text style={styles.lunarDateInfoText}>
              {appContext.lunar?.lunarInfo?.Lunar || ''}{' '}
              {appContext.lunar?.lunarInfo?.GanZhiYear || ''}{' '}
              {appContext.lunar?.lunarInfo?.GanZhiMonth || ''}{' '}
              {appContext.lunar?.lunarInfo?.GanZhiDay || ''}{' '}
              {appContext.lunar?.lunarInfo?.Week || ''}
            </Text>
          </View>
          {/* 农历宜忌 */}
          <View style={styles.lunarYiJiContainer}>
            <View style={styles.lunarYi}>
              <Text style={styles.lunarYiTitle}>宜</Text>
              <Text>{appContext.lunar?.lunarInfo?.YiDay || ''}</Text>
              <Text style={styles.lunarYiTitle}>吉神宜趋</Text>
              <Text>{appContext.lunar?.lunarInfo?.JiShenDay || ''}</Text>
            </View>
            <View style={styles.lunarJi}>
              <Text style={styles.lunarJiTitle}>忌</Text>
              <Text>{appContext.lunar?.lunarInfo?.JiDay || ''}</Text>
              <Text style={styles.lunarJiTitle}>凶神宜忌</Text>
              <Text>{appContext.lunar?.lunarInfo?.XiongShaDay || ''}</Text>
            </View>
          </View>
          {/* 农历诸神方位、彭祖百忌 */}
          <View style={styles.lunarGodsContainer}>
            <View style={styles.lunarGods}>
              <View style={{ ...styles.lunarGodsItem, width: '20%' }}>
                <Text>财神</Text>
                <Text>
                  {appContext.lunar?.lunarInfo?.CaiShen?.split('=')[1] || ''}
                </Text>
              </View>
              <View style={{ ...styles.lunarGodsItem, width: '20%' }}>
                <Text>福神</Text>
                <Text>
                  {appContext.lunar?.lunarInfo?.FuShen?.split('=')[1] || ''}
                </Text>
              </View>
              <View style={{ ...styles.lunarGodsItem, width: '20%' }}>
                <Text>喜神</Text>
                <Text>
                  {appContext.lunar?.lunarInfo?.XiShen?.split('=')[1] || ''}
                </Text>
              </View>
              <View style={{ ...styles.lunarGodsItem, width: '20%' }}>
                <Text>阳贵</Text>
                <Text>
                  {appContext.lunar?.lunarInfo?.YangGuiShen?.split('=')[1] ||
                    ''}
                </Text>
              </View>
              <View style={{ ...styles.lunarGodsItem, width: '20%' }}>
                <Text>阴贵</Text>
                <Text>
                  {appContext.lunar?.lunarInfo?.YinGuiShen?.split('=')[1] || ''}
                </Text>
              </View>
            </View>
            <View style={styles.lunarGods}>
              <View style={{ ...styles.lunarGodsItem, width: '33.33%' }}>
                <Text>今日胎神</Text>
                <Text>{appContext.lunar?.lunarInfo?.TaiShenDay || ''}</Text>
              </View>
              <View style={{ ...styles.lunarGodsItem, width: '33.33%' }}>
                <Text>十二神</Text>
                <Text>{appContext.lunar?.lunarInfo?.ZhiXing || ''}</Text>
              </View>
              <View style={{ ...styles.lunarGodsItem, width: '33.33%' }}>
                <Text>二十八宿星</Text>
                <Text>{appContext.lunar?.lunarInfo?.XiuLuck || ''}</Text>
              </View>
            </View>
            <View style={styles.lunarGods}>
              <View style={{ ...styles.lunarGodsItem, width: '33.33%' }}>
                <Text>值神</Text>
                <Text>{appContext.lunar?.lunarInfo?.SiShou || ''}</Text>
              </View>
              <View style={{ ...styles.lunarGodsItem, width: '33.33%' }}>
                <Text>五行</Text>
                <Text>{appContext.lunar?.lunarInfo?.NaYinDay || ''}</Text>
              </View>
              <View style={{ ...styles.lunarGodsItem, width: '33.33%' }}>
                <Text>冲煞</Text>
                <Text>
                  {appContext.lunar?.lunarInfo?.ChongDay || ''}，
                  {appContext.lunar?.lunarInfo?.ShaDay || ''}
                </Text>
              </View>
            </View>

            <View style={styles.lunarGodsTitle}>
              <Text style={styles.lunarGodsTitleText}>彭祖百忌</Text>
            </View>
            <View style={styles.lunarPengZuBaiJi}>
              <Text>{appContext.lunar?.lunarInfo?.PengZuBaiJi || ''}</Text>
            </View>
          </View>
        </View>
      );
    }
  }, [resultData.id, appContext.lunar]);
  // 接收questionCom回调
  const sendQuestion = ({
    codes,
    question,
  }: {
    codes: string[];
    question: string;
  }) => {
    if (appContext.isLogin) {
      setLoading(true);
      calculate(codes.map(Number), question);
    } else {
      navigation.navigate('LoginScreen');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={80}>
        <ScrollView
          contentContainerStyle={styles.container}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          alwaysBounceVertical={false}
        >
          <ScrollView style={styles.resultContainer}>
            {renderResultData()}
          </ScrollView>
          {!resultData.id && (
            <QuestionCom
              sendQuestion={sendQuestion}
              style={styles.questionComContainer}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {loading && (
        <LoaderScreen
          color={Colors.blue30}
          message="正在获取结果..."
          overlay
          backgroundColor="rgba(0, 0, 0, 0.5)"
        />
      )}
    </SafeAreaView>
  );
}

// 定义样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  resultContainer: {
    flex: 1,
    width: 355,
  },
  resultTips: {},
  resultTipsTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultTipsDesc: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  questionComContainer: {
    marginTop: 20,
    width: 355,
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  lunarContainer: {},
  lunarDateInfo: {
    alignItems: 'center',
  },
  lunarDateInfoText: {
    fontSize: 16,
  },
  lunarYiJiContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  lunarYi: {
    flex: 1,
    backgroundColor: '#F0FEF4',
    padding: 12,
    marginRight: 10,
    borderRadius: 12,
  },
  lunarJi: {
    flex: 1,
    backgroundColor: '#FEF1F2',
    padding: 12,
    borderRadius: 12,
  },
  lunarYiTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
    color: '#3B965B',
  },
  lunarJiTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
    color: '#BA1F1F',
  },
  lunarGodsContainer: {
    marginTop: 10,
    backgroundColor: '#DCE9FE',
    padding: 12,
    borderRadius: 12,
  },
  lunarGodsTitle: {
    alignItems: 'center',
  },
  lunarGodsTitleText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
    color: '#191919',
  },
  lunarGods: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  lunarGodsItem: {
    flex: 1,
    alignItems: 'center',
  },
  lunarPengZuBaiJi: {
    alignItems: 'center',
  },
});

export default HomeScreen;
