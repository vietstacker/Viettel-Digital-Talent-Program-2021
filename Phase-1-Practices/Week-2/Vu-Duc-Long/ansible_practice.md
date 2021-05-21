## Practice 1: Install Ansible and Deploy wordpress app

### Step 1: Install Ansible in ubuntu:
> $ sudo apt update
> 
> $ sudo apt install software-properties-common
>
> $ sudo apt-add-repository --yes --update ppa:ansible/ansible
>
> $ sudo apt install ansible
  
### Step 2: Create your folder which contain some file to run automation:
#### Create `inventory.ini` file.
In `inventory.ini` add some code:
```
[vm1]
192.168.159.130

[vm2]
192.168.159.132

[vm1:vars]
ansible_user=long
ansible_ssh_pass=1

[vm2:vars]
ansible_user=long2
ansible_ssh_pass=1
```
#### Create `ansible.cfg` file:

```
[defaults]
host_key_checking = False
inventory = /home/long12/test-ansible/inventory.ini
remote_user = long
```

#### Create `ping-playbook.yaml` to test ansible:

```
- name: test playbook
  hosts: vm1,vm2

  tasks:
  - name: ping
    ping:
    register: result
  - name: print ping data
    debug:
      var: result
```

=> Open your command and run:
> $ ansible-playbook -i inventory.ini ping-playbook.yaml -k

Result:
![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Ansible/pic/test%20ping.png?raw=true)

#### Install docker and docker-compose on VM1:
- Create `install-docker-playbook.yaml`
- Add code: 
```
- name: install docker
  hosts: vm1
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
**Run**
> $ ansible-playbook -i inventory.ini install-docker-playbook.yaml -k -K
 
Expect: 
![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Ansible/pic/installed%20docker%20dockercompose.png?raw=true)

#### Create `deploy-wordpress-playbook.yaml`file.
- Add code an run to deploy docker-compose file:
```
- name: deploy wordpress
  hosts: vm1
  gather_facts: false

  tasks:
  - name: pull docker compose yaml
    become: yes
    get_url:
     url: https://raw.githubusercontent.com/bitnami/bitnami-docker-wordpress/master/docker-compose.yml
     dest: /home/long/docker-compose.yml
  - name: run docker compose
    become: yes
    command: docker-compose up -d
  - name: ensure docker-compose container is running
    become: yes
    docker_container_info:
     name: my_container
    register: result
```
**Run**:
> $ ansible-playbook -i inventory.ini deploy-wordpress-playbook.yaml -k -K

Expect output:
![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Ansible/pic/running%20docker%20compose%20and%20make%20sure%20it%20runnign.png?raw=true)

Check the container is running:
![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Ansible/pic/check_container.png?raw=true)

=> Result:
![](https://github.com/VuduclongPtit/Docker-Kubernetes/blob/master/Ansible/pic/result1.png?raw=true)
