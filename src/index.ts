import { createServer } from "./server";

const startServer = async () => {
  const server = await createServer();
  const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`Server is running at port ${port}`);
  });
};

startServer();
