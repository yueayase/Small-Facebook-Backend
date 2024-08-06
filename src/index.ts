
import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import { Knex, knex } from "knex";
import { mountUserRouter } from "./routes/user";

export default class App {
  private app: Application;
  private PORT: number;
  private knexSql!: Knex;

  constructor(port: number) {
    this.app = express();
    this.PORT = port;
    this.initialDatabase();
    this.config();
    this.routerSetup();
  }

  private config(): void {
    const corsOptions: CorsOptions = {
      origin: "http://localhost:8081"
    };

    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

  }

  private initialDatabase(): void {
    // setup database config
    this.knexSql = knex({
      client: "mysql2",
      connection: {
        host: process.env.DATABASE_HOST || "127.0.0.1",
        port: Number(process.env.DATABASE_PORT) || 3306,
        user: process.env.DATABASE_USER || "user",
        password: process.env.DATABASE_PASSWORD || "testmyweb",
        database: process.env.DATABASE_DATABASE || "MyFacebookDatabase"
       }
    });


  }

  private routerSetup(): void {
    this.app.get("/", (req, res) =>{
      res.send("This is a backend server of my small Facebook Project");
    });

    this.app.use("/api", mountUserRouter(this.knexSql));
  }

  public listen(): void {
    this.app.listen(
      this.PORT, "localhost", () => {
        console.log(`Server is running on PORT ${this.PORT}`);
    }).on(
      "error", (err: any) => {
        if (err.code === "EADDRINUSE") {
            console.log("Error: address already in use");
        }
        else {
            console.log(err);
        } 
    });
  }
}