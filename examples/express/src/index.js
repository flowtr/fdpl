import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send({
    message: "Hello, world! This is an example api running in podman.",
  });
});

const port = parseInt(process.env.PORT ?? "3000");
app.listen(port, () => console.info(`Listening on :${port}`));
