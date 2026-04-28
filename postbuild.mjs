import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

function findHtmlFiles(dir) {
  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...findHtmlFiles(full))
    else if (entry.name.endsWith('.html')) files.push(full)
  }
  return files
}

const outDir = join(process.cwd(), 'out')
const cssDir = join(outDir, '_next/static/css')
const cssFile = readdirSync(cssDir).find(f => f.endsWith('.css'))

if (!cssFile) {
  console.error('No CSS file found in out/_next/static/css/')
  process.exit(1)
}

const cssContent = readFileSync(join(cssDir, cssFile), 'utf8')
const cssHref = `/_next/static/css/${cssFile}`

const linkRegex = new RegExp(
  `<link rel="stylesheet" href="${cssHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*/?>`,
  'g'
)

let count = 0
for (const htmlFile of findHtmlFiles(outDir)) {
  const html = readFileSync(htmlFile, 'utf8')
  const newHtml = html.replace(linkRegex, `<style>${cssContent}</style>`)
  if (newHtml !== html) {
    writeFileSync(htmlFile, newHtml, 'utf8')
    count++
  }
}

console.log(`CSS inliné dans ${count} fichier(s) HTML`)
