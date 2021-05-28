# Kubernetes

## Prepare

1. Install curl

```
sudo apt install curl
```

2. Install kubectl

* Download the latest release

```
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```

* Install kubectl

```
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

3. Install minikube

* Dowload latest release

```
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
```

* Install minikube

```
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

4. Start a cluster using docker driver

```
minikube start --driver=docker
```

5. Check kubectl version

```
kubectl version
```

![image](https://user-images.githubusercontent.com/83031380/120016397-c14c2480-c00e-11eb-9a19-b46af5a5c41d.png)

## Deploy wordpress

 I try to use yaml file to deploy but it didn't work. So I uesd helm chart

 * Install snapd

 ```
 sudo apt install snapd
 ```

 * Install helm

 ``` 
 sudo snap install helm --classic
 ``` 

 * minikube start

 ```
 minikube start
 ```

 ![image](https://user-images.githubusercontent.com/83031380/120019358-8f3cc180-c012-11eb-81c2-e136109008fb.png)

* add Bitnami repository:

```
helm repo add bitnami https://charts.bitnami.com/bitnami
```

* list repository:

```
helm repo list
```

![image](https://user-images.githubusercontent.com/83031380/120020377-ceb7dd80-c013-11eb-968b-f3876a732674.png)

* deploy wordpress

```
helm install my-release \
  --set wordpressUsername=admin \
  --set wordpressPassword=password \
  --set mariadb.auth.rootPassword=secretpassword \
    bitnami/wordpress
```

* List all pods in the namespace

```
kubectl get pods 
```

![image](https://user-images.githubusercontent.com/83031380/120020922-9664cf00-c014-11eb-8447-c25204cce37e.png)

* List all services in the namespace

```
kubectl get svc
```
![image](https://user-images.githubusercontent.com/83031380/120022218-4dae1580-c016-11eb-8137-f83defe5fea7.png)

* List deployment

```
kubectl get deployment
```
![image](https://user-images.githubusercontent.com/83031380/120022390-8c43d000-c016-11eb-83d7-4c1cd9d8514e.png)

* get url of wordpress 

```
minikube service my-release-wordpress
```

![image](https://user-images.githubusercontent.com/83031380/120024643-b5b22b00-c019-11eb-80bc-cfa560f9852c.png)

![image](https://user-images.githubusercontent.com/83031380/120024828-f611a900-c019-11eb-8e72-f1067edf9274.png)

## References

<https://kubernetes.io/docs/reference/kubectl/cheatsheet/>

<https://www.bogotobogo.com/DevOps/Docker/Docker_Helm_Chart_WordPress_MariaDB_Minikube_with_Ingress.php>

<https://kubernetes.io/docs/tasks/tools/>
