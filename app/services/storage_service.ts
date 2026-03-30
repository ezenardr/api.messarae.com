import { Client, Storage, ID } from 'node-appwrite'
import { InputFile } from 'node-appwrite/file'
import env from '#start/env'
import sharp from 'sharp'

class AppwriteStorageService {
  private storage: Storage
  private bucketId: string

  constructor() {
    const client = new Client()
      .setEndpoint(env.get('APPWRITE_ENDPOINT'))
      .setProject(env.get('APPWRITE_PROJECT_ID'))
      .setKey(env.get('APPWRITE_SECRET'))

    this.storage = new Storage(client)
    this.bucketId = env.get('APPWRITE_BUCKET_ID')!
  }
  // Upload a file
  async upload(buffer: Buffer, filename: string) {
    const imageBuffer = await compressToTarget(buffer, 1024)
    return await this.storage.createFile({
      bucketId: this.bucketId,
      fileId: ID.unique(),
      file: InputFile.fromBuffer(imageBuffer, filename),
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
    return await this.storage.deleteFile({ bucketId: this.bucketId, fileId })
  }
}
const KB = 1024

async function compressToTarget(buffer: Buffer, maxSizeKB = 3) {
  const maxSizeBytes = maxSizeKB * KB
  if (buffer.length <= maxSizeBytes) {
    return buffer
  }

  // First try quality reduction
  let quality = 90
  let output: Buffer = buffer
  while (quality > 10) {
    output = await sharp(buffer).webp({ quality }).toBuffer()
    if (output.length <= maxSizeBytes) {
      return output
    }
    quality -= 5
  }

  // If quality alone isn't enough, also scale down dimensions
  const metadata = await sharp(buffer).metadata()
  let width = metadata.width ?? 1920
  while (width > 100) {
    width = Math.floor(width * 0.75)
    output = await sharp(buffer).resize({ width }).webp({ quality: 10 }).toBuffer()
    if (output.length <= maxSizeBytes) {
      return output
    }
  }

  return output
}

export default new AppwriteStorageService()
