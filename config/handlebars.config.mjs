import handlebars from "express-handlebars";
//import paths from "../utils/paths.mjs";
import paths from "../utils/paths.mjs";

const config = (app) => {
    app.engine("handlebars", handlebars.engine({
        defaultLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        }}));

    app.set("view engine", "handlebars");
};

export default config;
 