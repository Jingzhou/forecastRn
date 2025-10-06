import api from './api';
import { $http } from './index';

// 获取小六壬结果解释
const gerForecast = (data: any) => {
  return $http.post(api.gerForecast, data);
};

const registerOrLogin = (data: any) => {
  return $http.post(api.registerOrLogin, data);
};

// 获取小六壬结果列表
const getForecastList = () => {
  return $http.post(api.getForecastList);
};

// 清空小六壬结果列表
const clearForecastList = () => {
  return $http.post(api.clearForecastList);
};

// 删除小六壬结果
const deleteForecast = (data: { id: string }) => {
  return $http.post(api.deleteForecast, data);
};

// 获取指定日期的农历信息
const getLunarInfoByDate = (data: { date: string }) => {
  return $http.post(api.getLunarInfoByDate, data);
};

export default {
  gerForecast,
  registerOrLogin,
  getForecastList,
  clearForecastList,
  deleteForecast,
  getLunarInfoByDate,
};
