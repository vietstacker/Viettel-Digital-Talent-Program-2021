# Practice Ansible
Bài tập tuần 2 

# Table of content
- [Practice Ansible](#practice-ansible)
- [Table of content](#table-of-content)
    - [Cài đặt ansible](#cài-đặt-ansible)
    - [Cài đặt ansible trên control node](#cài-đặt-ansible-trên-control-node)
    - [Cài đặt môi trường trên remoted node](#cài-đặt-môi-trường-trên-remoted-node)
    - [Cấu hình ansible trên control node](#cấu-hình-ansible-trên-control-node)
      - [Tạo folder làm việc ansibel-work](#tạo-folder-làm-việc-ansibel-work)
    - [Bài tập 1 : Deploy wordpress bằng command line trên 1 máy ảo](#bài-tập-1--deploy-wordpress-bằng-command-line-trên-1-máy-ảo)
    - [Truy cập địa chỉ https://192.168.1.50:8443 xem kết quả](#truy-cập-địa-chỉ-https1921681508443-xem-kết-quả)
    - [Bài tập 2 : Deploy wordpress trên VM3 và mariadb trên VM2](#bài-tập-2--deploy-wordpress-trên-vm3-và-mariadb-trên-vm2)
      - [Run image bitnami/mariadb in VM2](#run-image-bitnamimariadb-in-vm2)
      - [Run image bitnami/wordpress in VM3](#run-image-bitnamiwordpress-in-vm3)
      - [Truy cập địa chỉ https://192.168.1.51:8443 xem kết quả](#truy-cập-địa-chỉ-https1921681518443-xem-kết-quả)

### Cài đặt ansible 
Bạn chỉ cần cài đặt ansible trên control node , còn các managed node chỉ cần cấu hình ssh 
### Cài đặt ansible trên control node
Cài đặt ssh
```sh
sudo apt install openssh-server
```
Cài đặt ansible 
```sh
sudo apt install ansible
```
Gen key ssh
```sh
ssh-keygen -t rsa
```
### Cài đặt môi trường trên remoted node
Cài đặt ssh
```sh
sudo apt install openssh-server
```
Cấu hình địa chỉ ip tĩnh cho các remoted node <br />
Lấy địa chỉ ip của remoted node 
```sh
ip a
```
Địa chỉ ip của VM trên là 192.168.1.50
> Copy ssh public-key vao cac remoted node 
```sh
ssh-copy-id username@ip
```

### Cấu hình ansible trên control node 
#### Tạo folder làm việc ansibel-work
```sh
mkdir ansible-work
cd ansible-work
```
Tạo file ansible.cfg dùng để cấu hình ansible
```sh
  [defaults]
  host_key_checking = False
  inventory = /home/quocchung/ansible-work/inventory
  log_path = /home/quocchung/ansible-work/test.log
  remote_user = qc
```

Tạo file inventory chứa ip các managed node 
```sh
[vm2]
192.168.1.50
[vm3]
192.168.1.51
```

### Bài tập 1 : Deploy wordpress bằng command line trên 1 máy ảo 

1. Cài đặt máy ảo bằng Virtualbox chạy OS Ubuntu 20.04
2. Thêm máy ảo vào file inventory (trong thư mục tạo trước đó )

3. Tạo file docker-install.yaml để cài đặt docker 
```sh
---
#install docker in VM2
- name: install docker 
  hosts: vm2
  remote_user: qc   
  gather_facts: false
  become: yes
  tasks:
    - name: check ping
      ping:
    - name: install docker ,python3-pip
      apt : 
        name: docker.io ,python3-pip
        state: present
      
    - name: Install docker python module
      pip:
        name: docker


    - name : enable and start
      service:
        name : docker
        state: started

```
Chạy lệnh sau trên terminal :
```sh
$ ansible-playbook docker-install.yaml -K
```

![alt text](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/install-docker.png "")
> install docker in VM2 by ansible-playbook

4. Tạo file playbook-pracice1.yaml
```sh

---
# deploy wordpress bang docker command line tren  vm2 : 192.168.1.50
- name: practice 1 
  hosts: vm2
  remote_user: qc   
  gather_facts: false
  become: yes
  tasks:
    - name: check ping
      ping:
    - name: create network 
      docker_network :
        name: wordpress-network
    - name: create volume mariadb
      docker_volume:
        volume_name : mariadb_data
    - name: run imagemariadb
      docker_container:
        name: mariadb
        image: "bitnami/mariadb:latest"
        network_mode: wordpress-network
        volumes: 
          mariadb_data:/bitnami/mariadb
        env: 
          ALLOW_EMPTY_PASSWORD: "yes"
          MARIADB_USER: "test111"
          MARIADB_PASSWORD: "test1111"
          MARIADB_DATABASE: "bitnami_wordpress"
        

    - name: create volume wordpress
      docker_volume:
        name: wordpress_data
    - name: run wordpress images
      docker_container:
        name: wordpress
        image: bitnami/wordpress:latest
        volumes: wordpress_data:/bitnami/wordpress
        ports:
          - "8443:8443"
          - "8080:8080"
        network_mode: wordpress-network
        env:
          ALLOW_EMPTY_PASSWORD: "yes"
          WORDPRESS_DATABASE_USER: "test111"
          WORDPRESS_DATABASE_PASSWORD: "test1111"
          WORDPRESS_DATABASE_NAME: "bitnami_wordpress"


    - name: allow ufw 
      ufw: rule={{ item.rule }} port={{ item.port }}
      with_items:
        - {rule: 'allow' ,port: '8080'}
        - {rule: 'allow' ,port: '8443'}

```
Run in terminal :
```sh
$ ansible-playbook playbook-pracice1.yaml -K
```
Kết quả thực hiện
![alt text]( https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/bai1_2.png "")

![alt text]( https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/bai1_1.png "")

### Truy cập địa chỉ https://192.168.1.50:8443 xem kết quả

![alt text](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/ketqua2.png "")

<dd/>

### Bài tập 2 : Deploy wordpress trên VM3 và mariadb trên VM2 
1. Cài đặt docker trên 2 máy bằng ansible-playbook

```sh
---
#install docker in VM2 , VM3
- name: install docker 
  hosts: all
  remote_user: qc   
  gather_facts: false
  become: yes
  tasks:
    - name: check ping
      ping:
    - name: install docker ,python3-pip
      apt : 
        name: docker.io ,python3-pip
        state: present
      
    - name: Install docker python module
      pip:
        name: docker


    - name : enable and start
      service:
        name : docker
        state: started

```
Chạy lệnh sau trên terminal :
```ssh
$ ansible-playbook docker-install.yaml -K
```
Kết quả thực thi :
![alt text]( https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/installdocker2.png "")
> install docker in two VMs by ansible-playbook
2. Tạo 2 playbook cho 2 tasks 
#### Run image bitnami/mariadb in VM2
> Tạo file practice3-playbook.yaml 
```sh
---

- name: install mariadb in vm2
  hosts: vm2
  become: yes
  remote_user: qc
  gather_facts: false
  tasks:
    - name: check ping
      ping:
    - name: create volume mariadb
      docker_volume:
        volume_name : mariadb_data
    
    - name: allow port
      ufw:
        rule: allow
        port: 3306

    - name: run imagemariadb
      docker_container:
        name: mariadb
        image: "bitnami/mariadb:latest"
        volumes: 
          mariadb_data:/bitnami/mariadb
        ports:
          - "3306:3306"
        env: 
          ALLOW_EMPTY_PASSWORD: "yes"
          MARIADB_USER: "test111"
          MARIADB_PASSWORD: "test1111"
          MARIADB_DATABASE: "bitnami_wordpress"
```
Chạy lệnh sau trên terminal :
```sh
$ ansible-playbook practice3-playbook.yaml -K
```
Kết quả thực hiện :
![alt text](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/bai3_2.png "")
> install mariadb image in VM2

#### Run image bitnami/wordpress in VM3
> Tạo file practice3_1-playbook.yaml 
```sh
---

- name: install wordpress in vm3
  hosts: vm3
  become: yes
  remote_user: qc
  gather_facts: false
  tasks:
    - name: check ping 
      ping:
    - name: allow ufw 
      ufw: rule={{ item.rule }} port={{ item.port }}
      with_items:
        - {rule: 'allow' ,port: '8080'}
        - {rule: 'allow' ,port: '8443'}
    - name: create volume wordpress
      docker_volume:
        name: wordpress_data
    - name: run wordpress images
      docker_container:
        name: wordpress
        image: bitnami/wordpress:latest
        volumes: wordpress_data:/bitnami/wordpress
        ports:
          - "8443:8443"
          - "8080:8080"
        env:
          WORDPRESS_DATABASE_HOST: "192.168.1.50"
          WORDPRESS_DATABASE_PORT_NUMBER: "3306"
          ALLOW_EMPTY_PASSWORD: "yes"
          WORDPRESS_DATABASE_USER: "test111"
          WORDPRESS_DATABASE_PASSWORD: "test1111"
          WORDPRESS_DATABASE_NAME: "bitnami_wordpress"
```
Chạy lệnh sau trên terminal :
```sh
$ ansible-playbook practice3_1_playbook.yaml -K
```
Kết quả thực hiện :
![alt text](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/bai3_1.png "")
> install wordpress image in VM3


#### Truy cập địa chỉ https://192.168.1.51:8443 xem kết quả
![alt text](https://github.com/qc-kgm/Viettel-Cloud/blob/main/images/ketqua3.png "")


