Reference Setup: 
1. https://wayne-blog.com/2023-02-21/ts-express-server/
2. https://ithelp.ithome.com.tw/m/articles/10239787
3. https://www.bezkoder.com/express-typescript-example/

Here, I only change the following:
In tsconfig.json:
"outDir": "./dist"
In package.json:
"main": "app.ts"
"scripts": {
    "start": "nodemon app.ts",
    "build": "tsc --project ./",
    "test": "echo \"Error: no test specified\" && exit 1"
}

"devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^22.1.0",
    "nodemon": "^3.1.4",
    "ts-node": "^10.9.2",
    "typescript": "^5.5.4"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  }

.gitignore sample: https://github.com/github/gitignore/blob/main/Node.gitignore 