import { HomeOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import './index.scss';

interface SheetNavProps {
  fileId: number,
  fileName?: string,
  createdTime?: string,
  loading?: boolean
}

export default function SheetNav(props: SheetNavProps) {
  return (
    <div className='sheet-nav-wrapper'>
      <div className='button-back'><HomeOutlined color='#444' /> 返回主页</div>
      <div className='file-name'>{props.fileName}</div>
      {props.loading && <div className='loading-wrapper'><Spin /></div>}
      <div className='created-time'>{props.createdTime}</div>
      <Button className='button-share' type='primary'>分享</Button>
    </div>
  )
}