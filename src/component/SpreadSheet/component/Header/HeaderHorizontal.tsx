import React from 'react'

import HeaderCorner from './component/HeaderCorner';
import CellsContainer from './component/CellsContainer';
import PlaceHolder from '../PlaceHolder';
import { ColumnsPerPage, DirectionType, HeaderHorizontalHeight } from 'src/common/constants';
import HeaderPage from './component/HeaderPage';

interface IHeaderHorizontalProps {
    // 表头部分的Ref，用于控制滚动
    headerRef: React.RefObject<HTMLDivElement>,
    // 当前显示的page序号
    currentPageIndex: number,
    // 预加载的page数量
    preloadPageNum: number,
    selectedStart: number,
    selectedEnd: number
}


const HeaderHorizontal = (props: IHeaderHorizontalProps) => {
    const { currentPageIndex, preloadPageNum, selectedStart, selectedEnd, headerRef } = props;
    // 占位符所占的page个数
    const placeHolderPageNum = currentPageIndex - preloadPageNum - 1 > 0 ? currentPageIndex - preloadPageNum - 1 : 0;
    // 起始的page编号
    const startPageIndex = currentPageIndex - preloadPageNum > 0 ? currentPageIndex - preloadPageNum : 1;
    // 结束的page编号
    const endPageIndex = currentPageIndex + preloadPageNum;

    let pages = [];
    for (let i = startPageIndex; i <= endPageIndex; i++) {
        pages.push(<HeaderPage key={i} type={DirectionType.HORIZONTAL} startIndex={ColumnsPerPage * (i - 1) + 1}
            selectedStart={selectedStart} selectedEnd={selectedEnd} />)
    }

    return (
        <div style={{
            height: HeaderHorizontalHeight,
            width: "100%",
            background: "rgb(240, 240, 240)",
            position: "relative"
        }}>

            <HeaderCorner />

            <CellsContainer
                type={DirectionType.HORIZONTAL}
                headerRef={headerRef}
                holdPagesNum={endPageIndex}
            >
                <PlaceHolder type={DirectionType.HORIZONTAL} pageNum={placeHolderPageNum} />

                {pages}
            </CellsContainer>
        </div>

    );
}

export default HeaderHorizontal;
