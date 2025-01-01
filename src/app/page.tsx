import * as cheerio from 'cheerio'
import TurndownService from 'turndown'

export default function Home() {
  const scrapHtml = async (formData: FormData) => {
    'use server'

    const url = formData.get('url') as string
    const response = await fetch(url)
    const html = await response.text()
    console.log('HTML', html.slice(0, 1000))
    // Extract main content using cheerio
    const $ = cheerio.load(html)
    const content = $('body').text()
    console.log('Content', content.slice(0, 1000))

    const turndownService = new TurndownService()
    const markdown = turndownService.turndown(content)
    console.log('Markdown', markdown.slice(0, 1000))
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
