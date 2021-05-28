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


