# Deploy wordpress with ansible
## A.Setup 2 virtual machine

**Controller node**: 192.168.1.6 <br />
**Managed node**: 192.168.1.4

1. **install ansible on the controller node**
```
$ sudo apt update
$ sudo apt install software-properties-common
$ sudo apt-add-repository --yes --update ppa:ansible/ansible
$ sudo apt install ansible
```

2. **install vim**
```
$sudo apt install vim
```

3. **create inventory**

```
$ touch inventory
$ vim inventory
```

```
[vm1]
192.168.1.4

[vm1:vars]
ansible_become_pass="    "
ansible_ssh_pass="    "
ansible_user=toan
```

4. **ping**
```
$ ansible -i inventory -m ping vm1
```
![](https://raw.githubusercontent.com/toanduc0671/week2-vietteldigitaltalent/main/image/pingvm1.png)

5. **create playbook install docker and deploy wordpress on Managed node**

```
$ touch playbook.yaml
$ vim playbook.yaml
```
```
---

- name: install docker, deploy wordpress using docker-compose
  hosts: vm1
  remote_user: toan
  gather_facts: false
        
  tasks:
  - name: install docker
    become: yes
    apt:
     name: "{{item}}"
     state: present
    with_items:
    - docker.io
    - docker-compose
    
  - name: ensure docker service is running
    become: yes
    service:
      name: docker
      state: started

  - name: ensure docker deamon is running
    service:
      name: docker
      state: started
    become: true

  - name: pull docker_compose
    become: yes
    get_url:
      url: https://raw.githubusercontent.com/bitnami/bitnami-docker-wordpress/master/docker-compose.yml
      dest: /home/toan/Desktop
  
  - name: deploy wordpress with docker_compose
    become: yes
    command: docker-compose up -d
```

6. **run playbook**
```
$ansible-playbook -i inventory playbook.yaml
```
![](https://github.com/toanduc0671/week2-vietteldigitaltalent/blob/main/image/runplaybook1.png)

## B. result:
![](https://raw.githubusercontent.com/toanduc0671/week2-vietteldigitaltalent/main/image/result1.png)
