# WEEK 2: ANSIBLE PRACTICE

## Practice 1: Setup Ansible and deploy Wordpress (docker) on Ubuntu VM

### Step 1: Install Ansible on Ubuntu

- Install Ansible

```
  $ sudo apt update

  $ sudo apt install software-properties-common

  $ sudo apt-add-repository --yes --update ppa:ansible/ansible

  $ sudo apt install ansible
```

- Check if install successful


> $ ansible --version

![1_5.png](https://github.com/dobuithanhnam/VDT2021/blob/main/Week2/pic/1_5.png)

### Step 2: Create your own file 

- Create your `inventory.ini` file:

```
[vm1]
192.168.1.104

[vm2]
192.168.1.105

[vm1:vars]
ansible_user=donam2539
ansible_ssh_pass=123456

[vm2:vars]
ansible_user=namdo2539
ansible_ssh_pass=123456
```

- Create your `ansible.cfg` file:

```
[defaults]
host_key_checking = False
inventory = /home/donam2539/ansible-test/inventory.ini
remote_user = donam2539
```

- Create your `ping-playbook.yaml` file:

```
- name: test playbook
  hosts: vm1, vm2
  remote_user: donam2539
  gather_facts: false

  tasks:
  - name: ping
    ping:
    register: result
  - name: print ping data
    debug:
      var: result
```

- Create your `install-docker-playbook.yaml` file:

```
- name: install docker
  hosts: vm1
  remote_user: donam2539
  gather_facts: false

  tasks:
  - name: ping
    ping:
    register: result
  - name: Install docker.io
    become: yes
    apt:
      name: docker.io
      state: present
  - name: Install docker-compose
    become: yes
    apt:
      name: docker-compose
      state: present
  - name: Ensure docker service is running
    become: yes
    service:
      name: docker
      state: started
```

- Create your `deploy-wordpress-playbook.yaml` file:

```
- name: deploy wordpress
  hosts: vm1
  gather_facts: false

  tasks:
  - name: pull docker compose yaml
    become: yes
    get_url:
     url: https://raw.githubusercontent.com/bitnami/bitnami-docker-wordpress/master/docker-compose.yml
     dest: /home/donam2539/docker-compose.yml
  - name: run docker compose
    become: yes
    command: docker-compose up -d
  - name: ensure docker-compose container is running
    become: yes
    docker_container_info:
     name: my_container
    register: result
```

### Step 3: Test Ansible

> $ ansible-playbook -i inventory.ini ping-playbook.yaml -k

![1_7.png](https://github.com/dobuithanhnam/VDT2021/blob/main/Week2/pic/1_7.png)

### Step 4: Install docker and docker-compose on VM1

> $ ansible-playbook -i inventory.ini install-docker-playbook.yaml -k -K

![1_8.png](https://github.com/dobuithanhnam/VDT2021/blob/main/Week2/pic/1_8.png)

### Step 5: Deploy Wordpress

> $ ansible-playbook -i inventory.ini deploy-wordpress-playbook.yaml -k -K

![1_9.png](https://github.com/dobuithanhnam/VDT2021/blob/main/Week2/pic/1_9.png)

## Result

![1_10.png](https://github.com/dobuithanhnam/VDT2021/blob/main/Week2/pic/1_10.png)

## Practice 2: Setup Ansible and deploy Wordpress and MariaDB on 2 VMs

### Step 1: Install Ansible and Docker on 2 VMs 

- Install Ansible: Do the same command in Practice 1

- Install Docker: Create your `install-docker-playbook.yaml` file on VM2

```
- name: install docker
  hosts: vm2
  remote_user: donam2539
  gather_facts: false

  tasks:
  - name: ping
    ping:
    register: result
  - name: Install docker.io
    become: yes
    apt:
      name: docker.io
      state: present
  - name: Ensure docker service is running
    become: yes
    service:
      name: docker
      state: started
```

### Step 2: Create your own file 

- Create your `deploy-mariadb-playbook.yaml` file on VM1:

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

- Create your `deploy-wordpress-playbook.yaml` file on VM2:

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

### Step 3: Deploy MariaDB (docker) on on VM1

> $ ansible-playbook -i inventory.ini deploy-mariadb-playbook.yaml -k -K

![2_1.png](https://github.com/dobuithanhnam/VDT2021/blob/main/Week2/pic/2_1.png)

![2_2.png](https://github.com/dobuithanhnam/VDT2021/blob/main/Week2/pic/2_2.png)

### Step 4: Deploy Wordpress (docker) on on VM2

> $ ansible-playbook -i inventory.ini deploy-wordpress-playbook.yaml -k -K

![2_3.png](https://github.com/dobuithanhnam/VDT2021/blob/main/Week2/pic/2_3.png)

## Result

![2_4.png](https://github.com/dobuithanhnam/VDT2021/blob/main/Week2/pic/2_4.png)
