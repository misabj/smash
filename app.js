import { register } from "node:module";
register("tsx/esm", import.meta.url);

const { default: app } = await import("./server/index.ts");

// Passenger binds to this — do NOT remove
if (typeof PhusionPassenger !== "undefined") {
    app.listen("passenger", () => {
        console.log("🔥 SMASH running via Passenger");
    });
}
