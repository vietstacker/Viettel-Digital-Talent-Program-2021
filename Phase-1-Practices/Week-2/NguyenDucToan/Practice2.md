# Using Ansible to deploy Wordpress (on VM1), Mariadb (on VM2)
## A. Setup 3 virtual machine

**Controller node**: 192.168.1.6 <br />
**Managed node1**: 192.168.1.4 <br />
**Managed node2**: 192.168.1.5 

![](https://raw.githubusercontent.com/toanduc0671/week2-vietteldigitaltalent/main/image/setup.png)

1. **set-up docker on both 2 managed node (already did that in the first practice)**

2. **update inventory.ini from the first practice:**

```
$ touch inventory
$ vim inventory
```

```
[vm1]
192.168.1.4
[vm2]
192.168.1.5


[all:vars]
ansible_become_pass="    "
ansible_ssh_pass="    "
ansible_user=toan

``` 

3. **build playbook2.yaml**

```
---

- name: deploy wordpress on 2VM
  hosts: vm1
  remote_user: toan
  gather_facts: false
  
  tasks:
  - name: create volume for mariadb
    become: yes
    command: docker volume create --name mariadb_data

  - name: run the image mariadb:latest
    become: yes
    command: docker run -d --name mariadb -p 3306:3306 --env ALLOW_EMPTY_PASSWORD=yes --env MARIADB_USER=bn_wordpress --env MARIADB_PASSWORD=bitnami --env MARIADB_DATABASE=bitnami_wordpress --volume mariadb_data:/bitnami/mariadb bitnami/mariadb:latest

- name: deploy wordpress on 2VM
  hosts: vm2
  remote_user: toan
  gather_facts: false
  
  tasks:
  - name: create volume for mariadb
    become: yes
    command: docker volume create --name wordpress_data
 
  - name: run the image bitnami/wordpress:latest
    become: yes
    command: docker run -d --name wordpress -p 8080:8080 -p 8443:8443 --env ALLOW_EMPTY_PASSWORD=yes --env WORDPRESS_DATABASE_USER=bn_wordpress --env WORDPRESS_DATABASE_PASSWORD=bitnami --env WORDPRESS_DATABASE_NAME=bitnami_wordpress --volume wordpress_data:/bitnami/wordpress --add-host mariadb:192.168.1.4 bitnami/wordpress:latest

```

4. **run playbook:**
```
$ ansible-playbook -i inventory playbook2.yaml
```

![](https://raw.githubusercontent.com/toanduc0671/week2-vietteldigitaltalent/main/image/lastRun.png)

## B. result

5. **try to connect to https://yourip:8443**

![](https://raw.githubusercontent.com/toanduc0671/week2-vietteldigitaltalent/main/image/result2.1.png)

**https://yourip:8080 <br />**

![](https://raw.githubusercontent.com/toanduc0671/week2-vietteldigitaltalent/main/image/result2.2.png)

