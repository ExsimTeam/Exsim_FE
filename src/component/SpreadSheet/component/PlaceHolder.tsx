import { DirectionType, PageHeight, PageWidth } from "src/common/constants";

interface IPlaceHolderProp {
    type: DirectionType,
    pageNum: number
}

const PlaceHolder = (props: IPlaceHolderProp) => {
    const { type, pageNum } = props;
    return (
        <div style={type === DirectionType.HORIZONTAL ? {
            float: "left",
            height: 1,
            width: pageNum * PageWidth,
        } : {
            height: pageNum * PageHeight,
            width: 1
        }
        }></div>
    )
}


export default PlaceHolder;