import React from "react";
import { ColumnsPerPage, DirectionType, HeaderHorizontalHeight, HeaderVerticalWidth, PageHeight, PageWidth, RowsPerPage } from "src/common/constants";
import HeaderCell from "./HeaderCell";

interface IHeaderPageProp {
    type: DirectionType,
    startIndex: number,
    selectedStart: number,
    selectedEnd: number
}

const HeaderPage = (props: IHeaderPageProp) => {
    const { type, startIndex, selectedEnd, selectedStart } = props;

    const cellsNum = type === DirectionType.HORIZONTAL ? ColumnsPerPage : RowsPerPage;
    let cells = [];
    for (let i = startIndex; i <= startIndex + cellsNum - 1; i++) {
        cells.push(<HeaderCell key={i} type={type} index={i} selectedStart={selectedStart} selectedEnd={selectedEnd} />);
    }
    return (
        <div
            style={type === DirectionType.HORIZONTAL ? {
                float: "left",
                height: HeaderHorizontalHeight,
                width: PageWidth
            } : {
                height: PageHeight,
                width: HeaderVerticalWidth
            }}
        >
            {cells}
        </div>
    )
}

export default HeaderPage;