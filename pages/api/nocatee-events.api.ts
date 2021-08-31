import ical from 'ical-generator';
import fetch from 'node-fetch';

const BASE_URL = 'https://residents.nocatee.com';

export default async function main(req, res) {
  const calendarHtml = await (
    await fetch(`${BASE_URL}/events?type=calendar`)
  ).text();

  const eventsJson = calendarHtml.match(/events:(.*),/)?.[1];

  if (!eventsJson) {
    throw new Error('Could not find events json');
  }

  const events = JSON.parse(eventsJson);

  const calendar = ical({name: 'Nocatee Events'});
  calendar.timezone('America/New_York');

  for (const event of events) {
    calendar.createEvent({
      id: event.id,
      start: event.start,
      end: event.end,
      summary: event.title,
      url: BASE_URL + event.url,
    });
  }

  calendar.serve(res);
}
