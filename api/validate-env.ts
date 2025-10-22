// Import with explicit extension so the emitted JS uses './env.js' and Node ESM resolves it.
import "./env.js";

// If import succeeds, env was validated; exit 0.
console.log("Environment variables validated");
