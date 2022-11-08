import { message } from "antd";
import { Component, useEffect } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { getFileBody, openFile } from "src/api/file";
import { isNumeric, toJSON, toName } from "src/common/utils";
import SpreadSheet, { CellData } from "src/component/SpreadSheet";
import { Loading } from "src/utils/lazyLoad";

import "./index.scss";



class SheetMain extends Component<{ sheetId: string | undefined, navigate: NavigateFunction }, { isLoading: boolean }> {

  data: Array<Array<CellData>>;
  status: boolean[];
  sheet: SpreadSheet | null = null;
  ws: WebSocket | null = null
  utoken: string = ''
  fileId: number = 0

  constructor(props: any) {
    super(props);
    this.data = new Array(100);
    this.status = [];
    this.state = {
      isLoading: true
    }

    const sheetId = this.props.sheetId
    if (isNumeric(sheetId)) {
      this.fileId = parseInt(sheetId!)
      this.openWebsocket()
    } else {
      this.props.navigate('/')
    }
  }

  openWebsocket = () => {
    if (this.ws !== null && this.ws.readyState !== WebSocket.CLOSED) {
      return
    }
    // Get the utoken of file
    openFile(this.fileId)
      .then(response => {
        if (response.code === 1) {
          this.utoken = response.data.utoken
          this.ws = new WebSocket(`ws://45.76.96.123:8888/api/edit?utoken=${this.utoken}`)

          this.ws.onopen = (e) => {
            console.log('WebSocket connection established')
          }

          this.ws.onmessage = (e) => {
            let data
            try {
              data = JSON.parse(e.data)
            } catch (error) {
              message.error('连接出错')
            }
            console.log(data)

            if (data.code === 1) {
              switch (data.opcode) {
                case -1: {
                  // Server message
                  if (this.state.isLoading)
                    this.setState({
                      isLoading: false
                    })
                  break
                }
                case 0: {
                  // Modify a cell
                  let opt = toJSON(data.data, () => message.error('消息出错'))
                  console.log(opt)
                  this.setData(opt.col, opt.row, { value: opt.value, format: opt.format }, true)
                  this.sheet?.setState({})
                  break
                }
                case 1: {

                  break;
                }
                case 2: {
                  break
                }
                case 3: {
                  break
                }
                case 4: {
                  break
                }
              }
            } else if (data.code === 400) {
              message.error('消息有误')
            } else if (data.code === 401) {
              message.error('身份认证失败')
              setTimeout(() => {
                this.props.navigate('/')
              }, 1000)
            } else {
              message.error('未知错误')
            }
          }

          this.ws.onclose = () => {
            console.log('WebSocket closed')
            this.setState({
              isLoading: true
            })
            this.openWebsocket()
            message.info('连接丢失，尝试重新建立')
          }

          this.ws.onerror = (e) => {
            message.error('连接出错')
            this.openWebsocket()
          }
        } else if (response.code === 100) {
          message.error('文件不存在')
          setTimeout(() => {
            this.props.navigate('/')
          }, 1000)
        } else {
          message.error(response.code + ': ' + response.msg)
          setTimeout(() => {
            this.props.navigate('/')
          }, 1000)
        }
      })
  }

  modifyCell = (sheetId: number, x: number, y: number, s: CellData) => {
    let data = JSON.stringify({
      opcode: 0,
      data: {
        sheetId: sheetId,
        row: y,
        col: x,
        value: s.value,
        format: s.format
      }
    })
    console.log(s.format)
    console.log(data)
    this.ws?.send(data)
  }

  getData = (x: number, y: number) => {
    if (this.data[x - 1] !== undefined) {
      if (this.data[x - 1][y - 1] !== undefined) {
        return this.data[x - 1][y - 1];
      }
    }

    return null;
  }

  setData = (x: number, y: number, s: any, websocket = false) => {
    if (this.data[x - 1] === undefined) {
      this.data[x - 1] = [];
    }
    this.data[x - 1][y - 1] = s;
    if (!websocket) this.modifyCell(0, x, y, s)
  }

  // return if horizontal page of pageIndex is ready
  getStatus = (pageIndex: number) => {
    if (this.status[pageIndex] === undefined) {
      this.status[pageIndex] = false;

      // Request data here
      getFileBody(this.fileId, pageIndex, 0)
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
                  let format = toJSON(v.format, () => message.warn(`单元格${toName(colNum)}${rowNum}格式错误`))
                  this.setData(colNum, rowNum, {
                    value: v.value,
                    format: format ? format : {}
                  }, true)
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
    return this.state.isLoading ? <Loading /> :
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