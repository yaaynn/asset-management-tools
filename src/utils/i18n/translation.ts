export interface Translate {
  token: string
  en: string
  zh: string
}
export const Translations: Translate[] = [
  // 登陆界面
  { token: '登录', en: 'Login', zh: '登录' },
  { token: '注册', en: 'Register', zh: '注册' },

  { token: '用户名', en: 'Username', zh: '用户名' },

  { token: '密码', en: 'Password', zh: '密码' },

  { token: '确认密码', en: 'Confirm Password', zh: '确认密码' },
  // 配置界面
  { token: '配置', en: 'Config', zh: '配置' },
  { token: '工作模式', en: 'Working Mode', zh: '工作模式' },
  { token: '本地服务器', en: 'Local Service', zh: '本地服务器' },
  { token: '远程服务器', en: 'Remote Service', zh: '远程服务器' },
  { token: '协议', en: 'Protocol', zh: '协议' },
  { token: '私钥路径', en: 'Private Key Path', zh: '私钥路径' },
  { token: '证书路径', en: 'Certificate Path', zh: '证书路径' },
  { token: '取消选择', en: 'Cancel Selection', zh: '取消选择' },
  { token: '选择当前文件', en: 'Select Current File', zh: '选择当前文件' },
  { token: '未选择文件', en: 'No File Selected', zh: '未选择文件' },
  { token: '请输入证书路径', en: 'Please enter the certificate path', zh: '请输入证书路径' },
  { token: '请输入私钥路径', en: 'Please enter the private key path', zh: '请输入私钥路径' },
  { token: '选择私钥文件', en: 'Select Private Key File', zh: '选择私钥文件' },
  { token: '选择证书文件', en: 'Select Certificate File', zh: '选择证书文件' },
  { token: '服务地址', en: 'Service Host', zh: '服务地址' },
  { token: '请输入服务地址', en: 'Please enter the service address', zh: '请输入服务地址' },
  { token: '端口', en: 'Port', zh: '端口' },
  { token: '请输入端口', en: 'Please enter the port', zh: '请输入端口' },
  { token: '端口不能小于1', en: 'Port cannot be less than 1', zh: '端口不能小于1' },
  { token: '端口不能大于65535', en: 'Port cannot be greater than 65535', zh: '端口不能大于65535' }
]
