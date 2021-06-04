# Pratice 1 - Install Ansible and Deploy WordPress(docker) using Ansible


##### Step 1: Install Ansible
Install on Ubuntu
```console
$ sudo apt update
$ sudo apt install software-properties-common
$ sudo apt-add-repository --yes --update ppa:ansible/ansible
$ sudo apt install ansible
```
Check install Ansible successful 
```console
$ ansible --version
```
It will has line ```config file = /etc/ansible/ansible.cfg ```

##### Step 2: Create your own ```ansible.cfg``` file on your folder
After create ```ansible.cfg``` file, you can run
```console
$ ansible --version
```
It will has line ```config file = {path_to_your_folder_create_file_config}/ansible.cfg ```  (compare to step 1)


##### Step 3: Create your own ```inventory.ini``` file on your folder
```inventory.ini``` define hosts, groups you want to manage

my ```inventory.ini``` file
```console
[db]
192.168.5.10
[web]
192.168.5.11
192.168.5.12
[web:vars]
ansible_user=thang2
ansible_ssh_pass=2
ansible_become_password=2
[db:vars]
ansible_user=thang
ansible_ssh_pass=1
ansible_become_password=1
```

Then, you change your own  ```ansible.cfg``` file 
```console
...
host_key_checking = False
inventory = {path_your_own_inventory_file}
...
```

you can create with ``` .yaml ``` to use ``` vault ```  ( ! change variable 'inventory' in ``` ansible.cfg``` file )
```console
---
db:
 hosts:
  192.168.5.10:
 vars:
  ansible_user: thang
  ansible_ssh_pass: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          39366338373162316561613632616164636530376139613332313639396532623632326437616437
          6134653935396333366533643662383234353764643065650a643162666539353834643965363134
          64376238363161386662383330363335316531363161646633646538366431633965646233623939
          3835653662383764330a343239626266383464626364633634333661373264366530653232353230
          6561
  ansible_become_password: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          39366338373162316561613632616164636530376139613332313639396532623632326437616437
          6134653935396333366533643662383234353764643065650a643162666539353834643965363134
          64376238363161386662383330363335316531363161646633646538366431633965646233623939
          3835653662383764330a343239626266383464626364633634333661373264366530653232353230
          6561
web:
 hosts:
  192.168.5.11:
  192.168.5.12:
 vars:
  ansible_user: thang2
  ansible_ssh_pass: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          36623064303234373739333634313430353739616663343332353065666233633834666262386431
          3762383537616231373061643835643962343239363562360a306633656262636364643363373337
          61336136653362366262653036383764383066386631393561383730656663373133323430386638
          6632666238386333630a383936363030313031636230646535393135386665663531363430613338
          3733
  ansible_become_password: !vault |
          $ANSIBLE_VAULT;1.1;AES256
          36623064303234373739333634313430353739616663343332353065666233633834666262386431
          3762383537616231373061643835643962343239363562360a306633656262636364643363373337
          61336136653362366262653036383764383066386631393561383730656663373133323430386638
          6632666238386333630a383936363030313031636230646535393135386665663531363430613338
          3733
```
#### Step 4: Test Ansible with your own ```ansible.cfg``` file
ping all machine you defined on your own ```inventory.ini``` file
```console 
 ansible all -m ping 
```
It will look like
![image](https://user-images.githubusercontent.com/43313369/117580672-45537080-b123-11eb-9336-f3acf9a29b59.png)

#### Step 5: Install Docker & Docker Compose on group ```web```
```console
---
- name: test playbook
  hosts: web
  gather_facts: false

  tasks:
  - name: install docker
    become: yes
    apt:
     name: docker.io
     state: present
  - name: Install docker-compose
    become: yes
    apt:
     name: docker-compose
     state: present
```


#### Step 6: Deploy WordPress with Docker-Compose
Download file docker-compose.yml then run
```console
---
- name: test playbook
  hosts: web
  gather_facts: false
  tasks:
  - name: download file compose (mariadb+wordpress)
    become: yes
    get_url:
     url: https://raw.githubusercontent.com/bitnami/bitnami-docker-wordpress/master/docker-compose.yml
     dest: /home/docker-compose.yml
     force_basic_auth: yes
  - name: deploy wordpress with docker-compose
    become: yes
    command: docker-compose up -d
    args:
     chdir: /home
```
#### Step 7: Deploy WordPress,MariaDb with Command Line
Create Network --> create volume --> run mariadb -> run wordpress
```console
---
- name: Install MariaDb
  hosts: web
  gather_facts: false

  tasks:
  - name: create network
    become: yes
    command: docker network create wordpress-network
  - name: create volume for db
    become: yes
    command: docker volume create --name mariadb_data
  - name:  run image mariadb
    become: yes
    command: docker run -d --name mariadb --env ALLOW_EMPTY_PASSWORD=yes --env MARIADB_USER=bn_wordpress --env MARIADB_PASSWORD=bitnami --env MARIADB_DATABASE=bitnami_wordpress --network wordpress-network --volume mariadb_data:/bitnami/mariadb bitnami/mariadb:latest
  - name: create volume for web
    become: yes
    command: docker volume create --name wordpress_data
  - name:  run image wordpress
    become: yes
    command: docker run -d --name wordpress -p 80:8080 -p 443:8443  --env ALLOW_EMPTY_PASSWORD=yes --env WORDPRESS_DATABASE_USER=bn_wordpress  --env WORDPRESS_DATABASE_PASSWORD=bitnami  --env WORDPRESS_DATABASE_NAME=bitnami_wordpress --network wordpress-network --volume wordpress_data:/bitnami/wordpress  bitnami/wordpress:latest
```
# Result
Go to *http://localhost:80* or *https://localhost:443* to test
![image](https://user-images.githubusercontent.com/43313369/117582919-9b79e100-b12e-11eb-9846-bc3bfbd133eb.png)

