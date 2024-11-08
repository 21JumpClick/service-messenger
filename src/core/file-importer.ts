import {resolve} from "path";
import * as fs from "node:fs";

export class FileImporter {
  static async import(path: string) {
    const current = resolve(path)
    const files = await FileImporter.treeResolver(current)
    if (!files) {
      throw 'No files found'
    }
    await Promise.all(files.map((e) => import(e)))
  }

  static async treeResolver(path: string) {
    const files = fs.readdirSync(path)
    const result: string[] = []
    for (const file of files.filter(
      (e : any) =>
        !e.includes('node_modules')
    )) {
      const filePath = resolve(path, file)
      const isDirectory = fs.statSync(filePath).isDirectory()
      if (isDirectory) {
        const child = await FileImporter.treeResolver(filePath)
        result.push(...(child || []))
      } else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.cjs') || file.endsWith('.mjs')) {
        result.push(filePath)
      }
    }
    return result
  }
}
