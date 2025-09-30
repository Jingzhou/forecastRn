import React, { useRef, useState } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { TextField, TextFieldRef, Incubator } from 'react-native-ui-lib';

interface Props {
  sendQuestion: (data: { codes: string[]; question: string }) => void;
  style?: ViewStyle;
}

const QuestionCom: React.FC<Props> = ({ sendQuestion, style }) => {
  const { Toast } = Incubator;
  const length = 3;
  const isClearing = useRef(false);
  const [isVisible, setIsVisible] = useState(false);
  const inputRefs = useRef<TextFieldRef[]>(Array(length).fill(null));
  const [codes, setCodes] = useState<string[]>(Array(length).fill(''));
  const questionRefs = useRef<TextFieldRef>(null);
  const [question, setQuestion] = useState('');

  /* 单格变化 */
  const onChangeNumber = (data: string, index: number) => {
    if (isClearing.current) {
      return;
    }
    const newCodes = [...codes];
    // 校验输入是否为1-99的数字
    if (!/^(1[0-9]{2}|[1-9][0-9]?)$/.test(data)) {
      isClearing.current = true;
      inputRefs.current[index]?.clear();
      newCodes[index] = '';
      setCodes(newCodes);
      setTimeout(() => (isClearing.current = false), 0);
      return;
    }
    // 修改codes数组
    newCodes[index] = data;
    setCodes(newCodes);
    // 自动下一格
    if (data.length === 2 && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    // 判断是否填写完成，自动跳到问题输入框
    if (data.length === 2 && index === length - 1) {
      if (newCodes.every(v => !!v)) {
        questionRefs.current?.focus();
      }
    }
  };
  // 提问提交
  const onSubmitQuestion = () => {
    if (question && codes.every(v => !!v)) {
      sendQuestion({
        codes,
        question,
      });
      isClearing.current = true;
      inputRefs.current.forEach(ref => ref.clear());
      setTimeout(() => (isClearing.current = false), 0);
      questionRefs.current?.clear();
    } else {
      // toast 提示报错
      setIsVisible(true);
    }
  };

  return (
    <View style={style}>
      <View style={styles.codeTip}>
        <Text style={{ fontSize: 16, lineHeight: 18 }}>
          请先输入3个1-99的数字
        </Text>
      </View>
      <View style={styles.codeContainer}>
        {codes.map((tv, i) => (
          <TextField
            key={i}
            ref={nativeRef => {
              if (nativeRef) inputRefs.current[i] = nativeRef;
            }}
            onChangeText={(v: string) => onChangeNumber(v, i)}
            fieldStyle={styles.codeCell}
            style={{
              fontSize: 16,
            }}
            textAlign="center"
            keyboardType="numbers-and-punctuation"
            maxLength={2}
            submitBehavior="newline"
            onKeyPress={({ nativeEvent: { key: keyValue } }) => {
              if (keyValue === 'Backspace' && !tv && i > 0) {
                inputRefs.current[i - 1]?.focus();
              }
            }}
            onSubmitEditing={() => {
              if (i === length - 1) {
                questionRefs.current?.focus();
              } else {
                inputRefs.current[i + 1]?.focus();
              }
            }}
          />
        ))}
      </View>
      <View style={styles.questionContainer}>
        <TextField
          ref={questionRefs}
          placeholder="请输入您想咨询的问题"
          value={question}
          onChangeText={setQuestion}
          fieldStyle={styles.questionInputField}
          containerStyle={{
            flex: 1,
          }}
          style={{
            fontSize: 16,
            lineHeight: 18,
          }}
          placeholderTextColor="#999"
          returnKeyType="done"
          floatOnFocus
          onSubmitEditing={onSubmitQuestion}
        />
      </View>
      <Toast
        visible={isVisible}
        position={'bottom'}
        autoDismiss={2500}
        onDismiss={() => setIsVisible(false)}
        message="请先输入3个1-99的数字，再输入问题"
        preset="failure"
      />
    </View>
  );
};

export default QuestionCom;

const styles = StyleSheet.create({
  codeContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  codeTip: {
    marginBottom: 12,
  },
  codeCell: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  questionInputField: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
