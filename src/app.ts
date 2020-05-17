import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import { ContainerConfigLoader } from "./config/container";
import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import mongo from "connect-mongo";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import "./controllers/home.controller";
import "./controllers/products.controller";
import "./controllers/user.controller";
import { DbConnection } from "./util/connection";
import { CustomAuthProvider } from "./policies/customAuthProvider";
import { getRouteInfo } from "inversify-express-utils";
import * as prettyjson from "prettyjson";

const MongoStore = mongo(session);
const container = ContainerConfigLoader.Load();

// API keys and Passport configuration
//import * as passportConfig from "./config/passport";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(
    () => {
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
        DbConnection.setAutoReconnect();
        const router = express.Router({
            caseSensitive: false,
            mergeParams: false,
            strict: false
        });
        // start the server
        const server = new InversifyExpressServer(container, router, { rootPath: "/api/v1" }, null, CustomAuthProvider);
        server.setConfig((app) => {
            // Express configuration
            app.set("port", process.env.PORT || 3000);
            app.use(compression());
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(session({
                resave: true,
                saveUninitialized: true,
                secret: SESSION_SECRET,
                store: new MongoStore({
                    url: mongoUrl,
                    autoReconnect: true
                })  
            }));
            app.use(passport.initialize());
            app.use(passport.session());
            app.use(lusca.xframe("SAMEORIGIN"));
            app.use(lusca.xssProtection(true));
            app.use((req, res, next) => {
                res.locals.user = req.user;
                next();
            });

            app.use(
                express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
            );

        });

        const serverInstance = server.build();
        serverInstance.listen(process.env.PORT);
        const routeInfo = getRouteInfo(container);

        console.log(prettyjson.render({ routes: routeInfo }));

        console.log(`Server started on port ${process.env.PORT} :)`);
    },
).catch(err => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    //process.exit();
});

export default app;
