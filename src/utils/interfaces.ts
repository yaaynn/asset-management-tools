export interface GlobalConfig {
  hostPath: string
  workingMode: 'local' | 'remote' | false
  protocol: 'http' | 'https'
  privatePath?: string
  certificatePath?: string
  hostname: string
  port: number
}
