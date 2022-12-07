/** serch接口的命名空间 */
export namespace NSearch {
  /** 请求参数 */
  export type TParams = {
    keywords: string
    type?: types
    limit?: number
    offset?: number
  }
  /** 返回数据 */
  export type TResData = {
    // type 1 单曲
    songs?: ISongs[]
    // type 1018 综合
    song?: ISong[]
    album?: IAlbum[]
    artist?: IArtist[]
    playList?: IPlayList[],
    hasMore: boolean,
    songCount: number
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
  export type ISongs = {
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

/** SongUrl 接口的命名空间 */
export namespace NSongUrl {
  /** 请求参数 */
  export type TParams = {
    id: number,
    level: TLevel
  }
  /** 返回数据 */
  export type TResData = {
    id: number,
    url: string,
    br: number,
    size: number,
    md5: string,
    expi: number,
    type: string,
    gain: number,
    peak: number,
    fee: number,
    uf: any,
    payed: number,
    flag: number,
    canExtend: boolean,
    freeTrialInfo: {
        start: number,
        end: number
    },
    level: string,
    encodeType: string,
    freeTrialPrivilege: {
        resConsumable: boolean,
        userConsumable: boolean,
        listenType: any
    },
    freeTimeTrialPrivilege: {
        resConsumable: boolean,
        userConsumable: boolean,
        type: number,
        remainTime: number
    },
    urlSource: number,
    rightSource: number,
    podcastCtrp: any,
    effectTypes: any,
    time: number
  }

  /** 码率可用参数 */
  export type TLevel =
    'standard' | // 标准
    'higher' | // 较高
    'exhigh' | //极高
    'lossless'| //无损
    'hires' //Hi-Res
}

/** Lyric 接口的命名空间 */
export namespace NLyric {
  /** 请求参数 */
  export type TParams = {
    id: number,
  }
  /** 返回数据 */
  export type TResData = {
    sgc: boolean,
    sfy: boolean,
    qfy: boolean,
    lyricUser: {
      id: number,
      status: number,
      demand: number,
      userid: number,
      nickname: string,
      uptime: number
    },
    lrc: {
      version: number,
      lyric: string 
    },
    klyric: {
      version: number,
      lyric: string
    },
    tlyric: {
      version: number,
      lyric: string
    },
    romalrc: {
      version: number,
      lyric: string 
    },
  }
}