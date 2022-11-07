import { useAxios } from "src/utils/hooks/useAxios"
import service from "src/utils/service"

export interface FileInfo {
  fileName: string,
  id: number,
  authorUsername: string,
  authorUserId: number,
  property: number,
  createdTime: string,
  lastModifyTime: string
}

export const useFileList = () => {

  return useAxios<{
  }, {
    files: FileInfo[]
  }>({
    method: 'GET',
    url: 'file/getFileList'
  })
}

export const getFileBody = (fileId: number, page: number, sheetId: number) => {
  return service({
    method: 'GET',
    url: 'file/getFileBody',
    params: {
      fileId: fileId,
      page: page,
      sheetId: sheetId
    }
  })
    .then(response => {
      return response as unknown as {
        code: number,
        msg: string,
        data: {
          rows: any[]
        }
      }
    })
}