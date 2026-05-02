import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env.local"), quiet: true });

if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in temp_for_mongo_connection/.env.local");
}

const options = {
  serverSelectionTimeoutMS: 10000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI, options);
    globalThis._mongoClientPromise = client.connect();
  }

  clientPromise = globalThis._mongoClientPromise;
} else {
  const client = new MongoClient(process.env.MONGODB_URI, options);
  clientPromise = client.connect();
}

export default clientPromise;
