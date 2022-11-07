import { CloudSyncOutlined, FileTextOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, message, Popover, Radio, Table } from "antd";
import Input from "antd/lib/input/Input";
import { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileInfo, useDeleteFile, useFileList, useNewFile, useShareFile } from "src/api/file";
import { clearData, getData } from "src/utils/storageUtils";

import './index.scss';

const { Column } = Table

interface HomeProps {

}

const Home: FunctionComponent<HomeProps> = (props: HomeProps) => {
  const {
    execute: fileListExec,
    status: fileListStatus
  } = useFileList()

  const {
    execute: newFileExec,
    status: newFileStatus
  } = useNewFile()

  const {
    execute: deleteFileExec
  } = useDeleteFile()

  const {
    execute: shareFileExec,
    status: shareFileStatus
  } = useShareFile()

  const updateFileList = useCallback(() => {
    fileListExec({})
      .then(response => {
        if (response.code === 1) {
          const fileList = response.data.files
          setList(fileList)
        } else {
          message.error('获取文件列表失败')
        }
      })
  }, [])

  const myName = useRef('')
  const shareFileId = useRef(-1)
  const shareFileName = useRef('')

  const [currentMenu, setCurrentMenu] = useState(0)
  const [list, setList] = useState<FileInfo[]>([])
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [newFileDescription, setNewFileDescription] = useState('')
  const [newFileProperty, setNewFileProperty] = useState(0)
  const [showShareBox, setShowShareBox] = useState(false)
  const [shareFileEmail, setShareFileEmail] = useState('')
  const [shareFilePermission, setShareFilePermission] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    myName.current = getData('username')!
    updateFileList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="home-wrapper">
      <nav>
        <div className="home-logo-wrapper"></div>
        <ul>
          <li onClick={() => { setCurrentMenu(0) }}><FileTextOutlined className="home-icon" style={{ color: '#ffbd00' }} />我的文件</li>
          <li onClick={() => { setCurrentMenu(1) }}><CloudSyncOutlined className="home-icon" style={{ color: '#47c9fc' }} />共享文件</li>
        </ul>
      </nav>
      <main>
        <div className="top-wrapper">
          <Popover
            content={(
              <div className="popover-wrapper">
                <div>
                  <Input
                    placeholder="文件名"
                    value={newFileName}
                    onChange={(e) => {
                      console.log(e.target.value);

                      setNewFileName(e.target.value)
                    }} />
                </div>
                <div>
                  <Input
                    placeholder="文件描述"
                    value={newFileDescription}
                    onChange={(e) => {
                      console.log(e.target.value);

                      setNewFileDescription(e.target.value)
                    }} />
                </div>
                <div>
                  <Radio.Group defaultValue={0} value={newFileProperty} onChange={(e) => {
                    console.log(e.target.value);
                    setNewFileProperty(e.target.value)
                  }}>
                    <Radio value={1}>公开</Radio>
                    <Radio value={0}>私密</Radio>
                  </Radio.Group>
                </div>
                <div>
                  <Button
                    type="primary"
                    loading={newFileStatus === 'pending'}
                    onClick={() => {
                      if (newFileName === '') {
                        message.warn("请填写文件名称")
                        return
                      }
                      newFileExec({
                        fileName: newFileName,
                        property: newFileProperty,
                        description: newFileDescription !== '' ? newFileDescription : undefined
                      }).then(() => {
                        updateFileList()
                      })
                    }}
                  >确认</Button>
                </div>
              </div>
            )}
            placement="bottomLeft"
            open={popoverOpen}
            trigger="click"
            onOpenChange={(newOpen: boolean) => {
              setPopoverOpen(newOpen);
            }}
          >
            <Button className="button-new-file" type="primary" size="large" onClick={() => {
              setPopoverOpen(true)
            }}><PlusOutlined />新建文件</Button>
          </Popover>
          <h2>{myName.current}</h2>
          <Button
            className="button-logout"
            onClick={() => {
              clearData()
              navigate('/login')
            }}
          >登出</Button>
        </div>
        <Table className="home-table"
          dataSource={
            currentMenu === 0
              ? list.filter((item) => item.authorUsername === myName.current)
              : list.filter((item) => item.authorUsername !== myName.current)
          }
          loading={fileListStatus === 'pending'}
          pagination={{
            hideOnSinglePage: true
          }}
        >
          <Column title='文件名称' dataIndex='fileName' key='name' />
          <Column title='文件类型' render={(item) => item.property === 0 ? '私有' : '公开'} />
          <Column title='创建者' align="center" dataIndex='authorUsername' key='authorUsername' />
          <Column title='创建时间' dataIndex='createdTime' key='createdTime' />
          <Column title='上次修改时间' dataIndex='lastModifyTime' key='lastModifyTime' />
          <Column title='操作' align="center" render={(item) => (
            <div className="actions">
              <button className="home-list-item-action" onClick={() => {
                navigate('/sheet/' + item.id)
              }}>打开</button>
              <button
                className="home-list-item-action"
                onClick={() => {
                  deleteFileExec({ fileId: item.id }).then((response) => {
                    if (response.code === 1) {
                      message.success("删除文件成功")
                      updateFileList()
                    }
                  })
                }}
              >删除</button>
              {
                currentMenu === 0 && <button className="home-list-item-action" onClick={() => {
                  setShowShareBox(true)
                  setShareFileEmail('')
                  setShareFilePermission(0)
                  shareFileId.current = item.id
                  shareFileName.current = item.fileName
                }}>分享</button>
              }
            </div>
          )} />
        </Table>
      </main>
      {
        showShareBox && (
          <div className="share-box" onClick={() => { setShowShareBox(false) }}>
            <div className="wrapper" onClick={(e) => { e.stopPropagation() }}>
              <h3>分享文件</h3>
              <div className="filename-wrapper">
                {'将文件：' + shareFileName.current}
              </div>
              <div className="input-wrapper">
                <span>分享给：</span><Input className="input" placeholder="邮箱" value={shareFileEmail} onChange={(e) => { setShareFileEmail(e.target.value) }} />
              </div>
              <Radio.Group className="radio-wrapper" value={shareFilePermission} onChange={(e) => { setShareFilePermission(e.target.value) }}>
                <Radio value={0}>可读</Radio>
                <Radio value={1}>可读写</Radio>
              </Radio.Group>
              <Button loading={shareFileStatus === 'pending'} className="button-ok" type="primary" onClick={() => {
                let reg = new RegExp(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
                if (!reg.test(shareFileEmail)) {
                  message.warn("邮箱格式不正确！")
                  return
                }
                shareFileExec({
                  shareToEmail: shareFileEmail,
                  permission: shareFilePermission,
                  fileId: shareFileId.current
                }).then(response => {
                  switch (response.code) {
                    case 1:
                      message.success("已将文件分享给 " + response.data.username)
                      setShowShareBox(false)
                      break
                    case 100:
                      message.error("文件不存在！")
                      setShowShareBox(false)
                      break
                    case 101:
                      message.error("用户未注册，请检查邮箱")
                  }
                })
              }}>确认</Button>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Home;