import express from "express";
import cors from 'cors';
import { exec } from "child_process";
import path from 'path';

import DBMS from "./dbms.js";

const db = new DBMS();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  const filepath = path.join(path.resolve(), "index.html");
  res.sendFile(filepath);
});

app.get("/js", (req, res) => {
  const filepath = path.join(path.resolve(), "script.js");
  res.sendFile(filepath);
});

app.get("/css", (req, res) => {
  const filepath = path.join(path.resolve(), "style.css");
  res.sendFile(filepath);
});

app.post("/run", async (req, res) => {
  const body = req.body;
  const text = JSON.parse(body.code);
  const lang = body.lang;
  const id = body.id;

  switch (lang) {

    case "c":
      const obj = {
        error: [" "],
        stdout: [" "],
        stderr: [" "],
      };

      if (!db.hasFolder({ folderName: lang })) {
        db.createFolder({
          folderName: lang,
        });
      }

      db.storeFile({
        folderName: lang,
        fileName: "id_" + id + "." + lang,
        content: text,
      });

      try {
        exec(`gcc filebase/${lang}/id_${id}.${lang} -o filebase/${lang}/id_${id}`, (error, stdout, stderr) => {
          obj.error.unshift(error);
          obj.stdout.unshift(stdout);
          obj.stderr.unshift(stderr);

          if (error) {
            res.send(obj);
            return;
          } else {
            exec(`./filebase/${lang}/id_${id}`, (error, stdout, stderr) => {
              obj.error.unshift(error);
              obj.stdout.unshift(stdout);
              obj.stderr.unshift(stderr);
              res.send(obj)
              return;
            })
          }
        });

      } catch (e) {
        obj.error.unshift(e);
        res.send(obj);
        return;
      }
      break;
  }
});

app.post("/get", async (req, res) => {
  const body = req.body;
  const id = body.id;
  const lang = body.lang;

  const content = db.readFile({
    folderName: lang,
    fileName: "id_" + id + "." + lang
  })
  const data = content ? content : "";
  res.send({
    content: data
  });
});

app.listen(port, () => {
  console.log(`Server is listening at port: ${port} [✓]`);
});