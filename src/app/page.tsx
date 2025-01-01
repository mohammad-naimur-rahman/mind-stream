// import * as cheerio from 'cheerio'
import { Readability } from '@mozilla/readability'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import TurndownService from 'turndown'

export default function Home() {
  // const scrapHtml = async (formData: FormData) => {
  //   'use server'

  //   const url = formData.get('url') as string
  //   const response = await fetch(url)
  //   const html = await response.text()

  //   // Extract main content using cheerio
  //   const $ = cheerio.load(html)
  //   $('script, style, noscript, .advertisement, .footer, #comments').remove()
  //   const content = $('body').text()

  //   //console.log($('title').first().text())

  //   // Convert to markdown
  //   const turndownService = new TurndownService()
  //   const markdown = turndownService.turndown(content)
  //   //write to file
  //   fs.writeFileSync('output.md', markdown)
  // }

  const scrapHtml = async (formData: FormData) => {
    'use server'

    const url = formData.get('url') as string
    const response = await fetch(url)
    const html = await response.text()

    // Load HTML into JSDOM
    const dom = new JSDOM(html)
    const reader = new Readability(dom.window.document)

    // Extract the main article content
    const article = reader.parse()

    if (article) {
      const { title, content } = article

      // Convert HTML content to Markdown
      const turndownService = new TurndownService()
      const markdown = turndownService.turndown(content)

      // Write to file
      fs.writeFileSync('output.md', `# ${title}\n\n${markdown}`)
    } else {
      console.error('Failed to extract article content.')
    }
  }

  return (
    <h1>
      <form action={scrapHtml}>
        <input type='text' name='url' />
        <button type='submit'>Scrap</button>
      </form>
    </h1>
  )
}
