"use client";

import { useEffect } from "react";

/**
 * Detect the vistor's timezone and set it in a cookie, which is valid for a year.
 *
 * @returns nothing, just set the cookie
 */
export function TimezoneDetector() {
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (timezone) {
      document.cookie = `timezone=${timezone}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, []);

  return null;
}
