import { Client, Storage, ID } from 'node-appwrite'
import { InputFile } from 'node-appwrite/file'
import env from '#start/env'

class AppwriteStorageService {
  private storage: Storage
  private bucketId: string

  constructor() {
    const client = new Client()
      .setEndpoint(env.get('APPWRITE_ENDPOINT'))
      .setProject(env.get('APPWRITE_PROJECT_ID'))
      .setKey(env.get('APPWRITE_SECRET'))

    this.storage = new Storage(client)
    this.bucketId = env.get('APPWRITE_READ_BUCKET_ID')!
  }
  // Upload a file
  async upload(buffer: Buffer, filename: string) {
    return await this.storage.createFile({
      bucketId: this.bucketId,
      fileId: ID.unique(),
      file: InputFile.fromBuffer(buffer, filename),
    })
  }

  // Get file metadata
  async getFile(fileId: string) {
    return await this.storage.getFile(this.bucketId, fileId)
  }

  // Get file for download (returns raw bytes)
  async downloadFile(fileId: string) {
    return await this.storage.getFileDownload(this.bucketId, fileId)
  }

  // Get a preview URL (for images)
  getPreviewUrl(fileId: string) {
    return `${env.get('APPWRITE_ENDPOINT')}/storage/buckets/${this.bucketId}/files/${fileId}/view?project=${env.get('APPWRITE_PROJECT_ID')}`
  }

  // List all files
  async listFiles() {
    return await this.storage.listFiles(this.bucketId)
  }

  // Delete a file
  async deleteFile(fileId: string) {
    return await this.storage.deleteFile(this.bucketId, fileId)
  }
}

export default new AppwriteStorageService()
