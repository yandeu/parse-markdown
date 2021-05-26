const fs = require('fs/promises')
const { parseMarkdown } = require('../lib/index')

test('should parse without errors', async done => {
  const data = await fs.readFile('test/test.md', { encoding: 'utf-8' })
  const md = await parseMarkdown(data)

  expect(md.markdown).toBe('<h1>hello</h1>\n<p>This is a paragraph.</p>')
  expect(md.yaml.test).toBeTruthy()
  expect(md.yaml.list.length).toBe(2)
  expect(md.yaml.list[0]).toBe('one')
  expect(md.yaml.list[1]).toBe('two')

  done()
})
