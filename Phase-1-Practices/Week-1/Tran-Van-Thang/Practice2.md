# Pratice 2 - Using Docker Compose

##### Step 1: Install Docker Conpose

After Install Success, show version docker-compose
```console
$ docker-compose -v
```






##### Step 2: Download docker-compose.yml

```console
$ curl -sSL https://raw.githubusercontent.com/bitnami/bitnami-docker-wordpress/master/docker-compose.yml > docker-compose.yml
```
View docker-compose.yml
```console
$ cat docker-compose.yml
```
#### Step 3: Run 2 Images with docker-compose
Run
```console 
$ docker-compose up -d
```


# Result
Go to *http://localhost:80* or *https://localhost:443* to test
![image](https://user-images.githubusercontent.com/43313369/117469566-1650c980-af80-11eb-8064-aa5f79dfeade.png)

