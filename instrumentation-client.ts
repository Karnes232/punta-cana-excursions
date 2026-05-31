import { initBotId } from "botid/client/core";

// Register the POST endpoints that need invisible bot protection.
// The client runs a silent challenge for these paths; the matching
// route handlers verify it server-side via checkBotId().
initBotId({
  protect: [
    { path: "/api/contact", method: "POST" },
    { path: "/api/inquiries", method: "POST" },
  ],
});
