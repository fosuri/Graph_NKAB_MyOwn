const graphql = require("graphql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
} = graphql;
const UserType = require("./TypeDefs/userType");
const User = require("../models/user");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    Users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.findAll();
      },
    },
    profile: {
      type: UserType,
      resolve(parent, args, context) {
        if (!context.userId) {
          throw new Error("Unauthorized! Please log in.");
        }

        return User.findByPk(context.userId);
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return User.create({
          username: args.username,
          email: args.email,
          password: args.password,
        }).catch((err) => {
          if (err.name === "SequelizeUniqueConstraintError") {
            throw new Error(
              "This email is already taken. Please choose a different email."
            );
          } else {
            throw new Error(
              "An error occurred while creating the user! " + err
            );
          }
        });
      },
    },
    loginUser: {
      type: GraphQLString,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        return User.findOne({
          where: {
            email: args.email,
          },
        })
          .then(async (user) => {
            if (!user) {
              throw new Error("User not found!");
            }

            const isMatch = await bcrypt.compare(args.password, user.password);
            if (!isMatch) {
              throw new Error("Incorrect password!");
            }

            const token = jwt.sign(
              { userId: user.id },
              process.env.SECRET_WORD,
              {
                expiresIn: "1h",
              }
            );
            return token;
          })
          .catch((err) => {
            throw new Error(err);
          });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
