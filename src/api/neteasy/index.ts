import axios from "@/utils/http/axios"
import type { NSearch, NSongUrl } from './types'
axios.service.defaults.baseURL = '/api/netease'

export const Search = (params: NSearch.TParams) => {
  // 返回的数据格式可以和服务端约定
  return axios.get<NSearch.TResData>('/search', params)
}

export const SongUrl = (params: NSongUrl.TParams) => {
  return axios.get<NSongUrl.TResData>('/song/url/v1', params)
}