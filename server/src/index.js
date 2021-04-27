import app from "./config/app";
import server from "./config/apollo";

const port = process.env.PORT;

server.applyMiddleware({ app, cors: false }); // CORS is handled directly in the express middleware.

app.listen({ port }, () => {
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`);
});
