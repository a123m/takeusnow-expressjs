const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

// var routers = require("./routers");

const options = {
  swaggerDefinition: {
    info: {
      title: "TakeUsNow Api's",
      version: "1.0.0",
      description: "Test TakeUsNow all API",
    },
    basepath: "/localhost:8080",
    securityDefinitions: {
      tokenauth: {
        type: "apiKey",
        name: "x-access-token",
        in: "header",
      },

      //   basicauth: {
      //     type: "basic",
      //   },
    },
    servers: [
      {
        url: "http://localhost:3000/",
        description: "Local server",
      },
    ],
  },
  apis: ["./routers/auth.js"],
};

const specs = swaggerJsDoc(options);
module.exports = (app) => {
  app.use(
    "/api",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar {display:none}",
    })
  );
  //   app.use("api/v1", routers);
  app.use(function (err, req, res) {
    if (err.isBoom) {
      return res.status(err.output.statusCode).json(err.output.payload);
    }
  });
};
