const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const AdminJSMongoose = require("@adminjs/mongoose");
const mongoose = require("mongoose");
const User = require("./models/User");
const Exercise = require("./models/Exercise");

// Connect AdminJS to Mongoose
AdminJS.registerAdapter(AdminJSMongoose);

// AdminJS Configuration
const adminJs = new AdminJS({
  databases: [mongoose],
  rootPath: "/admin",
  resources: [
    {
      resource: User,
      options: {
        properties: {
          password: { isVisible: false }, // Hide passwords from the admin view
        },
        listProperties: ["name", "email", "role", "createdAt"], // Columns in the list view
      },
    },
    {
      resource: Exercise,
      options: {
        listProperties: ["title", "bodyPart", "createdAt"],
      },
    },
  ],
});

module.exports = adminJs;
