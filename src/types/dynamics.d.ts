declare module 'dynamics.js' {
  type StyleValue = string | CSSProperties | Array<StyleValue>
  interface IOptions {
    type: any,
    frequency?: number,
    duration?: number,
    friction?: number,
    bounciness?: number,
    delay?: number,
    complete?: () => void,
    change?:(el: HTMLElement | null, progress: number) => void
  }
  interface animateType {
    linear?: Function,
    spring?: Function,
    bounce?: Function,
    forceWithGravity?: Function,
    gravity?: Function,
    bezier?: Function,
    easeInOut?: Function,
    easeIn?: Function,
    easeOut?: Function,
    linear?: Function,
  }
  /** 4131 */
  interface IDynamics extends animateType {
    animate: (
      el: HTMLElement | null,
      properties: StyleValue,
      options: IOptions
    ) => number,
    /** 停止应用在元素上的动画 */
    stop: (el: HTMLElement | null) => number,
    /** 这是将 CSS 属性应用到具有正确浏览器前缀的元素 */
    css: (el: HTMLElement, properties: StyleValue) => number,
    /** Dynamics.js 有自己的setTimeout. 原因是requestAnimationFrame和setTimeout有不同的行为。
     * 在大多数浏览器中，requestAnimationFrame将不会在后台选项卡中运行setTimeout。
     * setTimeout在使用动画时，这可能会导致很多问题。
     * 我建议你使用 DynamicssetTimeout和clearTimeout来处理这些场景 
     * */
    setTimeout: (Function, delay: number) => number,
    /** 清除先前通过setTimeout定义的超时 */
    clearTimeout: (id: number) => void,
    /** 切换调试模式以减慢每个动画和超时。
     * 这对于开发模式调整动画很有用。
     * Shift-Control-D这可以在浏览器中使用激活 
     * */
    toggleSlow: () => void,
  }
  export default {} as IDynamics
}