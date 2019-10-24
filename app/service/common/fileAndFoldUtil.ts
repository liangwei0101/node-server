import { Service, FileStream } from 'egg';
import { createWriteStream } from 'fs';
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;
import { exists, existsSync, mkdir, mkdirSync } from 'fs';

export default class FileAndFoldUtil extends Service {
  /** 
   * 创建文件夹
   * @param Path 路径
   */
  public createFolder(path: string) {

    const flag = existsSync(path)
    if (!flag)
      try {
        mkdirSync(path)
      } catch (e) {
        throw e;
      }
  }

  /** 
 * 创建文件夹并且写文件
 * @param Path 路径
 */
  public async createFolderAndWriteFileAsync(stream: FileStream, base: string, fullPath: string) {
    const { ctx } = this;

    const foldName = ctx.service.common.strUtil.getFoldOfFullPath(fullPath, stream.filename);
    const path = base + foldName;

    exists(path, (flag) => {
      if (flag) {
        this.writeFile(stream, path);
      } else {
        mkdir(path, () => {
          this.writeFile(stream, path);
        })
      }
    })
  }

  /** 
  * 写文件
  * @param stream 文件流
  * @param filePath 文件名称
  */
  public async writeFile(stream: FileStream, basePath: string) {
    try {
      //异步把文件流 写入
      const fileFullName = basePath + '/' + stream.filename;
      const writeStream = createWriteStream(fileFullName);
      await awaitWriteStream(stream.pipe(writeStream));
      console.log("------------------------")
      console.log(fileFullName)
    } catch (err) {
      //如果出现错误，关闭管道
      await sendToWormhole(stream);
      throw err;
    }
  }

}