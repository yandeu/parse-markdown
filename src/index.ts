/**
 * @author    Yannick Deubel (https://github.com/yandeu)
 * @copyright Copyright (c) 2021 Yannick Deubel
 * @license   {@link https://github.com/yandeu/parse-markdown/blob/main/LICENSE MIT}
 */

// read: https://www.npmjs.com/package/remark-parse
import YAML from 'yaml'
import frontmatter from 'remark-frontmatter' // Support frontmatter.
import markdown from 'remark-parse' // Parse markdown.
import raw from 'rehype-raw'
import remark2rehype from 'remark-rehype' // Turn it into HTML.
import remarkGfm from 'remark-gfm' // Support GFM (tables, autolinks, tasklists, strikethrough).
import serialize from 'rehype-stringify' // Serialize HTML.
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

// function logger() {
//   return transformer

//   function transformer(tree, file) {
//     console.log(tree)
//   }
// }

const markdownProcessor = unified()
  .use(markdown)
  .use(remarkGfm)
  .use(frontmatter, ['yaml'])
  .use(remark2rehype, { allowDangerousHtml: true })
  .use(raw)
  .use(serialize)

const yamlProcessor = unified()
  .use(markdown)
  .use(frontmatter, ['yaml'])
  // @ts-ignore
  .use(stringify)

const extractYAMLFromMarkdown = data => {
  const yaml = data.result.children.filter(block => block.type === 'yaml')[0]
  if (yaml) return YAML.parse(yaml.value)
  else return undefined
}

export const parseYAML = yaml => {
  return YAML.parse(yaml)
}

export const parseMarkdown = async (data: string): Promise<{ markdown: string; yaml: {} }> => {
  const result = { markdown: '', yaml: {} }

  const [markdown, yaml] = (await Promise.all([processMarkdown(data), processYaml(data)]).catch(error =>
    console.log(error.message)
  )) as [string, Object]

  result.markdown = markdown
  result.yaml = yaml

  return result
}

const processMarkdown = (data): Promise<string> => {
  return new Promise((resolve, reject) => {
    markdownProcessor.process(data, (err, file) => {
      if (err) {
        console.log(err.message)
        return reject(err.message)
      }

      const md = String(file)
      resolve(md)
    })
  })
}

const processYaml = (data): Promise<Object> => {
  return new Promise((resolve, reject) => {
    yamlProcessor.process(data, (err, file) => {
      if (err) {
        console.log(err.message)
        return reject(err.message)
      }

      const yaml = extractYAMLFromMarkdown(file)
      resolve(yaml)
    })
  })
}
