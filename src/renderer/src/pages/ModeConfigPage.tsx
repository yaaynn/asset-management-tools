import { JSX, useState } from 'react'
import { Button, Collapse, IconButton, InputAdornment, Stack } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { GlobalConfig } from '../../../utils/interfaces'
import { Loading } from '../components/Loading'
import { useSnackbar } from 'notistack'
import { FileFilter } from 'electron'
import { useForm, useWatch } from 'react-hook-form'
import { FormContainer, RadioButtonGroup, TextFieldElement } from 'react-hook-form-mui'
import { useTranslation } from 'react-i18next'

export const ModeConfigPage = (): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar()

  const { t } = useTranslation()

  const [config, setConfig] = useState<GlobalConfig>({
    workingMode: 'local',
    hostname: 'localhost',
    protocol: 'http',
    port: 12170,
    hostPath: ''
  })

  const [loading, setLoading] = useState<boolean>(false)

  const formContext = useForm<GlobalConfig>({
    defaultValues: config,
    mode: 'all'
  })

  function openDirectory(
    propName: 'privatePath' | 'certificatePath',
    title: string,
    defaultPath?: string
  ): void {
    setLoading(true)
    const filters: FileFilter[] = []

    if (propName === 'privatePath') {
      filters.push({ name: '私钥', extensions: ['pem'] })
    } else {
      filters.push({ name: '证书', extensions: ['crt'] })
    }
    // noinspection JSVoidFunctionReturnValueUsed
    window.api
      .openDirectory({
        title: title,
        defaultPath: defaultPath,
        buttonLabel: t('选择当前文件'),
        filters: filters,
        properties: ['openFile']
      })
      .then((result: Electron.OpenDialogReturnValue) => {
        setLoading(false)
        if (result.canceled) {
          enqueueSnackbar(t('取消选择'), { variant: 'info' })
          return
        }
        if (result.filePaths.length === 0) {
          enqueueSnackbar(t('未选择文件'), { variant: 'error' })
          return
        }
        enqueueSnackbar(t('未选择文件'), { variant: 'error' })
        formContext.setValue(propName, result.filePaths[0])
      })
  }

  function configSubmit(data: GlobalConfig): void {
    setLoading(true)
    setConfig(data)
  }

  const protocol = useWatch({
    control: formContext.control,
    name: 'protocol',
    defaultValue: 'http'
  })
  const workingMode = useWatch({
    control: formContext.control,
    name: 'workingMode',
    defaultValue: 'local'
  })
  function inCertificate(): boolean {
    return workingMode === 'remote' && protocol === 'https'
  }
  return (
    <>
      <Loading loading={loading} text={'加载中...'} fullscreen={true}>
        <div className={`max-w-6xl m-auto p-5`}>
          <FormContainer
            formContext={formContext}
            onSuccess={(data) => {
              configSubmit(data)
            }}
          >
            <Stack spacing={2}>
              <RadioButtonGroup
                name={'workingMode'}
                label={t('工作模式')}
                control={formContext.control}
                options={[
                  { id: 'local', label: t('本地服务器') },
                  { id: 'remote', label: t('远程服务器') }
                ]}
                row
              />

              <RadioButtonGroup
                name={'protocol'}
                label={t('协议')}
                control={formContext.control}
                options={[
                  { id: 'http', label: 'http' },
                  { id: 'https', label: 'https' }
                ]}
                row
              />

              <Collapse in={inCertificate()} className={`w-full`}>
                <Stack spacing={2}>
                  {inCertificate() ? (
                    <>
                      <TextFieldElement
                        required={inCertificate()}
                        rules={{ required: t('请输入私钥路径') }}
                        name={'privatePath'}
                        control={formContext.control}
                        label={t('私钥路径')}
                        placeholder={t('私钥路径')}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position={'end'}>
                              <IconButton
                                type="button"
                                sx={{ p: '10px' }}
                                onClick={() => {
                                  openDirectory(
                                    'privatePath',
                                    t('选择私钥文件'),
                                    config.privatePath
                                  )
                                }}
                              >
                                <MoreHorizIcon />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      <TextFieldElement
                        required={inCertificate()}
                        rules={{ required: t('请输入证书路径') }}
                        name={'privatePath'}
                        control={formContext.control}
                        label={t('证书路径')}
                        placeholder={t('证书路径')}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position={'end'}>
                              <IconButton
                                type="button"
                                sx={{ p: '10px' }}
                                onClick={() => {
                                  openDirectory(
                                    'certificatePath',
                                    t('选择证书文件'),
                                    config.privatePath
                                  )
                                }}
                              >
                                <MoreHorizIcon />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </>
                  ) : undefined}
                </Stack>
              </Collapse>

              <TextFieldElement
                required
                rules={{ required: t('请输入服务地址') }}
                name={'hostname'}
                control={formContext.control}
                label={t('服务地址')}
                placeholder={t('服务地址')}
              />
              <TextFieldElement
                required
                rules={{
                  required: t('请输入端口'),
                  min: { value: 1, message: t('端口不能小于1') },
                  max: { value: 65535, message: t('端口不能大于65535') }
                }}
                name={'port'}
                control={formContext.control}
                label={t('端口')}
                placeholder={t('端口')}
              />
              <div className={`flex justify-center`}>
                <Button variant="contained" className={`w-96`} type={'submit'}>
                  保存
                </Button>
              </div>
            </Stack>
          </FormContainer>
        </div>
      </Loading>
    </>
  )
}
