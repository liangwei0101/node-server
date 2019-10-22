import { Controller } from 'egg';
import { createWriteStream } from 'fs'

export default class UploadController extends Controller {
  public async uploadFiles() {
    const { ctx } = this;

    const stream = await ctx.getFileStream();
    const filename = stream.filename;

    //生成一个文件写入 文件流
    const writeStream = createWriteStream(filename);
    try {
        //异步把文件流 写入
   
    } catch (err) {
  
    }
    
    ctx.body = '200'
  }
}
