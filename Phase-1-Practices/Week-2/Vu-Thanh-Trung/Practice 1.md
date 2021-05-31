# Practice 1: Using Ansible to setup Docker and deploy Wordpress (docker) on Ubuntu VM

## Prerequisite: 
- [Bridged Adapter](Instruction: https://github.com/trungvuthanh/cloud-intern-vtnet/blob/main/Week1/Practice%203.md)
- Install `openssh-server` and `sshpass` on both VMs
```console
$ sudo apt install openssh-server
$ sudo apt-get install sshpass
```
---
## PART 1: Setup Ansible on Controller machine

#### Step 1: Install Ansible (Ubuntu)
```console
$ sudo apt update
$ sudo apt install software-properties-common
$ sudo apt-add-repository --yes --update ppa:ansible/ansible
$ sudo apt install ansible
```

#### Step 2: Create `ansible.cfg` file: (I'm using Vim)
```console
[defaults]
host_key_checking = False
inventory = /home/Desktop/ansible/inventory.ini
remote_user = trung
```

#### Step 3: Create `inventory.ini` file
```console
[vm1]
192.168.1.84

[vm2]
192.168.1.86

[all:vars]
ansible_ssh_user=trung
ansible_ssh_pass=trung
```

#### Step 4 (optional): Test Ansible
```console
$ ansible -i inventory.ini all -m ping
```
![Practice 1 (2)](https://user-images.githubusercontent.com/48465162/118099172-16791b00-b3ff-11eb-8e63-9e07e2a7eeb8.png)

---

## PART 2: Using Ansible to setup Docker on Ubuntu VM

#### Step 1: Create `install-docker-playbook.yaml` file
```console
- name: install docker
  hosts: vm2
  gather_facts: false

  tasks:
  - name: install docker.io
    become: yes
    apt:
      name: docker.io
      state: present
  - name: install docker-compose
    become: yes
    apt:
      name: docker-compose
      state: present
  - name: ensure docker service is running
    become: yes
    service:
      name: docker
      state: started
```

#### Step 2: Run ansible-playbook
```console
$ ansible-playbook -i inventory.ini install-docker-playbook.yaml -k -K
```
![Practice 1 (3)](https://user-images.githubusercontent.com/48465162/118098443-1e848b00-b3fe-11eb-8d14-1226e448dce8.png)

---

## PART 3: Using Ansible to deploy Wordpress (docker) on Ubuntu VM

#### Step 1: Create `docker-compose-playbook.yaml` file
```console
- name: deploy wordpress
  hosts: vm2
  gather_facts: false

  tasks:
  - name: pull docker compose yml
    become: yes
    get-url:
      url: https://raw.githubusercontent.com/bitnami/bitnami-docker-wordpress/master/docker-compose.yml
      dest: /home/docker-compose.yml
  - name: docker compose up
    become: yes
    command: docker-compose up -d
```

#### Step 2: Run ansible-playbook
```console
$ ansible-playbook -i inventory.ini docker-compose-playbook.yaml -k -K
```
![Practice 1 (4)](https://user-images.githubusercontent.com/48465162/118103834-8dfd7900-b404-11eb-9f07-89c89d86ecd6.png)

#### Step 3 (optional): Check `docker ps` on VM2
```console
$ sudo docker ps
```
![Practice 1 (5)](https://user-images.githubusercontent.com/48465162/118104070-dae14f80-b404-11eb-8824-182ad9f81f43.png)

#### Step 4: Access application at http://localhost
![Practice 1 (6)](https://user-images.githubusercontent.com/48465162/118104192-0401e000-b405-11eb-8243-cff594f23a93.png)

---
About Ansible: https://www.ansible.com/

About Vim: https://www.vim.org/about.php
