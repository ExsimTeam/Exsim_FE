import { message } from "antd";
import { useEffect } from "react";
import { Component } from "react";
import { Navigate, NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { getFileBody } from "src/api/file";
import { isNumeric, toName } from "src/common/utils";
import SpreadSheet, { CellData } from "src/component/SpreadSheet";

import "./index.scss";



class SheetMain extends Component<{ sheetId: string | undefined, navigate: NavigateFunction }, { isLoading: true }> {

  data: Array<Array<CellData>>;
  status: boolean[];
  sheet: SpreadSheet | null = null;
  // ws: WebSocket
  // utoken: string
  sheetId: number = 0

  constructor(props: any) {
    super(props);
    this.data = new Array(100);
    this.status = [];
    this.state = {
      isLoading: true
    }

    const sheetId = this.props.sheetId
    if (isNumeric(sheetId)) {
      this.sheetId = parseInt(sheetId!)
    } else {
      this.props.navigate('/')
    }
  }

  getData = (x: number, y: number) => {
    if (this.data[x - 1] !== undefined) {
      if (this.data[x - 1][y - 1] !== undefined) {
        return this.data[x - 1][y - 1];
      }
    }

    return null;
  }

  setData = (x: number, y: number, s: any) => {
    if (this.data[x - 1] === undefined) {
      this.data[x - 1] = [];
    }
    this.data[x - 1][y - 1] = s;
  }

  // return if horizontal page of pageIndex is ready
  getStatus = (pageIndex: number) => {
    if (this.status[pageIndex] === undefined) {
      this.status[pageIndex] = false;

      // Request data here
      getFileBody(this.sheetId, pageIndex, 0)
        .then(response => {
          if (response.code === 1) {
            this.status[pageIndex] = true
            const rows = response.data.rows

            // Read rows
            for (let i = 0; i < rows.length; i++) {
              let row = rows[i]
              let rowNum = row.row

              // Read columns
              for (let key in row) {
                if (isNumeric(key)) {
                  let colNum = parseInt(key)
                  let v = row[key]

                  // Try to parse format into JSON
                  let format
                  try {
                    format = JSON.parse(v.format)
                  } catch (error) {
                    format = {}
                    message.warn(`单元格${toName(colNum)}${rowNum}格式错误`)
                  }
                  this.setData(colNum, rowNum, {
                    value: v.value,
                    format: format
                  })
                }
              }
            }

            this.sheet?.setState({})
          } else {
            message.error('获取数据失败')
          }
        })
    }
    return this.status[pageIndex];
  }

  render() {
    return (
      <div className="sheet-container">
        <div className="sheet-spreadsheet">
          <SpreadSheet
            ref={v => this.sheet = v}
            getData={this.getData}
            setData={this.setData}
            getStatus={this.getStatus}
            preloadHorizontalNum={2}
            preloadVerticalNum={2}
          />
        </div>
      </div>
    )
  }
}


const Sheet = () => {
  const { sheetId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (sheetId === undefined) navigate('/')
  })

  return sheetId === undefined ? <></> : <SheetMain sheetId={sheetId} navigate={navigate} />
}

export default Sheet;