### Practice 2: Using Ansible deploy MariaDB in VM1 , Wordpress in VM2
#### Step 1: Prepare
- In this practice lab `inventory.ini` and `ansible.cfg` file haven't change anything. Strucure and config like Practice 1
- Install docker in VM1 and VM2. You can modify the `install-docker-playbook.yaml` by adding `vm2` in hosts and remove task install docker-compose:
```
- name: install docker
  hosts: vm1,vm2
  gather_facts: false

  tasks:
  - name: ping
    ping:
    register: result
  - name: install-docker
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

#### Step 2: Setup and run MariaDB container in VM1
- Create `deploy-mariadb-playbook.yaml` file and add below code:
```
- name: deploy mariadb
  hosts: vm1
  gather_facts: false

  tasks:
  - name: create volume for db
    become: yes
    command: docker volume create --name mariadb_data
  - name: deploy mariadb
    become: yes
    command: docker run -d --name mariadb --env ALLOW_EMPTY_PASSWORD=yes --env MARIADB_USER=bn_wordpress --env MARIADB_PASSWORD=bitnami --env MARIADB_DATABASE=bitnami_wordpress --network host --volume mariadb_data:/bitnami/mariadb  bitnami/mariadb:latest   
    register: result2
  - name: setup data
    debug:
     var: result2
  - name: ensure docker-compose container is running
    become: yes
    docker_container_info:
     name: my_container
    register: result
  - name: checking result
    debug:
     var: result
```

- Running this file to create and run MariaDB container:
> $ ansible-playbook -i inventory.ini deploy-mariadb-playbook.yaml -k -K

Expect result:
![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Ansible/pic/practice2-deploy-db.png?raw=true)

**You can check the MariaDB container in VM1**
![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Ansible/pic/check%20container1.png?raw=true)

#### Step 3: Setup and run Wordpress container in VM2
- Create `deploy-wordpress-playbook.yaml` file and add below code:
```
- name: deploy wordpress
  hosts: vm2
  gather_facts: false

  tasks:
  - name: create wordpress volume
    become: yes
    command: docker volume create --name wordpress_data
  - name: deploy wordpress container
    become: yes
    command: docker run -d --name wordpress -p 8080:8080 -p 8443:8443 --env ALLOW_EMPTY_PASSWORD=yes --env WORDPRESS_DATABASE_USER=bn_wordpress --env WORDPRESS_DATABASE_PASSWORD=bitnami --env WORDPRESS_DATABASE_NAME=bitnami_wordpress --network host --add-host mariadb:192.168.159.130 --volume wordpress_data:/bitnami/wordpress bitnami/wordpress:latest
    register: result
  - name: setup result
    debug:
      var: result

  - name: ensure docker-compose container is running
    become: yes
    docker_container_info:
      name: my_container
    register: result2
  - name: checking result
    debug:
      var: result2
```
- Running this file to create and run MariaDB container:
> $ ansible-playbook -i inventory.ini deploy-wordpress-playbook.yaml -k -K

Expect result:
![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Ansible/pic/practice2-deploy-wp.png?raw=true)

**You can check the Wordpress containner is running in VM2**
![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Ansible/pic/check%20container2.png?raw=true)

And Finally your web app is running:

![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Ansible/pic/result2.png?raw=true)
