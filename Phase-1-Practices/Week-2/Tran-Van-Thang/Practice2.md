# Pratice 2 - Run with Two Machine

> MariaDb will run in group ``` db ``` has ip 192.168.5.10 

> WordPress will run in group ``` web ``` has ip 192.168.5.11 and 192.168.5.12

> Inventory file defined username/password ```remote_user``` and ```become_user ```
##### Step 1: Install Docker for all machine

Install Docker and check version docker after install
```console
---
- name: test playbook
  hosts: web,db
  gather_facts: false

  tasks:
  - name: install docker
    become: yes
    apt:
     name: docker.io
     state: present
  - name: check install docker
    become: yes
    service:
     name: docker
     state: started
  - name: check docker version
    command: docker -v
    register: versionDocker
  - name: print docker -v data
    debug:
     var: versionDocker 
```

##### Step 2: Install MariaDb on group ```db ```
Create volume and run image MariaDb with netwok ``` host ``` 
```console
---
- name: Install MariaDb
  hosts: db
  gather_facts: false

  tasks:
  - name: create volume for db
    become: yes
    command: docker volume create --name mariadb_data
    register: debugCreateVolume
  - name: print log run mariadb
    debug:
     var: debugCreateVolume
  - name:  run image mariadb
    become: yes
    command: docker run -d --name mariadb --env ALLOW_EMPTY_PASSWORD=yes --env MARIADB_USER=bn_wordpress --env MARIADB_PASSWORD=bitnami --env MARIADB_DATABASE=bitnami_wordpress --network host --volume mariadb_data:/bitnami/mariadb bitnami/mariadb:latest    
    register: debugRunMariadb
  - name: print log run mariadb
    debug:
     var: debugRunMariadb
```

#### Step 3: Install WordPress on group ``` web ```
Create volume and run image WordPress with netwok ``` host ```, add environment WORDPRESS_DATABASE_HOST=192.168.5.10 (``` 192.168.5.10 ``` is IpAdress MariaDB)
```console 
---
- name: Install WordPress
  hosts: web
  gather_facts: false

  tasks:
  - name: create volume for web
    become: yes
    command: docker volume create --name wordpress_data
    register: debugCreateVolume
  - name: print log create volume web
    debug:
     var: debugCreateVolume
  - name:  run image wordpress
    become: yes
    command:   docker run -d --name wordpress   --env WORDPRESS_DATABASE_HOST=192.168.5.10  --env ALLOW_EMPTY_PASSWORD=yes   --env WORDPRESS_DATABASE_USER=bn_wordpress   --env WORDPRESS_DATABASE_PASSWORD=bitnami   --env WORDPRESS_DATABASE_NAME=bitnami_wordpress   --network host   --volume wordpress_data:/bitnami/wordpress   bitnami/wordpress:latest   
    register: debugRunWp
  - name: print log run web
    debug:
     var: debugRunWp
```

#### Step 4: Check all running containers
Run ``` docker ps ``` all machine
```console
---
- name: test playbook
  hosts: web,db
  gather_facts: false

  tasks:
  - name: ping
    become: yes
    command: docker ps 
    register: result
  - name: print docker ps  data
    debug:
     var: result
```
Everything work fine!
![image](https://user-images.githubusercontent.com/43313369/117579687-38804e00-b11e-11eb-9174-b7162b18f39a.png)

# Result
Go to *http://localhost:8080* or *https://localhost:8443* to test
![image](https://user-images.githubusercontent.com/43313369/117579813-d1af6480-b11e-11eb-9781-cb6d1dac4515.png)


