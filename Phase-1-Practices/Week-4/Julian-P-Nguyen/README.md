# WEEK-4 PRACTICE DOCUMENTATION

## PaaS - Platform as A Service with **`Kubernetes`** :cloud:

---

## **Author:** *Julian (Phong) Ng.* 

**Date of issue**: *May 25th 2021*

> Welcome back! The 4th training project in a row at **Viettel Network**! Enjoy ur time :smile_cat:. Feel free to hit me up if any edition is needed!

---

# TABLE OF CONTENTS

## [I. Overview](#I.-OVERVIEW)
  
  - ### [1. Kubernetes](#1.-Kubernetes)
  
  - ### [2. Minikube](#2.-Minikube)


## [II. Prerequisite](#II.-PREREQUISITE:)
  - ### [Knowledge](#Knowledge)

  - ### [Infrastructure](#Infrastructure)

## [III. Architecture](#III.-ARCHITECTURE)
  
  - ### [1. Minimum Viable Deployment](#Minimum-Viable-Deployment)
  - ### [2. Minikube Deployment](#Minikube-Deployment)

## [IV. Step-by-step Guide](#IV.-STEP-BY-STEP-GUILD)
  
  - ### [A. Minikube](#A.-Minikube)
  
  - ### [B. Deploying Wordpress & MariaDB with Persistent Volumes](#B.-Deploying-Wordpress-&-MariaDB-with-Persistent-Volumes)

  - ### [C. Accessing WordPress page](#C.-Accessing-WordPress-page)

## [V. Troubleshooting](#V.-TROUBLESHOOTING)

## [VI. References](#VI.-REFERENCES)


# **I. OVERVIEW:**

## **1. `KUBERNETES`**

### **:notebook_with_decorative_cover:	General Info:**

- **Purposes?** *An open-source system for **automating deployment**, **scaling**, and **orchestration of containerized applications**.*

- **Title `Kubernetes`** - Greek for *"helmsman"* or *"pilot"* :man_pilot:. 

- **Origin?** A `Graduated Project` from `Cloud Native Computing Foundation`. Initially developed by **Google** before donated to `CNCF` in 2014.

- **Core Characteristics**: `portable`, `extensible`, `open-source`.

- **Current Status** *large, rapidly growing ecosystem*. *Available with a range of services, support, and tools.*

- **Release Cycle**: *3-4 months*

<img src="./imgs/k8s-logo.png">


### :page_with_curl: **Terminologies:**

- **`Cluster`**:
	- Collection of `Nodes` combines together

- **`Node`**:
	- Hardware component -> can be either a `VM` or a `Physical machine`.

- **`Pod`**:
	- simplest unit within K8S cluster. 
	- contains one or more container(s).

- **`kubectl`**: CLI of `Kubernetes`


## **2. `MINIKUBE`**:
- **What is `Minikube`?** *A `Kubernetes` Deployment solution*.
- **How it works?** *runs an **all-in-one** Kubernetes cluster on local machine*.

<img src="./imgs/minikube-logo.png">


# **II. PREREQUISITE:**

## **:books: Knowledge:**
- Basics on **Linux**, **Networking**. *Sorry for keep repeating this one but these are cores of `Cloud Computing`* :wink:

- Basics on [**Kubernetes**](https://kubernetes.io/docs/home/).
	- Should know basic K8S's CLI `kubectl` commands.
	- Understand `Kubernetes Objects`.

- Basics on [**Docker**](https://docs.docker.com/).
	- Docker's Image & Container Management commands
	- Understand **`Containerization`**.
 

## **:computer: Infrastructure:** 

- **Desktop Hypervisor:** VMware Workstation (Other options: *Virtual Box, etc*) 

- **Operating System**: Ubuntu Server (**Ubuntu 20.04** in below practice: [Download Ubuntu Server](https://ubuntu.com/download/server)) 

- **Network**: 1 **NIC**

- **Hardware specifications**: **A Single Virtual Machine** with below configurations

| Specification(s) | Minimal | Personal Usage |
| ----------- | ----------- | ----------- |
|  CPU | 2 cores | 2 cores |
| RAM | 2 GB | 2 GB |
|  Storage | 20 GB | 20 GB |


# **III. ARCHITECTURE:**

## **:rocket: Architecture Philosophy**: `Master-slave architecture`

## **Main Components:**

<img src="./imgs/k8s-full-diagram.png">

### :guardsman: **Master Node**: *`Master`*

- Perform management & adminstrative tasks on `Cluser` - set of worker nodes.
- Components:
	- `etcd`: *key-value datastore*.
	- `kube-scheduler`: *making decisions for pod-related operations on cluster*
	- `kube-controller-manager`: *manages all of the controllers - which maintains the state/status of `Cluster`*.
	- `kube-apiserver`: *Exposed point of `Kubernetes` to outside. Acts as a gateway for `Cluster`, all interaction among components must go through*.


### **:construction_worker: Worker Node(s)**: *`Slave`*
- Where `Pods` are deployed. Perform most laborious tasks. 
- Components:
	- `kubelet`: *Receive commands from `master` node*.
	- `kube-proxy`: *Network agent. Handles request forwarding*


## **:one: Minimum Viable Deployment**:
- A sample `Kubernetes` Deployment with:
	- **1 Master Node (Control plane)**
	- **3 Worker Nodes**

<img src="./imgs/k8s-production.png">

## **:two: `Minikube` Deployment**: *For educational & developement purposes*

#### **`Minikube` Architecture**:

<img src="./imgs/minikube-architecture-diagram.png">

An model `Minikube` Deployment with:
	- **1 Master Node (Control plane)**
	- **1 Worker Nodes**: `2 running Pods`
		- `MariaDB Pod`
		- `WordPress Pod`
		
- Showing components of `K8S cluster`

````bash

$ kubectl get pods --namespace kube-system
````

<img src="./imgs/minikube-architecture-cli.png">


# **IV. STEP-BY-STEP GUIDE** 

#### **:construction: Directories Layout**

````bash
application/
│
│
│──secrets                          ----> Storing secrets
│   ├── secret-mariadb.yml
│   └── secret-wordpress.yml
│
│
│──mariadb                          ----> Deloyment file(s) for `Mariadb` 
│   	└── mariadb-deployment.yml
│
│
└──wordpress                        ----> Deloyment file(s) for `WordPress`
    └── wordpress-deployment.yml

````

## **A. `Minikube`:**

## **1. INSTALL & DEPLOY `Minikube`:**

- Update `apt`:

````bash
$ sudo apt-get update -y
````

- (*If not installed*) Install packages: `curl`, `apt-transport-https`, `docker.io`

````bash
$ sudo apt-get install curl apt-transport-https docker.io
````

- Install `VirtualBox` Hypervisor:
  - **`Yes`** to all `user prompts`.

````bash
$ sudo apt install virtualbox virtualbox-ext-pack
````

**Why another Hypervisor?** *To set up the single (host) node cluster with Minikube, which may includes inner VM(s) inside.*

<img src="./imgs/install-virtual-box.png">

- Install **`Minikube`**:
  - Download latest **`Minikube`** binary package:

  ````bash
  $ wget https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
  ````

  - Move downloaded package to `/usr/local/bin/minikube`
  
  ````bash
  $ sudo mv minikube-linux-amd64 /usr/local/bin/minikube
  ````

  - Add `execute` permission to directory
  
  ````bash
  $ sudo chmod 755 /usr/local/bin/minikube
  ```` 

  - Verify installed `Minikube` version
  
  ````bash
  $ minikube version
  ````

  <img src="./imgs/minikube-version.png">

- Install `kubectl` - CLI tool of `Kubernetes`:
  - Download `Kubectl` binary package with `wget`:

  ````bash
  $ curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
  ````

  - Add `Execute` permission to package:
  
  ````bash
  $ chmod +x ./kubectl
  ````

  - Move downloaded package to `/usr/local/bin/kubectl`

  ````bash
  $ sudo mv ./kubectl /usr/local/bin/kubectl
  ````

  - Verify installed `kubectl` version:
  
  ````bash
  $ kubectl version -o json
  ````

  <img src="./imgs/kubectl-installed.png">

## **2. Manage `Minikube`:**

- Add user `minikube` & Configure Permissions: 
  - Add new user `minikube`:

  ````bash
  $ sudo adduser minikube
  ````

  - Add User to `sudo` & `docker` group:

  ````bash
  $ sudo usermod -aG sudo minikube

  $ sudo usermod -aG docker minikube 

  $ newgrp docker
  ````

  - Change user on Linux machine:

  ````bash
  $ su minikube
  ````

- Start `Minukube`: **Must start `Minikube` before proceeding**

  ```bash
  $ minikube start --driver=docker
  ```

  <img src="./imgs/start-minikube-init.png">

- Management Commands `Minikube`:
  - Stop `Minukube`:
  
  ```bash
  $ minikube stop
  ``` 

  - Status `Minukube` Cluster:
  
  ```bash
  $ minikube status
  ``` 

  - SSH into `Minukube` VM:
  
  ```bash
  $ minikube ssh
  ``` 

  - Remove `Minukube` cluster:
  
  ```bash
  $ minikube delete
  ``` 

  - View installed `add-ons`/`plugins` on `Minukube` cluster:
  
  ```bash
  $ minikube addons list
  ``` 

## **B. DEPLOYING `WordPress` & `MariaDB` with `Persistent Volumes`**

## **Create & Manage `Kubernetes` Objects:**

### **1. `Secret`**:
 

- **Note**: *All `data` fields in `Secret` should be `base64` encoded*
  - **db_user**: pnguyen
  - **db_name**: wordpress_k8s
  - **db_password**: 12345678

- Encode to `base64`: *Repeat for data fields*

````bash
$ echo "<input>" | base64
````

- Create `secret-mariadb`:

```bash

$ vi secrets/secret-mariadb.yml

----
apiVersion: 1
kind: Secret
metadata:
  name: secret-mariadb
type: Opaque
data:
  db_user: cG5ndXllbgo=
  db_name: d29yZHByZXNzX2s4cw==
  db_password: MTIzNDU2Nzg=
```

- Create `secret-wordpress`:

```bash

$ vi secrets/secret-wordpress.yml

-----
apiVersion: 1
kind: Secret
metadata:
  name: secret-wordpress
type: Opaque
data:
  db_user: cG5ndXllbgo=
  db_name: d29yZHByZXNzX2s4cw==
  db_password: MTIzNDU2Nzg=
```

### **2. `Service`**:

#### **Note**: 

 - *With each container, `Service`, `Deployment`, `PersistentVolumeClaim` can stored within a single `yaml` file. This deployment includes 2 files:*
  - `mariadb-deployment.yml`
	- `wordpress-deployment.yml`


- `Service` for `mariadb`:
  - `Mariadb` is available **ONLY WITHIN CLUSTER**.

```bash

apiVersion: v1
kind: Service
metadata:
  name: wordpress-mariadb
  labels:
    app: wordpress-k8s
spec:
  ports:
    - port: 3306
  selector:
    app: wordpress-k8s
    tier: mariadb
  clusterIP: None

```


- `Service` for `wordpress`:
  - `Wordpress` is exposed **to outside via a LoadBalaner/High Port**.

```bash

apiVersion: v1
kind: Service
metadata:
  name: wordpress
  labels:
    app: wordpress-k8s
spec:
  ports:
    - port: 8080
  selector:
    app: wordpress-k8s
    tier: frontend
  type: LoadBalancer

```

### **3. `PersistentVolumeClaim`**:

- **Notes**: 

  - `PersistentVolumeClaim` == `Volume` for data storage. A `PersistentVolume` is dynamically provisioned as a `PersistentVolumeClaim` is created.

  - `PersistentVolumeClaim` & `PersistentVolume` are *independent* from `Pod lifecycles` & preserve data through Pods' operations.

  - `MariaDB` & `WordPress` all require a `PersistentVolume` each.


- `Volume` for `mariadb`:

```bash

apiVersion: v1
kind: PersistentVolumeClaim
metadata: 
  name: wordpress-mariadb-volume
  labels:
    app: wordpress-k8s
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
```

- `Volume` for `wordpress`:

```bash

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: wordpress-volume
  labels:
    app: wordpress
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
```

### **4. `Deployment`**:

- `Deployment` for `mariadb`:
```bash

apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress-mariadb
  labels:
    app: wordpress-k8s
spec:
  selector: 
    matchLabels:
      app: wordpress-k8s
      tier: mariadb
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: wordpress-k8s
        tier: mariadb
    spec:
      containers:
      - name: mariadb
        image: bitnami/mariadb:latest
        env:
        - name: ALLOW_EMPTY_PASSWORD
          value: yes
        - name: MARIADB_USER
          valueFrom:
            secretKeyRef:
              name: secret-mariadb
              key: db_user
        - name: MARIADB_DATABASE
          valueFrom:
            secretKeyRef:
              name: secret-mariadb
              key: db_name
        - name: MARIADB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: secret-mariadb
              key: db_password
        ports:
        - containerPort: 3306
        name: mariadb
        volumeMounts:
        - name: mariadb-volume
          mountPath: /var/lib/mariadb
      volumes:
      - name: mariadb-volume
        persistentVolumeClaim:
          claimName: wordpress-mariadb-volume
```

- `Deployment` for `wordpress`:

````bash

apiVersion: apps/v1
kind: Deployment
metadata:
  name: wordpress
  labels:
    app: wordpress-k8s
spec:
  selector:
    matchLabels:
      app: wordpress-k8s
      tier: frontend
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: wordpress-k8s
        tier: frontend
    spec:
      containers:
      - name: wordpress
        image: bitnami/wordpress:latest
        env:
          - name: ALLOW_EMPTY_PASSWORD
            value: yes
          - name: WORDPRESS_DATABASE_USER
            valueFrom:
              secretKeyRef:
                name: secret-wordpress
                key: db_user
          - name: WORDPRESS_DATABASE_NAME
            valueFrom:
              secretKeyRef:
                name: secret-wordpress
                key: db_name
          - name: WORDPRESS_DATABASE_PASSWORD
            valueFrom:
              secretKeyRef:
                name: secret-wordpress
                key: db_password
        ports:
        - containerPort: 80
          name: wordpress
        volumeMounts:
        - name: wordpress-storage
          mountPath: /var/www/html
      volumes:
      - name: wordpress-storage
        persistentVolumeClaim:
          claimName: wordpress-volume
````

### **DEPLOY APPLICATIONS WITH `Kubernetes`**:

- Create `mariadb` Secret object:

````bash
$ kubectl apply -f ./secret-mariadb.yml
````

<img src="./imgs/create-mariadb-secret.png">

- Create `wordpress` Secret object:

````bash
$ kubectl apply -f ./secret-wordpress.yml
````

<img src="./imgs/create-wordpress-secret.png">

- Verify added secrets existence:
````bash

$ kubectl get secrets
````

- Deploy `mariadb`:
````bash

$ kubectl apply -f ./mariadb-deployment.yml
````

<img src="./imgs/service-persistent-deployment-mariadb.png">


- Deploy `wordpress`:
````bash

$ kubectl apply -f ./wordpress-deployment.yml
````

<img src="./imgs/service-persistent-deploynent-wordpress.png">


- Check `Pod`(s):

````bash
$  kubectl get pods
````

<img src="./imgs/running-pods.png">

- Check `Service`:

````bash
$  kubectl get services (<Service-name>)
````

**Note**
> `EXTERNAL-IP` always `<Pending>` because `Minikube` exposes Services through `NodePort` only.


<img src="./imgs/services-list.png">


## **C. ACCESS `Wordpress` page:**
- Check IP of `wordpress`:

```bash
$ minikube service wordpress --url
```

<img src="./imgs/view-url-wordpress.png">


- Visit Landing page:

```bash
$ curl http://<CLUSTER-IP>:<High-PORT>
```

:heavy_check_mark: **Exptected outcome:**

<img src="./imgs/success-landing-page-curl.png">

# **V. TROUBLESHOOTING:**

## **`MUST-KNOW` DEBUG COMMANDS**

- Entering a `Container` in K8S with `bash`:

```bash
$ kubectl exec --stdin --tty <Pod-name> -- /bin/bash
```

- View logs:

```bash
$ kubectl logs <pod-name>
```

## 1. `Deployment in version "v1" cannot be handled as a Deployment...`

:x: Incorrect type formatting:

```bash
 env:
        - name: ALLOW_EMPTY_PASSWORD
          value: yes			#parsed as `Boolean`
```

:heavy_check_mark: Adding quotation marks: 

```bash
 env:
        - name: ALLOW_EMPTY_PASSWORD
          value: "yes"			#parsed as `string`
```

# **VI. :newspaper: REFERENCES**

- [**Official Documentation** `Kubernetes`](https://kubernetes.io/docs/)

- [**kubectl** `apply` or `create`](https://www.digitalocean.com/community/tutorials/imperative-vs-declarative-kubernetes-management-a-digitalocean-comic)

- [**Using Secrets in `K8S`**](https://kubernetes.io/docs/concepts/configuration/secret/#secret-types)

- [**Official Docs Example**](https://kubernetes.io/docs/tutorials/stateful-application/mysql-wordpress-persistent-volume/)

- [**Install Minikube on Ubuntu 20.04**](https://phoenixnap.com/kb/install-minikube-on-ubuntu)
