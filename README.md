# ECE-458

Senior design course project!

## Getting Started

### Running the frontend

Compiles frontend content to be served. Package manager will hang and `Ctrl-C` can be used.

```
npm install
npm run dev
```

### Running the Stack
#### First Time Installation
```
./scripts/start_django.sh
python3 manage.py makemigrations
python3 manage.py migrate
```

```
python3 manage.py runserver
```

### Testing

## Endpoints

To hit the `/school/create` endpoint, try:

```
curl -H "Content-Type: application/json" -d '{"name":"Duke University","address":"Durham"}' http://localhost:3001/school/create
```

To authenticate, try the following:

```
curl -H "Content-Type: application/json" -d '{"username":"<USERNAME>","password":"<PASSWORD>"}' http://localhost:3001/signup
curl --cookie-jar jarfile -H "Content-Type: application/json" -d '{"username":"<USERNAME>","password":"<PASSWORD>"}' http://localhost:3001/log-in
curl --cookie jarfile http://localhost:3001/current-user
```

## Troubleshooting

- `npm install -g nodemon` may be necessary (installing Nodemon globally) to ensure that the command to start the server
  works. If this doesn't work, the `node` can be used instead for starting the server.
- Make sure to run `npm install` in both directories.
- Make sure to create a `config.env` file for future use inside the `server` folder. We'll probably add credentials into
  the file.
- `npx prettier --write .` will format everything in a folder for you, but VSCode also has a great extension to do this
  automatically.
