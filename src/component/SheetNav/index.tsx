import { HomeOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import './index.scss';

interface SheetNavProps {
  fileName?: string,
  createdTime?: string,
  author?: string,
  loading?: boolean
}

export default function SheetNav(props: SheetNavProps) {
  const navigate = useNavigate()

  return (
    <div className='sheet-nav-wrapper'>
      <div className='button-back'
        onClick={() => navigate('/')}
      ><HomeOutlined color='#444' /></div>
      <div className='file-name'>{props.fileName}</div>
      {props.loading && <div className='loading-wrapper'><Spin /></div>}
      <div className='created-time'>作者：{props.author}</div>
      <div className='created-time'>上次修改：{props.createdTime}</div>
    </div>
  )
}