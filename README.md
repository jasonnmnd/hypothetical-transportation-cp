# ECE-458

Senior design course project!

## Getting Started

### Deployment

Using github actions, a developmental server is automatically deployed upon pushes to the branch `dev`, and a production server is automatically deployed upon pushes to `main`.

The hosts for these servers are as listed:
#### PRODUCTION
`https://hypothetical-transportation.colab.duke.edu:8000`

#### DEV
`https://ht-dev.colab.duke.edu:8000`

#### TEST ENV (must be deployed manually)
`https://ht-test.colab.duke.edu:8000`

### Creating a new server
#### Reserve a VCM/obtain a host

```
echo '...ssh into your host...'
echo '...get the repo on there in some way (aka make a ssh key and clone repo)...'
cd scripts
echo '...validate that the domains are correct in install_vcm for the creation of certs'
cat install_vcm.sh
./install_vcm.sh
```

### Running the frontend

Compiles frontend content to be served. Package manager will hang and `Ctrl-C` can be used.

```
npm install
npm run dev
```

To compile for production, run: 
```
npm run build
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
### Authentication Endpoints
```
curl -X GET --header "Authorization: Token <TOKEN>" http://localhost:8000/api/auth/user
```

## Troubleshooting

- `npm install -g nodemon` may be necessary (installing Nodemon globally) to ensure that the command to start the server
  works. If this doesn't work, the `node` can be used instead for starting the server.
- Make sure to run `npm install` in both directories.
- Make sure to create a `config.env` file for future use inside the `server` folder. We'll probably add credentials into
  the file.
- `npx prettier --write .` will format everything in a folder for you, but VSCode also has a great extension to do this
  automatically.
