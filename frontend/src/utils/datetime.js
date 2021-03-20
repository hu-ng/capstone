// Defines a helper module to deal with datetime wackiness on the client.
// Because the backend expects and returns UTC ISO strings, we need to:
// - Convert time strings from DB into local time on the client.
// - Convert local time strings back into UTC before sending a request.

import { DateTime } from "luxon"; // Luxon makes it easier to do all of this

const DatetimeUtils = (function () {
  // Takes UTC string from server, returns a local JS Date object
  function parseDateFromDB(dateStr) {
    // Parse date as utc, turn into local
    let luxon_date = DateTime.fromISO(dateStr, { zone: "utc" }).toLocal();
    // Return JS date
    return luxon_date.toJSDate();
  }

  // Takes a JS Date object and turn it into a ISO-formatted string in UTC time
  function formatForDB(date) {
    // Take in local time
    let luxon_date = DateTime.fromJSDate(date);

    // Return iso string
    return luxon_date.toUTC().toISO();
  }

  // Helper function turning date to str.
  function dateToStr(dateStr) {
    if (dateStr) {
      // Parse datetime str as UTC, converts it to host time
      const date = DateTime.fromISO(dateStr, { zone: "utc" }).toLocal();

      // Returns human-friendly string
      return date.toLocaleString();
    }
  }

  return {
    parseDateFromDB,
    formatForDB,
    dateToStr,
  };
})();

export default DatetimeUtils;
