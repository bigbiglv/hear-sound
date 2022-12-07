import axios from "@/utils/http/axios"
import type { Nsearch } from './types'
axios.service.defaults.baseURL = '/api/netease'

export const Search = (params: Nsearch.IParams) => {
  // 返回的数据格式可以和服务端约定
  return axios.get<Nsearch.IResData>('/search', params)
}