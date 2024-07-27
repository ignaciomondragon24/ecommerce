const handlebars = require("express-handlebars");
const paths = require("../utils/paths.js");

const config = (app) => {
    app.engine("handlebars", handlebars.engine({
        defaultLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        }}));

    app.set("view engine", "handlebars");
};

module.exports = config;