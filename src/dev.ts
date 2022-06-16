import fs from 'fs/promises'
import { parseMarkdown } from './index.js'

const main = async () => {
  const data = await fs.readFile('test/test.md', { encoding: 'utf-8' })
  const md = await parseMarkdown(data) // Promise<{ markdown: string; yaml: {}; }>
  console.log(md)
}

setTimeout(() => {
  main()
}, 250)
