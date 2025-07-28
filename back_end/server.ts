// server.ts
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import elevesRoutes from "./routes/eleves";
import authRoutes from "./routes/auth";
import adminsRoutes from "./routes/admins";
import modulesRoutes from "./routes/modules";
import fournituresRoutes from "./routes/fournitures";
import recusRoutes from "./routes/recus";
import filieresRoutes from "./routes/filieres";
import statsRoutes from "./routes/stats";
import eleveFournitureRoutes from "./routes/eleveFourniture";
import eleveModuleRoutes from "./routes/eleveModule";
import importExportRoutes from "./routes/exportmport"
import cors from "cors";
import { verifyToken } from "./routes/auth/service";


export const app = express();

app.use(cors());
app.use(express.json());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "API express du backend",
            version: "1.0.0",
            description: "Express.js API développée avec TypeScript et Swagger",
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT Bearer Token for authentication'
                }
            }
        },
        security: [{ BearerAuth: [] }],
    },
    apis: ["back_end/docs/**/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/auth", authRoutes);

app.use("/eleves", verifyToken, elevesRoutes);
app.use("/admins", verifyToken, adminsRoutes);
app.use("/stats", verifyToken, statsRoutes);
app.use("/modules", verifyToken, modulesRoutes);
app.use("/fournitures", verifyToken, fournituresRoutes);
app.use("/recus", verifyToken, recusRoutes);
app.use("/filieres", verifyToken, filieresRoutes);
app.use("/eleve-fournitures", verifyToken, eleveFournitureRoutes);
app.use("/eleve-modules", verifyToken, eleveModuleRoutes);
app.use("/export-import", verifyToken, importExportRoutes);


/*
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
*/
