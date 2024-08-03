
import express, { Application } from "express";
import cors, { CorsOptions } from "cors";

export default class App {
  private app: express.Application;
  private PORT: number;

  constructor(port: number) {
    this.app = express();
    this.PORT = port;
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

  private routerSetup(): void {
    this.app.get("/", (req, res) =>{
      res.send("This is a backend server of my small Facebook Project");
    });
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