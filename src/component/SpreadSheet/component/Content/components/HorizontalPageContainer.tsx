import { Skeleton } from "antd";
import React from "react";
import { DirectionType, PageHeight, PageWidth } from "src/common/constants";
import PlaceHolder from "../../PlaceHolder";
import Page from "./Page";

interface IHPCProp {
    // 该行page的纵向序号
    verticalPageIndex: number,
    // 当前显示的page横向序号
    currentHorizontalIndex: number,
    // 预加载横向page数量
    preloadHorizontalNum: number,

    getData: Function
    isReady: boolean
}

/**
 * 盛装page的行容器
 */
class HorizontalPageContainer extends React.Component<IHPCProp> {
    render() {
        const { currentHorizontalIndex, preloadHorizontalNum, verticalPageIndex } = this.props;
        // 列占位符所占的page个数
        const PHHorizontalPageNum = currentHorizontalIndex - preloadHorizontalNum - 1 > 0 ?
            currentHorizontalIndex - preloadHorizontalNum - 1 : 0;
        // 起始的列page编号
        const startHorizontalPage = currentHorizontalIndex - preloadHorizontalNum > 0 ?
            currentHorizontalIndex - preloadHorizontalNum : 1;
        // 结束的列page编号
        const endHorizontalPage = currentHorizontalIndex + preloadHorizontalNum;

        if (!this.props.isReady) {
            const sk = []
            for (let i = 0; i < 24; i++) {
                sk.push(
                    <Skeleton key={i} active title={false} />
                )
            }
            return <div
                style={{
                    width: endHorizontalPage * PageWidth,
                    height: PageHeight
                }}
            >
                {sk}
            </div>
        }

        let pages = [];
        for (let i = startHorizontalPage; i <= endHorizontalPage; i++) {
            pages.push(<Page key={i} horizontalIndex={i} verticalIndex={verticalPageIndex} getData={this.props.getData} />);
        }

        return (
            <div
                style={{
                    width: endHorizontalPage * PageWidth,
                    height: PageHeight
                }}
            >

                <PlaceHolder type={DirectionType.HORIZONTAL} pageNum={PHHorizontalPageNum} />

                {pages}
            </div>
        )
    }
}

export default HorizontalPageContainer;