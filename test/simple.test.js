import fs from 'fs/promises'
import { parseMarkdown } from '../lib/index'

test('should parse without errors', async () => {
  const data = await fs.readFile('test/test.md', { encoding: 'utf-8' })
  const md = await parseMarkdown(data)

  // test markdown
  expect(md.markdown).toBe(`<h1>hello</h1>
<p>This is a paragraph.</p>
<div>dev</div>
<div id="test">#test</div>
<section>section</section>`)

  // test yaml
  expect(md.yaml.test).toBeTruthy()
  expect(md.yaml.list.length).toBe(2)
  expect(md.yaml.list[0]).toBe('one')
  expect(md.yaml.list[1]).toBe('two')
})
