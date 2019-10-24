import { Controller } from 'egg';
import { createWriteStream } from 'fs';
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;

export default class UploadController extends Controller {

  public async uploadFiles() {
    const { ctx } = this;

    const stream = await ctx.getFileStream();

    // 路径 + 名称
    const filename = 'E:/Test/' + stream.filename;

    const writeStream = createWriteStream(filename);

    stream.pipe(writeStream)

    try {
      //异步把文件流 写入
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      //如果出现错误，关闭管道
      await sendToWormhole(stream);
      throw err;
    }

    ctx.body = stream.filename
  }

}
