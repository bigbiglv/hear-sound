import axios from "@/utils/http/axios"
import type { NSearch } from './types'
axios.service.defaults.baseURL = '/api/netease'

export const Search = (params: NSearch.TParams) => {
  // 返回的数据格式可以和服务端约定
  return axios.get<NSearch.TResData>('/search', params)
}