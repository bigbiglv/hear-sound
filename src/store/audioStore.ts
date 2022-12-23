import { defineStore } from 'pinia'
import type { NLyric, NSearch, NSongUrl } from '@/api/neteasy/types'
import { SongUrl, Lyric } from '@/api/neteasy/index';
interface IState{
  audioContext: AudioContext | null,
  mediaElement: HTMLAudioElement | null,
  bufferLength: number,
  drawId: number | null,
  analyser: AnalyserNode | null,
  isPlay: boolean,
  duration: number,
  currentTime: number,
  volume: number,
  loop: boolean,
  muted: boolean,
  fadeVolume: { isFade: boolean, volume: number },
  fadeId: number | null,
  waiting: boolean,
  playList: Array<NSearch.ISongs>,
  playIndex: number,
  songUrl: string,
  level: NSongUrl.TLevel,
  lyric: { lrc: string | undefined, romalrc: string | undefined }
}
export default defineStore('audio',{
  state: (): IState => ({
    audioContext: null,
    mediaElement: null,
    bufferLength: 0,
    drawId: null,
    analyser: null,
    isPlay: false,
    duration: 0,    // 音频的总时长
    currentTime: 0, // 当前播放的进度
    volume: 0,      // 音量
    loop: false,    // 单曲循环
    muted: false,   // 静音
    fadeVolume: {
      isFade: true,  // 渐入渐出
      volume: 0,     // 原本的this.volume不变修改这个变量
    },     
    fadeId: 0,
    waiting: false,  // 加载中
    playList: [],   // 播放列表 歌曲信息
    playIndex: 0,   // 播放歌曲的下标
    songUrl: '',    // 当前播放歌曲的url
    level: 'standard',    // 码率
    lyric: {
      lrc: '',      // 普通歌词  
      romalrc: '',  // 罗马音译
    }, 
  }),
  actions:{
    setAudioSrc(url: string) {
      this.mediaElement!.src = url
      this.songUrl = url
    },
    createAudioElement() {
      // 创建audio元素
      const mediaElement: HTMLAudioElement = document.createElement('audio')
      // mediaElement.setAttribute('controls', 'true')
      mediaElement.setAttribute('crossorigin', 'anonymous')
      mediaElement.setAttribute('preload', 'auto')
      mediaElement.setAttribute('id', 'mediaElement')
      // 添加audio元素
      document.getElementById('app')?.appendChild(mediaElement)
      return mediaElement
    },
    createAudioContext() {
      // 获取创建的 mediaElement
      const mediaElement = this.createAudioElement()
      // 创建音频上下文
      const audioContext: AudioContext = new AudioContext()
      // 创建音频源
      const source: MediaElementAudioSourceNode = new MediaElementAudioSourceNode(audioContext, { mediaElement })
      const analyser: AnalyserNode = new AnalyserNode(audioContext)
      const gainNode = new GainNode(audioContext) //创建一个新的gain节点 音量调节

      // 设置默认可视化柱体数量
      analyser.fftSize = 512
      const bufferLength: number = analyser.frequencyBinCount
      
      // 连接节点
      source.connect(analyser)
      analyser.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // 监听事件 
      // 触发第一帧
      mediaElement.addEventListener('loadeddata', () => {
        this.duration = mediaElement.duration
        this.volume = mediaElement.volume
        this.fadeVolume.volume = this.volume
      })

      // 播放结束
      mediaElement.onended = () => {
        // 停止绘制音频图
        this.cancelDraw()
        // 如果播放列表只有一首歌 播放完毕直接暂停
        this.playList.length === 1 && (this.isPlay = false)
        // 触发下一曲
        this.playList.length > 1 && this.next()
      }
      // 音频进度
      mediaElement.ontimeupdate = () => {
        this.currentTime = mediaElement.currentTime
      }

      // 音量
      // mediaElement.onvolumechange = () => {
      //   this.volume = mediaElement.volume
      //   this.fadeVolume.volume = this.volume
      // }

      // 音频缺少数据加载中
      mediaElement.onwaiting  = () => {
        this.waiting = true
      }
      // 加载完成开始播放
      mediaElement.onplaying  = () => {
        this.waiting = false
      }

      this.analyser = analyser
      this.mediaElement = mediaElement
      this.audioContext = audioContext
      this.bufferLength = bufferLength
    },
    /** 设置音量 */
    setVolume(volume: number) {
      if(volume > 1 || volume < 0) return
      this.mediaElement!.volume = volume
      this.volume = volume
    },
    /** 循环单曲 */
    setLoopSong(isLoop: boolean) {
      this.mediaElement!.loop = isLoop
    },
    /** 设置静音 */
    setMuted(muted: boolean) {
      this.mediaElement!.muted = muted
    },
    /** 设置当前播放进度 */
    setCurrentTime(currentTime: number) {
      this.mediaElement!.currentTime = currentTime
    },
    /** 开始绘制声波图 */
    draw(canvas: HTMLCanvasElement | null, fftSize: number = 512) {
      const ctx = canvas?.getContext('2d')
      const height = canvas?.height || 0
      const width = canvas?.width || 0
      const barWidth = width / this.bufferLength * 1.5
      let barHeight

      // 更新可视化柱体数量
      console.log('fftSize', fftSize)
      this.analyser!.fftSize = fftSize
      this.bufferLength = this.analyser!.frequencyBinCount

      this.drawId = requestAnimationFrame(() => this.draw(canvas, fftSize))
      this.analyser?.getByteFrequencyData(this.dataArray)
      ctx?.clearRect(0 ,0, width, height)
      let canvasX = 0
      for(let i = 0; i < this.bufferLength; i++) {
        // 柱体高度
        barHeight = this.dataArray[i] 
        // 随机颜色
        let r = barHeight + 25 * (i / this.bufferLength);
        let g = 250 * (i / this.bufferLength);
        let b = 50;
        ctx!.fillStyle = `rgb(${r},${g},${b})`
        ctx?.fillRect(canvasX, height - barHeight, barWidth, barHeight)
        canvasX += barWidth + 2
      }
    },
    /** 停止绘制声波图 */
    cancelDraw(time: number = 800) {
      setTimeout(() => {
        this.drawId && cancelAnimationFrame(this.drawId)
      }, time);
    },
    /** 播放 */
    play() {
      if(!this.playList.length) return
      return new Promise(async (res, rej) => {
        // 如果audioContext没有开启 先开启
        if ( this.audioContext?.state !== 'running') {
          await this.audioContext?.resume()
        }
        // 非暂停状态不触发play事件 防止.then中的draw事件多次触发
        if (!this.mediaElement?.paused) return 
        // 有播放列表但 audio没有url的时候获取当前playIndex下的url
        // 用于有列表 首次触发播放事件
        if (!this.songUrl && this.playList.length) {
          // 根据playIndex获取当前选中的歌曲
          await this.getSongUrlforIndex().catch(() => {
            rej('getSongUrl获取url失败')
          })
        }
        if (this.fadeVolume.isFade) {
          await this.setFade()
        }
        this.mediaElement?.play()
        this.isPlay = true
        res('success')
      })
    },
    /** 音量渐入渐出 */
    setFade() {
      return new Promise<number>((resolve, reject) => {
        let start = () => {
          this.fadeId = requestAnimationFrame(start)
          // 音量是否达到停止条件
          let next: boolean
          if(this.isPlay) {
            // 点击暂停音量状态为递减
            this.fadeVolume.volume = parseFloat((this.fadeVolume.volume - 0.01).toFixed(2))
            next = this.fadeVolume.volume <= 0
          }else{
            // 点击播放音量状态为递增
            this.fadeVolume.volume = parseFloat((this.fadeVolume.volume + 0.01).toFixed(2))
            next = this.fadeVolume.volume >= this.volume
          }
          // 设置音量
          this.setVolume(this.fadeVolume.volume)
          if (this.fadeId && next) {
            // 音量降到0
            cancelAnimationFrame(this.fadeId)
            // 恢复音量
            // this.setVolume(this.volume)
            resolve(this.fadeId)
          }
        }
        start()
      })
    },
    /** 暂停 */
    async pause() {
      if (this.mediaElement?.paused) return 
      if (this.fadeVolume.isFade) {
        await this.setFade()
      }
      this.mediaElement?.pause()
      this.isPlay = false
      // 停止绘制
      this.cancelDraw?.()
    },
    /** 获取播放url */
    async getSongUrl(params: NSongUrl.TParams){
      const { data } = await SongUrl(params) || {}
      // 设置audio的src
      let url = data?.[0]?.url
      if (url){
        this.setAudioSrc(url)
        // 获取歌词
        this.getLyric()
      }
    },
    /** 根据 playSong 获取 songUrl */
    async getSongUrlforIndex() {
      if(!this.playList.length) return
      const id = this.playSong?.id
      if(!id) return
      let params: NSongUrl.TParams = { 
        id,
        level: this.level,
      }
      try {
        await this.getSongUrl(params)
      } catch (error) {
        // getSongUrl获取url失败
      }
    },
    /** 下一曲 */
    async next() {
      if(!this.playList.length) return
      this.playIndex === this.playList.length - 1 ? this.playIndex = 0 : this.playIndex++
      // 根据playIndex获取当前选中的歌曲
      this.getSongUrlforIndex()
    },
    /** 上一曲 */
    prev() {
      if(!this.playList.length) return
      this.playIndex === 0 ? this.playIndex = this.playList.length - 1 : this.playIndex--
      // 根据playIndex获取当前选中的歌曲
      this.getSongUrlforIndex()
    },
    /** 获取歌词 */
    async getLyric() {
      let id = this.playSong?.id
      if(!id) return
      let params: NLyric.TParams = {
        id
      }
      /**
      * 这里网易云的api 没有按格式将数据返回在result 或者 data中
      */
      const result = await Lyric(params) as any as NLyric.TResData
      this.lyric = {
        lrc: result?.lrc.lyric,
        romalrc: result?.romalrc?.lyric
      }
    },
    /** 
     * 插入单曲播放
     * @param song: 传入的单曲
     * @param isPlay: 插入后是否播放
    */
    async addSong(song: NSearch.ISongs, isPlay: boolean = false) {
      // 插入前判断是否存在 
      const exist = this.playList.findIndex( s => s.id === song.id )
      // 当前播放的就是添加的歌曲 直接return
      if( this.playSong?.id === song.id) return
      // 存在就删除旧的插入到当前播放的位置
      if (exist != -1) this.playList.splice(exist, 1)
      // 插入到当前播放位置的后面
      this.playList.splice(this.playIndex, 0, song)
      await this.getSongUrlforIndex()
      isPlay && this.play()
    },
    /** 
     * 替换整个播放列表
    */
    addSongList(songs: Array<NSearch.ISongs>) {
      this.playList.length = 0
      this.playList = songs
      this.playIndex = 0 // 从头开始 
    },
  },
  getters: {
    dataArray(): Uint8Array {
      return new Uint8Array(this.bufferLength)
    },
    playSong: (state): NSearch.ISongs | undefined => {
      return state.playList.length ? state.playList[state.playIndex] : undefined
    },
  }
})