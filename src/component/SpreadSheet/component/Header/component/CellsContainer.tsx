import React from "react";
import {
    CellHeight,
    CellWidth,
    ColumnsPerPage,
    DirectionType,
    HeaderHorizontalHeight,
    HeaderVerticalWidth,
    RowsPerPage
} from "src/common/constants";

interface IHHContainerProp {
    type: DirectionType,
    headerRef: React.RefObject<HTMLDivElement>,
    holdPagesNum: number,
    children?: any
}

/**
 * 盛装表头单元格的容器
 */
const CellsContainer = (props: IHHContainerProp) => {
    const { type, headerRef, holdPagesNum, children } = props
    return (
        <div ref={headerRef}
            style={type === DirectionType.HORIZONTAL ? {
                overflow: "hidden",
                position: "absolute",
                left: HeaderVerticalWidth,
                top: 0,
                height: HeaderHorizontalHeight,
                width: `calc(100% - ${HeaderVerticalWidth}px)`
            } : {
                overflow: "hidden",
                position: "absolute",
                left: 0,
                right: 0,
                height: "100%",
                width: HeaderVerticalWidth
            }}
        >

            <div
                style={type === DirectionType.HORIZONTAL ? {
                    height: "100%",
                    width: holdPagesNum * ColumnsPerPage * CellWidth
                } : {
                    height: holdPagesNum * RowsPerPage * CellHeight,
                    width: "100%"
                }}
            >
                {children}
            </div>
        </div>
    )

}

export default CellsContainer;