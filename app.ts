
import { Application, IBoot } from 'egg';
import { writeFileSync, existsSync, readFileSync } from 'fs';

export default class FooBoot implements IBoot {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
  }

  configDidLoad() {
    // Config, plugin files have loaded.
  }

  async didLoad() {
    // All files have loaded, start plugin here.
  }

  async willReady() {
    // All plugins have started, can do some thing before app ready.
  }

  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.
  }

  async serverDidReady() {
    // Server is listening.

    // 读取文件到框架中
    this.app.config.photosJsonFilePath = this.app.baseDir + '\\' + this.app.config.photosJsonFile;
    const FileFullPath = this.app.config.photosJsonFilePath;

    const flag = existsSync(FileFullPath)
    if (!flag) {
      writeFileSync(this.app.config.photosJsonFilePath, '');
    }

    const jsonData = readFileSync(FileFullPath, 'utf-8');
    this.app.config.photosFileList = JSON.parse(jsonData)
  }

  async beforeClose() {
    // Do some thing before app close.

    // 写文件到框架中
    writeFileSync(this.app.config.photosJsonFilePath, this.app.config.photosFileList);
  }
}