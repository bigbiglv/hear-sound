import { defineStore } from 'pinia'
interface IState{
  audioContext: AudioContext | null,
  mediaElement: HTMLAudioElement | null,
  bufferLength: number,
  drawId: number | null,
  analyser: AnalyserNode | null,
}
export default defineStore('audio',{
  state: (): IState => ({
    audioContext: null,
    mediaElement: null,
    bufferLength: 0,
    drawId: null,
    analyser: null,
  }),
  actions:{
    setAudioSrc(url: string) {
      this.mediaElement!.src = url
    },
    createAudioContext() {
      // const { audioContext, mediaElement, draw, cancelDraw } = useAudioContext()
      // this.audioContext = audioContext
      // this.mediaElement = mediaElement
      // this.draw = draw
      // this.cancelDraw = cancelDraw

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

      // 设置可视化柱体数量
      analyser.fftSize = 128
      const bufferLength: number = analyser.frequencyBinCount
      
      // 连接节点
      source.connect(analyser)
      analyser.connect(gainNode)
      gainNode.connect(audioContext.destination)


      this.analyser = analyser
      this.mediaElement = mediaElement
      this.audioContext = audioContext
      this.bufferLength = bufferLength
    },
    draw(canvas: HTMLCanvasElement | null){
      console.log('draw')
      const ctx = canvas?.getContext('2d')
      const height = canvas?.height || 0
      const width = canvas?.width || 0
      const barWidth = width / this.bufferLength * 1.5
      let barHeight
      this.drawId = requestAnimationFrame(() => this.draw(canvas))
      this.analyser?.getByteFrequencyData(this.dataArray)
      console.log('draw')
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

    cancelDraw(time: number = 500){
      setTimeout(() => {
        this.drawId && cancelAnimationFrame(this.drawId)
      }, time);
    },
  },
  getters: {
    dataArray(): Uint8Array {
      return new Uint8Array(this.bufferLength)
    }
  }
})