import { Controller, FileStream } from 'egg';

export default class UploadController extends Controller {

  /** 
  * 上传文件
  */
  public async uploadFiles() {
    const { ctx } = this;

    const base = 'E:/Test/';
    const stream = await ctx.getFileStream();
    const fullPath = stream.fields['path']

    const basePath = this.createFolder(stream, base, fullPath);
    await ctx.service.common.fileAndFoldUtil.writeStreamFile(stream, basePath);

    ctx.body = stream.filename
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
