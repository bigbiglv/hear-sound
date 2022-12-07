import axios from "@/utils/http/axios"
import type { NSearch, NSongUrl, NLyric } from './types'
axios.service.defaults.baseURL = '/api/netease'

// 搜索
export const Search = (params: NSearch.TParams) => {
  // 返回的数据格式可以和服务端约定
  return axios.get<NSearch.TResData>('/search', params)
}

// 获取播放链接
export const SongUrl = (params: NSongUrl.TParams) => {
  return axios.get<NSongUrl.TResData>('/song/url/v1', params)
}

// 获取歌词
export const Lyric = (params: NLyric.TParams) => {
  return axios.get<NLyric.TResData>('/lyric', params)
}