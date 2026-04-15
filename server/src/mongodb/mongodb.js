import { MongoClient } from "mongodb";

let mongoconnection;

export const makemongoConnection = async () => {
    if (mongoconnection) return mongoconnection;
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not exist in .env file");
        };
        mongoconnection = new MongoClient(process.env.MONGO_URI);
        await mongoconnection.connect();
        console.log("Connection is established successfully ;)");
        return mongoconnection;
    } catch (error) {
        mongoconnection = null;
        console.error(error.message);
        throw error;
    };
};

export const getdb = async () => {
    if (!mongoconnection) await makemongoConnection();
    if (!mongoconnection) throw new Error("Database connection is not established. Check your MongoDB URI.")
    return mongoconnection?.db(process.env.DB_NAME);
};

export const closeConnection = async () => {
    if (!mongoconnection) return;
    await mongoconnection.close();
    mongoconnection = null;
    console.log("MongoDB connection closed safely, bye bye ;)")
};

export const db = await getdb(process.env.DB_NAME);
export const aircraftsCollection = db?.collection("aircrafts");
export const aircraftsTypesCollection = db?.collection("aircraftsTypes");
export const flightCollection = db?.collection("flights");