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
  const [codes, setCodes] = useState<string[]>(Array(length).fill(''));
  const [question, setQuestion] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const inputRefs = useRef<TextFieldRef[]>([]);
  const questionRefs = useRef<TextFieldRef>(null);

  /* 单格变化 */
  const onChangeNumber = (data: string, index: number) => {
    if (isClearing.current) {
      return;
    }
    const newCodes = [...codes];
    newCodes[index] = data;
    setCodes(newCodes);
    if (data && index < length - 1) {
      inputRefs.current[index + 1]?.focus(); // 自动下一格
    }
    if (!data && index > 0) {
      inputRefs.current[index - 1]?.focus(); // 删除回退, 待优化
    }
    // 判断是否填写完成，自动跳到问题输入框
    if (index === length - 1) {
      if (newCodes.every(v => !!v)) {
        questionRefs.current?.focus();
      }
    }
  };
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
          请先输入3个1-9的数字
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
            maxLength={1}
            validate={[
              'number',
              (value?: string) => value !== undefined && value !== '0',
            ]}
            validateOnChange={true}
            onChangeValidity={(valid: boolean) => {
              if (!valid) {
                inputRefs.current[i]?.clear();
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
        message="请先输入3个1-9的数字，再输入问题"
        preset="failure"
      ></Toast>
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
