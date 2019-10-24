
import { Service } from 'egg';

export default class StrUtil extends Service {

  /** 
   * 获取全路径中的文件的上一层名字
   * @param fullPath 全部路径
   */
  public getFoldOfFullPath(fullPath: string, fileName: string): string {

    let folderName = '';
    let fileNameWithFlag = '/' + fileName;
    const err = new Error('path is error!');

    if (fullPath && fullPath.indexOf(fileName) > -1) {
      const path = fullPath.replace(fileNameWithFlag, '');
      if (path.indexOf('/') > -1) {
        const index = path.lastIndexOf("/");
        folderName = path.substring(index + 1, path.length);
      }
    } else if (fullPath && fullPath.indexOf(fileName) == -1 || fullPath.indexOf('/') == -1) {
      throw err;
    }

    return folderName;
  }
}