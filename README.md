# Parse Markdown

## Three simple steps

1\) Input

```md
---
test: true
list:
  - one
  - two
---

# hello

This is a paragraph.
```

2\) Code

```ts
import fs from 'fs/promises'
import { parseMarkdown } from '@yandeu/parse-markdown'

const main = async () => {
  const data = await fs.readFile('test.md', { encoding: 'utf-8' })
  const md = await parseMarkdown(data) // Promise<{ markdown: string; yaml: {}; }>
  console.log(md)
}
main()
```

3\) Output

```json
{
  "markdown": "<h1>hello</h1>\n<p>This is a paragraph.</p>",
  "yaml": { "test": true, "list": ["one", "two"] }
}
```

---

Need more? Make a [pull request](https://github.com/yandeu/parse-markdown)!
