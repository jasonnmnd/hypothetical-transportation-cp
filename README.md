# ECE-458

Senior design course project!

## Getting Started

Inside the `server` directory:

```
nodemon server.js
```

In a separate terminal, inside the `client` directory:

```
npm start
```

For the database, follow the instructions on the MongoDB website.  Afterwards,
```
brew services start mongodb-community@5.0
```
The corresponding shutdown instruction is `stop`.

## Endpoints
To hit the `/school/create` endpoint, try:
```
curl -H "Content-Type: application/json" -d '{"name":"Duke University","address":"Durham"}' http://localhost:3001/school/create
```

## Troubleshooting

- `npm install -g nodemon` may be necessary (installing Nodemon globally) to ensure that the command to start the server
  works.
- Make sure to run `npm install` in both directories.
- Make sure to create a `config.env` file for future use inside the `server` folder. We'll probably add credentials into
  the file.
- `npx prettier --write .` will format everything in a folder for you, but VSCode also has a great extension to do this
  automatically.
