import { Controller, FileStream } from 'egg';
import { createHash } from 'crypto';
import { writeFileSync } from 'fs'

export default class UploadController extends Controller {

  /** 
  * 上传文件
  */
  public async uploadFiles() {
    const { ctx } = this;

    const base = 'E:/Test/';
    const stream = await ctx.getFileStream();
    const fullPath = stream.fields['path']

    let filePathMd5 = await this.writeFileInit(fullPath, stream, base);

    ctx.body = filePathMd5
  }

  /** 
  * 写文件初始化
  * @param stream 文件流
  * @param fullPath 全路径
  * @param base 文件存储位置
  */
  private async writeFileInit(fullPath: any, stream: FileStream, base: string) {
    let filePathMd5 = '';
    let photosFileList = this.app.config.photosFileList;

    if (photosFileList) {
      // 全路径base64
      const md5 = createHash('md5');
      const fullPathMd5 = md5.update(fullPath).digest('hex');
      let filePathMd5 = photosFileList[fullPathMd5];
      if (!filePathMd5) { // 没有上传过此文件
        filePathMd5 = await this.writeFile(stream, base, fullPath, filePathMd5, photosFileList);
      }
    } else {
      return filePathMd5;
    }

    return filePathMd5;
  }

  /** 
  * 写文件初始化
  * @param stream 文件流
  * @param fullPath 全路径
  * @param base 文件存储位置
  * @param filePathMd5 路径的md5值
  * @param photosFileList 文件存的列表
  */
  private async writeFile(stream: FileStream, base: string, fullPath: any, filePathMd5: any, photosFileList: any) {
    const { ctx } = this;
    const basePath = this.createFolder(stream, base, fullPath);
    const flag = await ctx.service.common.fileAndFoldUtil.writeStreamFile(stream, basePath);
    if (flag) { // 成功创建文件
      const md5 = createHash('md5');
      const fullPathMd5 = md5.update(fullPath).digest('hex');
      photosFileList[fullPathMd5] = fullPathMd5;
      console.log(photosFileList)
      // 更新json文件
      writeFileSync(this.app.config.photosJsonFilePath, JSON.stringify(photosFileList));
    }
    return filePathMd5;

  }

  /** 
  * 获取全路径中的文件的上一层名字
  * @param stream 文件流
  * @param fullPath 文件保存路径
  */
  private createFolder(stream: FileStream, base: string, fullPath: string) {
    const { ctx } = this;
    let filePath = '';
    const foldName = ctx.service.common.strUtil.getFoldOfFullPath(fullPath, stream.filename);
    if (foldName) {
      filePath = base + foldName;
      ctx.service.common.fileAndFoldUtil.createFolder(filePath);
    }

    return filePath;
  }

}