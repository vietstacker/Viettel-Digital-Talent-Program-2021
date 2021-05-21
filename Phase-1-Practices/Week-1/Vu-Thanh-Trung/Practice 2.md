# Practice 2: Deploy WordPress with Docker Compose

#### Step 1: Install Docker Compose

```console
$ sudo apt install docker-compose
```

#### Step 2: Download docker-compose.yml

```console
$ sudo apt install curl -sSL https://raw.githubusercontent.com/bitnami/bitnami-docker-wordpress/master/docker-compose.yml > docker-compose.yml
```

#### Step 3: Run docker-compose

```console
$ sudo docker-compose up -d
```

Access application at http://localhost:8080
![Practice 1 (2)](https://user-images.githubusercontent.com/48465162/117477967-d04c3380-af88-11eb-8266-0f2475244901.png)
