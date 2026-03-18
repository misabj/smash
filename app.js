import { default as app } from "./server-dist/index.mjs";

// Passenger (cPanel) binds here
if (typeof PhusionPassenger !== "undefined") {
    app.listen("passenger", () => {
        console.log("🔥 SMASH running via Passenger");
    });
}
