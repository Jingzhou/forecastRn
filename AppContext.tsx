import { createContext } from 'react';

export type AppContextType = {
  userName: string;
  isLogin: boolean;
  lunar: {
    date: string;
    lunarInfo: any;
  };
  // 小六壬结果列表
  historyList: {
    question: string;
    short: string;
    paraphrase: string[];
    content: string[];
    date: string;
    id: string;
    userId: string;
  }[];
};

export const defaultAppContext: AppContextType = {
  userName: '',
  isLogin: false,
  historyList: [],
  lunar: {
    date: '',
    lunarInfo: {},
  },
};

export const AppContext = createContext(defaultAppContext);

export const AppSetStateContext = createContext<
  (context: AppContextType) => void
>(() => {});
