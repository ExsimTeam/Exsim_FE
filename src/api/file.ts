import { useAxios } from "src/utils/hooks/useAxios"

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