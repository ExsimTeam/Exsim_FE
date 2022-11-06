import { CloudSyncOutlined, FileTextOutlined } from "@ant-design/icons";
import { message, Table } from "antd";
import { FunctionComponent, useEffect, useState } from "react";
import { FileInfo, useFileList } from "src/api/file";

import './index.scss';

const { Column } = Table


interface HomeProps {

}

const Home: FunctionComponent<HomeProps> = (props: HomeProps) => {
  const {
    execute: fileListExec,
    status: fileListStatus
  } = useFileList()

  const [list, setList] = useState<FileInfo[]>([])

  useEffect(() => {
    fileListExec({})
      .then(response => {
        if (response.code === 1) {
          const fileList = response.data.files
          setList(fileList)
        } else {
          message.error('获取文件列表失败')
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="home-wrapper">
      <nav>
        <div className="home-logo-wrapper"></div>
        <ul>
          <li><FileTextOutlined className="home-icon" style={{ color: '#ffbd00' }} />我的文件</li>
          <li><CloudSyncOutlined className="home-icon" style={{ color: '#47c9fc' }} />共享文件</li>
        </ul>
      </nav>
      <main>
        <Table className="home-table"
          dataSource={list}
          loading={fileListStatus === 'pending'}
          pagination={{
            hideOnSinglePage: true
          }}
        >
          <Column title='文件名称' dataIndex='fileName' key='name' />
          <Column title='创建者' align="center" dataIndex='authorUsername' key='authorUsername' />
          <Column title='创建时间' dataIndex='createdTime' key='createdTime' />
          <Column title='上次修改时间' dataIndex='lastModifyTime' key='lastModifyTime' />
          <Column title='操作' align="center" render={(item, index) => (
            <div>
              <button className="home-list-item-action">编辑</button>
              <button className="home-list-item-action">删除</button>
              <button className="home-list-item-action">分享</button>
            </div>
          )} />
        </Table>
      </main>
    </div>
  )
}

export default Home;