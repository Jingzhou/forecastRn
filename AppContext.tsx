import { createContext } from 'react';

export type AppContextType = {
  userName: string;
  isLogin: boolean;
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
};

export const AppContext = createContext(defaultAppContext);

export const AppSetStateContext = createContext<
  (context: AppContextType) => void
>(() => {});
