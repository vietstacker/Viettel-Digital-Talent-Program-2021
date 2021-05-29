# Practice: Deploy Wordpress + MariaDB on Kubernetes using Minikube

## Table of Contents

- [I. About Kubernetes](#I-About-Kubernetes)

- [II. Practice](#II-Practice)

  - [1. Minikube & kubectl](#1-Minikube-&-kubectl)

  - [2. Deploy Wordpress using Helm](#2-Deploy-Wordpress-using-Helm)

## I. About Kubernetes

- [What is Kubernetes?](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/)

- [Install and Set Up kubectl on Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

- [Kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

## II. Practice

**Note:** Here we have 2 ways to deploy Wordpress. You can choose either

- Writing `.yaml` file

or

- Using [Helm](https://helm.sh/)

Using *Helm Charts* should be slightly easier since "Charts are easy to create, version, share, and publish - so start using Helm and stop the copy-and-paste".

### 1. Minikube & kubectl

- Install required packages

```console
sudo apt update
sudo apt install curl
sudo apt install docker.io
```

- Install `minikube`

```console
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

- Install `kubectl`

```console
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

- Add user to the 'docker' group

```console
sudo user mod -aG docker $USER && newgrp docker
```

### 2. Deploy Wordpress using `Helm`

- [Instruction link](https://www.bogotobogo.com/DevOps/Docker/Docker_Helm_Chart_WordPress_MariaDB_Minikube_with_Ingress.php)

- Install `helm`

```console
sudo snap install helm --classic
```

- minikube start

```console
minikube start --driver=docker
```

![Kubernetes (1) minikube-start](https://user-images.githubusercontent.com/48465162/120060269-0a3cc100-c081-11eb-8367-3a7c243333e1.png)

- Add Bitnami repo:

```console
helm repo add bitnami https://charts.bitnami.com/bitnami
```

- Check repo list:

``` console
helm repo list
```

- Install and deploy wordpress

```console
helm install my-release \
  --set wordpressUsername=admin \
  --set wordpressPassword=password \
  --set mariadb.auth.rootPassword=secretpassword \
    bitnami/wordpress
```

![Kubernetes (2) install-release](https://user-images.githubusercontent.com/48465162/120060273-0f9a0b80-c081-11eb-98ae-c436622547ef.png)

- (Optional) Check pods, svc, deployment, pv, pvc, secrets,...

```console
kubectl get pods
kubectl get svc
kubectl get deployment
kubectl get pv
kubectl get pvc
kubectl get secrets
helm list
```

- Get deployment url

```console
minikube service my-release-wordpress --url
```

![Kubernetes (3) get-url](https://user-images.githubusercontent.com/48465162/120060289-19237380-c081-11eb-94ff-f14b0e5fe9c9.png)

- Access the result link

![Kubernetes (4) result](https://user-images.githubusercontent.com/48465162/120060291-1c1e6400-c081-11eb-894a-d8a09eff3615.png)