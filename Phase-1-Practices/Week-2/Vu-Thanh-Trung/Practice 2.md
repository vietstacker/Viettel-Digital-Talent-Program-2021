# Practice 2: Deploy MariaDB and Wordpress on two VMs using Ansible

In this practice, I'll use `[vm1]` as Controller machine and for deploying MariaDB, `[vm2]` for deploying Wordpress

#### Step 1: Setup Docker on two VMs

Create `install-docker-playbook.yaml` file and run `ansible-playbook`
```console
- name: install docker
  hosts: vm1, vm2
  gather_facts: false

  tasks:
  - name: install docker.io
    become: yes
    apt:
     name: docker.io
     state: present
  - name: ensure docker service is running
    become: yes
    service:
     name: docker
     state: started
```
![Practice 2 (1)](https://user-images.githubusercontent.com/48465162/118135149-dfb9f980-b42c-11eb-9500-73e53edb27d1.png)

#### Step 2: Deploy MariaDB on VM1

Create `deploy-mariadb-playbook.yaml` file and run `ansible-playbook`
```console
- name: deploy mariadb on vm1
  hosts: vm1
  gather_facts: false

  tasks:
  - name: create network
    become: yes
    command: docker network create wordpress-network
  - name: create volume
    become: yes
    command: docker volume create --name mariadb_data
  - name: run mariadb
    become: yes
    command: docker run -d --name mariadb -p 3306:3306 --env ALLOW_EMPTY_PASSWORD=yes --env MARIADB_USER=bn_wordpress --env MARIADB_PASSWORD=bitnami --env MARIADB_DATABASE=bitnami_wordpress --network wordpress-network --volume mariadb_data:/bitnami/mariadb bitnami/mariadb:latest
```
![Practice 2 (2)](https://user-images.githubusercontent.com/48465162/118135614-6ff83e80-b42d-11eb-8be6-7e1bcf5a5000.png)

#### Step 3: Deploy Wordpress on VM2

Create `deploy-wordpress-playbook.yaml` file and run `ansible-playbook`
```console
- name: deploy wordpress on vm2
  hosts: vm2
  gather_facts: false

  tasks:
  - name: create network
    become: yes
    command: docker network create wordpress-network
  - name: create volume
    become: yes
    command: docker volume create --name wordpress_data
  - name: run wordpresstrung
    become: yes
    command: docker run -d --name wordpress -p 8080:8080 -p 8443:8443 --add-host mariadb:192.168.1.84 --env MARIADB_PORT_NUMBER=3306 --env ALLOW_EMPTY_PASSWORD=yes --env WORDPRESS_DATABASE_USER=bn_wordpress --env WORDPRESS_DATABASE_PASSWORD=bitnami --env WORDPRESS_DATABASE_NAME=bitnami_wordpress --network wordpress-network --volume wordpress_data:/bitnami/wordpress bitnami/wordpress:latest
```
![Practice 2 (3)](https://user-images.githubusercontent.com/48465162/118140096-40980080-b432-11eb-9a47-dcc2b3f94d0f.png)

#### Step 4: On VM2 access application at http://localhost:8443
![Practice 2 (4)](https://user-images.githubusercontent.com/48465162/118140380-83f26f00-b432-11eb-8179-70e3da451fe5.png)
