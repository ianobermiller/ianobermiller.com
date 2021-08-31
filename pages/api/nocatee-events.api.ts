import type {VercelRequest, VercelResponse} from '@vercel/node';
import ical from 'ical-generator';
import fetch from 'node-fetch';
import {FormData} from 'formdata-node';
import cheerio from 'cheerio';
import {OPENSSL_VERSION_NUMBER} from 'node:constants';

const BASE_URL = 'https://residents.nocatee.com';

export default async function main(
  request: VercelRequest,
  response: VercelResponse,
) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const form = new FormData();
  form.set('ctl00$content$from_date', `${month}/${day}/${year}`);
  form.set('ctl00$content$to_date', `${month}/${day}/${year + 1}`);

  const [calendarHtml, calendarHTMLWithJson] = await Promise.all(
    [
      fetch(`${BASE_URL}/events?category_no=5116`, {
        method: 'POST',
        body: form as any,
      }),
      fetch(`${BASE_URL}/events?category_no=5116&type=calendar`),
    ].map(f => f.then(res => res.text())),
  );

  const eventsJson = calendarHTMLWithJson.match(/events:(.*),/)?.[1];
  if (!eventsJson) {
    throw new Error('Could not find events json');
  }

  const jsonEvents = JSON.parse(eventsJson);

  const $ = cheerio.load(calendarHtml);
  const htmlEvents = $('.eventBlock');

  const calendar = ical({
    name: 'Nocatee Events',
    timezone: 'America/New_York',
    source: 'https://www.nocatee.com/events',
  });

  for (const htmlEvent of htmlEvents) {
    if (htmlEvent.type !== 'tag') continue;

    const id = htmlEvent.attribs.id.split('-')[1];
    const jsonEvent = jsonEvents.find(e => e.id === id);
    if (!jsonEvent) continue;

    const description = $('a + .txt', htmlEvent).text().trim();
    const venue = $('.event-venue-text', htmlEvent).text().trim();
    let address = $('.event-location-text', htmlEvent).text().trim();
    if (address.startsWith(venue)) {
      address = address.slice(venue.length).trim();
    }

    calendar.createEvent({
      id,
      start: jsonEvent.start,
      end: jsonEvent.end,
      summary: jsonEvent.title,
      url: BASE_URL + jsonEvent.url,
      location: {
        title: venue,
        address,
      },
      description,
    });
  }

  calendar.serve(response);
}
