import experss from "express";
import morgan from "morgan";
import cors from "cors";
import { makemongoConnection } from "./src/mongodb/mongodb.js";
import aircraftsRoutes from "./src/routes/aircrafts.routes.js"
import aircraftsTypesRoutes from "./src/routes/aircraftsTypes.routes.js"

const app = experss();
const PORT = process.env.PORT || 3000;

app.use(morgan("tiny"));

app.use(experss.json());

app.use(experss.urlencoded({ extended: true }));

app.use(cors());

await makemongoConnection();

app.use("/api/aircrafts", aircraftsRoutes);

app.use("/api/aircraftstypes", aircraftsTypesRoutes);

app.get("/", async (request, response) => {
    response.json({
        message: "Welcome to Flighter Aircraft Management API",
        version: "1.0.0",
    });
});

app.listen(PORT, async () => {
    console.log(`listening on port ${PORT}...`);
});