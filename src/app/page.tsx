import * as cheerio from 'cheerio'
import fs from 'fs'
import TurndownService from 'turndown'
export default function Home() {
  const scrapHtml = async (formData: FormData) => {
    'use server'

    const url = formData.get('url') as string
    const response = await fetch(url)
    const html = await response.text()

    // Extract main content using cheerio
    const $ = cheerio.load(html)
    $('script, style, noscript, .advertisement, .footer, #comments').remove()
    const content = $('body').text()

    //console.log($('title').first().text())

    // Convert to markdown
    const turndownService = new TurndownService()
    const markdown = turndownService.turndown(content)
    //write to file
    fs.writeFileSync('output.md', markdown)
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
