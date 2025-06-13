import * as cheerio from 'cheerio';

const $ = await cheerio.fromURL('https://econolabs.github.io');

//const $ = cheerio.load('<h1>Hello, world!</h1>');

console.log($('h2'));

const data = $.extract({
  red: 'h2',
  links: {
    selector: 'a',
    value: 'href',
  },
});

console.log(data);