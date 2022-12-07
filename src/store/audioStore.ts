import { defineStore } from 'pinia'
import type { NSearch, NSongUrl } from '@/api/neteasy/types'
import { SongUrl } from '@/api/neteasy/index';
interface IState{
  audioContext: AudioContext | null,
  mediaElement: HTMLAudioElement | null,
  bufferLength: number,
  drawId: number | null,
  analyser: AnalyserNode | null,
  duration: number,
  currentTime: number,
  volume: number,
  playList: Array<NSearch.ISongs>,
  playIndex: number,
  songUrl: string
}
export default defineStore('audio',{
  state: (): IState => ({
    audioContext: null,
    mediaElement: null,
    bufferLength: 0,
    drawId: null,
    analyser: null,
    duration: 0,    // 音频的总时长
    currentTime: 0, // 当前播放的进度
    volume: 0,      // 音量
    playList: [],   // 播放列表 歌曲信息
    playIndex: 0,   // 播放歌曲的下标
    songUrl: '',    // 当前播放歌曲的url
  }),
  actions:{
    setAudioSrc(url: string) {
      this.mediaElement!.src = url
    },
    createAudioContext() {
      // 创建audio元素
      const mediaElement: HTMLAudioElement = document.createElement('audio')
      mediaElement.setAttribute('controls', 'true')
      mediaElement.setAttribute('crossorigin', 'anonymous')
      // 添加audio元素
      document.getElementById('app')?.appendChild(mediaElement)

      // // 创建音频上下文
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
      })

      // 播放结束
      mediaElement.onended = () => {
        this.cancelDraw()
      }
      // 音频进度
      mediaElement.ontimeupdate = () => {
        this.currentTime = mediaElement.currentTime
      }

      // 音量
      mediaElement.onvolumechange = () => {
        this.volume = mediaElement.volume
      }
      
      this.analyser = analyser
      this.mediaElement = mediaElement
      this.audioContext = audioContext
      this.bufferLength = bufferLength
    },
    // 开始绘制声波图
    draw(canvas: HTMLCanvasElement | null, fftSize: number = 512){
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
    // 停止绘制声波图
    cancelDraw(time: number = 800){
      setTimeout(() => {
        this.drawId && cancelAnimationFrame(this.drawId)
      }, time);
    },
    // 播放
    play(){
      return new Promise(async (res, rej) => {
        // 如果audioContext没有开启 先开启
        if ( this.audioContext?.state !== 'running') {
          await this.audioContext?.resume()
        }
        // 非暂停状态不触发play事件 防止.then中的draw事件多次触发
        if (!this.mediaElement?.paused) return 
        // audio没有url的时候获取url
        if (!this.songUrl && this.playList.length) {
          // 根据playIndex获取当前选中的歌曲
          const { id } = this.playList[this.playIndex] || {}
          let params: NSongUrl.TParams = { 
            id,
            level: 'standard'
          }
          try {
            await this.getSongUrl(params)
          } catch (error) {
            rej('getSongUrl获取url失败')
          }
        }
        this.mediaElement?.play()
        res('success')
      })
    },
    // 暂停
    pause(){
      if (this.mediaElement?.paused) return 
      this.mediaElement?.pause()
      // 停止绘制
      this.cancelDraw?.()
    },
    // 获取播放url
    async getSongUrl(params: NSongUrl.TParams){
      const { result } = await SongUrl(params) || {}
      // 设置audio的src
      if(result?.url){
        this.setAudioSrc(result.url)
        this.songUrl = result.url
      }
    },
  },
  getters: {
    dataArray(): Uint8Array {
      return new Uint8Array(this.bufferLength)
    }
  }
})