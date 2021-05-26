/**
 * @author    Yannick Deubel (https://github.com/yandeu)
 * @copyright Copyright (c) 2021 Yannick Deubel
 * @license   {@link https://github.com/yandeu/parse-markdown/blob/main/LICENSE MIT}
 */

// read: https://www.npmjs.com/package/remark-parse
import YAML from 'yaml'
import frontmatter from 'remark-frontmatter' // Support frontmatter.
import fs from 'fs/promises'
import html from 'rehype-stringify' // Serialize HTML.
import markdown from 'remark-parse' // Parse markdown.
import remark2rehype from 'remark-rehype' // Turn it into HTML.
import remarkGfm from 'remark-gfm' // Support GFM (tables, autolinks, tasklists, strikethrough).
import unified from 'unified'

function stringify(options) {
  // @ts-ignore
  const self = this

  // @ts-ignore
  this.Compiler = compile

  function compile(tree) {
    return tree
  }
}

const markdownProcessor = unified().use(markdown).use(remarkGfm).use(frontmatter, ['yaml']).use(remark2rehype).use(html)
// @ts-ignore
const yamlProcessor = unified().use(markdown).use(frontmatter, ['yaml']).use(stringify)

const extractYAMLFromMarkdown = data => {
  const yaml = data.result.children.filter(block => block.type === 'yaml')[0]
  if (yaml) return YAML.parse(yaml.value)
  else return undefined
}

export const parseYAML = yaml => {
  return YAML.parse(yaml)
}

export const parseMarkdownFromFile = async (path: string): Promise<{ markdown: string; yaml: {} }> => {
  try {
    const data = await fs.readFile(path, { encoding: 'utf-8' })
    console.log(data)
    return await parseMarkdown(data)
  } catch (error) {
    return error
  }
}

export const parseMarkdown = (data: string): Promise<{ markdown: string; yaml: {} }> => {
  return new Promise((resolve, reject) => {
    const result = { markdown: '', yaml: {} }

    const done = () => {
      if (Object.keys(result).length === 2) return resolve(result)
    }

    markdownProcessor.process(data, (err, file) => {
      if (err) {
        console.log(err.message)
        return reject(err.message)
      }

      const md = String(file)
      result.markdown = md
      done()
    })

    yamlProcessor.process(data, (err, file) => {
      if (err) {
        console.log(err.message)
        return reject(err.message)
      }

      const yaml = extractYAMLFromMarkdown(file)
      result.yaml = yaml
      done()
    })
  })
}
