import { type } from "os"

/** serch接口的命名空间 */
export namespace Nsearch {
  /** search接口请求参数 */
  export type IParams = {
    keywords: string
    type?: types
    limit?: number
    offset?: number
  }
  /** search 接口返回参数 */
  export type IResData = {
    // type 1 单曲
    songs?: ISongs[]
    // type 1018 综合
    song?: ISong[]
    album?: IAlbum[]
    artist?: IArtist[]
    playList?: IPlayList[]
  }
  export type types =
    1 |   //单曲 
    10 |  //专辑
    100 | //歌手
    1000 | //歌单
    1002 |  //用户
    1004 |  //mv
    1006 | //歌词
    1009 | //电台
    1014 | //视频
    1018 | //综合
    2000 //声音
  /** 单曲返回的类型 */
  export interface ISongs {
    id: number
    name: string
    artists: IArtists[]
    album: {}
    duration: number
    copyrightId: number
    status: number
    alias: []
    rtype: number
    ftype: number
    transNames: string[]
    mvid: number
    fee: number
    rUrl: null | string
    mark: number
  }
  export interface IArtists {
    id: number
    name: string
    picUrl: null | string
    alias: string[]
    alia?: string[]
    albumSize: number
    picId: number
    img1v1Url: string
    img1v1: number
    trans: null | string
  }
  /** 专辑数组 */
  export interface IAlbums {
    alg: string
    alias: []
    artist: IArtists
    artists: IArtists[]
    blurPicUrl: string
    briefDesc: string
    commentThreadId: string
    company: string
    companyId: number
    copyrightId: number
    description: string
    id: number
    name: string
    onSale: boolean
    paid: boolean
    pic: number
    picId: number
    picId_str: string
    picUrl: string
    publishTime: number
    size: number
    songs: [] | null
    status: number
    tags: string
    type: string
  }
  /** 专辑 */
  export interface IAlbum {
    albums: IAlbums[]
    more: boolean
    moreText: string
    resourceIds: []
  }

  /** 歌手 */
  export interface IArtist {
    artists: IArtists[]
    more: boolean
    moreText: string
    resourceIds: []
  }

  export interface IPlayLists {
    name: string
    id: number
    bookCount: number
    coverImgUrl: string
    highQuality: boolean
    creator: {
      authStatus: number
      avatarUrl: string
      expertTags: null
      experts: null
      nickname: string
      userId: number
      userType: number
    }
  }
  /** 歌单 */
  export interface IPlayList {
    playLists: IPlayLists[]
    more: boolean
    moreText: string
    resourceIds: []
  }

  /** 歌曲 */
  export interface ISong {
    songs: {
      a: null,
      al: {
        id: number,
        name: string,
        pic: number,
        picUrl: string,
        pic_str: string,
        tns: [],
      },
      alg: string,
      alia: [],
      ar: { alias: [], id: number, name: string, tns: [] }[],
      cd: string,
      cf: string,
      copyright: number,
      cp: number,
      crbt: null,
      djId: number,
      dt: number,
      entertainmentTags: null,
      fee: number,
      ftype: number,
      id: number,
      mark: number,
      mst: number,
      mv: number,
      publishTime: number,
      recommendText: string,
      resourceState: true,
      rt: string,
      rtUrl: null,
      rtUrls: [],
      rtype: number,
      rurl: null,
      s_id: number,
      showRecommend: false,
      single: number,
      songJumpInfo: null,
      tagPicList: null,
      version: number,
    }[],
    more: boolean,
    moreText: string,
    resourceIds: [],
  }
}