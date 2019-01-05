const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const graphqlHttp = require('express-graphql');
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
	schema: graphQlSchema,
	rootValue: graphQlResolvers,
	graphiql: true
}));

const PORT = process.env.PORT || 3001;

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-hispr.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, { useNewUrlParser: true })
	.then(() => {
		app.listen(PORT, () => console.log('app listening on port', PORT));
	})
	.catch(err => {
		console.log(err);
		throw err;
	})

