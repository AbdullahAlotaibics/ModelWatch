import clientPromise from "./lib/mongodb.js";

function withTimeout(promise, ms) {
  let timeoutId;

  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new Error(
          `MongoDB connection timed out after ${ms / 1000}s. If you use a mongodb+srv URI, check DNS/network access and Atlas IP access list settings.`,
        ),
      );
    }, ms);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

async function test() {
  const client = await withTimeout(clientPromise, 15000);

  try {
    const db = client.db("modelwatch");

    await db.command({ ping: 1 });
    console.log("Connected to MongoDB");
  } finally {
    await client.close();
  }
}

test().catch((error) => {
  console.error(error);
  process.exit(1);
});
