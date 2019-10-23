import { Controller } from 'egg';
// import { createWriteStream } from 'fs'

export default class UploadController extends Controller {

  public async uploadFiles() {
    const { ctx } = this;

    const stream = await ctx.getFileStream();
    ctx.body = stream.filename
  }

}
