import { FileTextOutlined, CloudSyncOutlined } from "@ant-design/icons";
import { Layout, Table } from "antd";
import { FunctionComponent } from "react";

import './index.scss'

const { Header, Content, Footer } = Layout
const { Column } = Table

interface FileInfo {
  name: string,
  id: number,
  authorUsername: string,
  authorUserId: number,
  property: number,
  createdTime: string,
  lastModifyTime: string
}

const fileInfos: FileInfo[] = [
  {
    name: '数据库作业情况',
    id: 1,
    authorUsername: '董永昊',
    property: 1,
    authorUserId: 1,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '8月份收入支出账单',
    id: 2,
    authorUsername: '哈哈哈哈',
    property: 0,
    authorUserId: 2,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '一个神奇的表格',
    id: 1,
    authorUsername: '董永昊',
    property: 0,
    authorUserId: 1,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '西八',
    id: 1,
    authorUsername: '123123',
    property: 1,
    authorUserId: 4,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '数据库作业情况',
    id: 1,
    authorUsername: '董永昊',
    property: 1,
    authorUserId: 1,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '8月份收入支出账单',
    id: 2,
    authorUsername: '哈哈哈哈',
    property: 0,
    authorUserId: 2,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '一个神奇的表格',
    id: 1,
    authorUsername: '董永昊',
    property: 0,
    authorUserId: 1,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '西八',
    id: 1,
    authorUsername: '123123',
    property: 1,
    authorUserId: 4,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '数据库作业情况',
    id: 1,
    authorUsername: '董永昊',
    property: 1,
    authorUserId: 1,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '8月份收入支出账单',
    id: 2,
    authorUsername: '哈哈哈哈',
    property: 0,
    authorUserId: 2,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '一个神奇的表格',
    id: 1,
    authorUsername: '董永昊',
    property: 0,
    authorUserId: 1,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '西八',
    id: 1,
    authorUsername: '123123',
    property: 1,
    authorUserId: 4,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '数据库作业情况',
    id: 1,
    authorUsername: '董永昊',
    property: 1,
    authorUserId: 1,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '8月份收入支出账单',
    id: 2,
    authorUsername: '哈哈哈哈',
    property: 0,
    authorUserId: 2,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '一个神奇的表格',
    id: 1,
    authorUsername: '董永昊',
    property: 0,
    authorUserId: 1,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '西八',
    id: 1,
    authorUsername: '123123',
    property: 1,
    authorUserId: 4,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '数据库作业情况',
    id: 1,
    authorUsername: '董永昊',
    property: 1,
    authorUserId: 1,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '8月份收入支出账单',
    id: 2,
    authorUsername: '哈哈哈哈',
    property: 0,
    authorUserId: 2,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '一个神奇的表格',
    id: 1,
    authorUsername: '董永昊',
    property: 0,
    authorUserId: 1,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  },
  {
    name: '西八',
    id: 1,
    authorUsername: '123123',
    property: 1,
    authorUserId: 4,
    createdTime: '2022-10-20 19:03:20',
    lastModifyTime: '2022-10-20 19:03:20'
  }
]

interface HomeProps {

}

const Home: FunctionComponent<HomeProps> = (props: HomeProps) => {
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
          dataSource={fileInfos}
          pagination={{
            hideOnSinglePage: true
          }}
        >
          <Column title='文件名称' dataIndex='name' key='name' />
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