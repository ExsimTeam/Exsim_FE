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
      <div className='file-name'>
        <span className='file-name-text'>
          {props.fileName}
        </span>
        {props.loading && <div className='loading-wrapper'><Spin /></div>}
      </div>
      <div className='author'><strong>作者：</strong>{props.author}</div>
      <div className='created-time'><strong>上次修改：</strong>{props.createdTime}</div>
    </div>
  )
}