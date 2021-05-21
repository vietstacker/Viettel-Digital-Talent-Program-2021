## Practice 1

### Bước 1: Cài đặt ansible trên Ubuntu

```
sudo apt update
sudo apt install software-properties-common
sudo apt-add-repository --yes --update ppa:ansible/ansible
sudo apt install ansible
```

### Bước 2: Tạo file inventory.ini

```
[vm]
192.168.1.241
[vm2]
192.168.1.247
[all:vars]
ansible_user=leminhthu
ansible_ssh_pass=xxx
ansible_sudo_pass=xxx
```

### Bước 3: Thiết lập file ansible.cfg

```

[defaults]
host_key_checking=False
inventory= /home/leminhthu/run_ansible/inventory.ini
remote_user = leminhthu

```

### Bước 4: Cài đặt docker trên máy ảo thông qua install-docker.yaml

```

---

- name: test playbook
  hosts: vm2
  gather_facts: false

  tasks:
  - name: ping
    ping:
    register: result
  - name: install docker.io
    become: yes
    apt:
      name: docker.io
      state: present
  - name: intall docker-compose
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

![alt](https://user-images.githubusercontent.com/83031380/118247569-85bd4080-b4cd-11eb-876f-d336179213dd.png)

### Bước 5: Triển khai Wordpress thông qua deployWP.yaml

```

---

- name: deployWP
  hosts: vm
  gather_facts: false

  tasks:
  - name: ping
    ping:
    register: result
  - name: pull wordpress
    become: yes
    get_url:
      url: <https://raw.githubusercontent.com/bitnami/bitnami-docker-wordpress/master/docker-compose.yml>
      dest: /home/leminhthu/docker-compose.yml
  - name: run container
    become: yes
    command: docker-compose up -d

```

Kết quả:
![alt](https://user-images.githubusercontent.com/83031380/118247863-dfbe0600-b4cd-11eb-863b-aded17209305.png)

## Practice2

vm: 192.168.1.241 triển khai Mariadb
vm2: 192.168.1.247 triển khai Wordpress

### Bước 1: Cài đặt docker trên 2 máy ảo thông qua install-docker.yaml

### Bước 2: Trên vm1 triển khai Mariadb thông qua deployMariadb.yaml

```

- name: deploy mariadb
  hosts: vm
  gather_facts: false

  tasks:
  - name: create volume
    become: yes
    command: docker volume create --name mariadb_data
  - name: deploy mariadb
    become: yes
    command: docker run -d --name mariadb --env ALLOW_EMPTY_PASSWORD=yes --env MARIADB_USER=bn_wordpress --env MARIADB_PASSWORD=bitnami --env MARIADB_DATABASE=bitnami_wordpress --network host --volume mariadb_data:/bitnami/mariadb  bitnami/mariadb:latest
    register: result
  - name: checking result
    debug:
      var: result

```

![alt](https://user-images.githubusercontent.com/83031380/118248066-1562ef00-b4ce-11eb-81dc-91e8f53a4eae.png)
![alt](https://user-images.githubusercontent.com/83031380/118248110-20b61a80-b4ce-11eb-8d9f-e2904a65d996.png)

### Bước 3: Trên vm2 triển khai Wordpress thông qua deployWordpress.yaml

```

- name: deploy wwordpress
  hosts: vm2
  gather_facts: false

  tasks:
  - name: Ensure docker service is running
    become: yes
    service:
      name: docker
      state: started
  - name: Create a volume for wordpress
    become: yes
    command: docker volume create --name wordpress_data
  - name: Create the Wordpress container
    become: yes
    command: docker run -d --name wordpress  --env WORDPRESS_DATABASE_HOST=192.168.1.241 --env ALLOW_EMPTY_PASSWORD=yes --env WORDPRESS_DATABASE_USER=bn_wordpress --env WORDPRESS_DATABASE_PASSWORD=bitnami --env WORDPRESS_DATABASE_NAME=bitnami_wordpress --network host --add-host mariadb:192.168.1.241 --volume wordpress_data:/bitnami/wordpress bitnami/wordpress:latest
    register: result
  - name: checking result
    debug:
      var: result

```

![alt](https://user-images.githubusercontent.com/83031380/118248251-4ba06e80-b4ce-11eb-88b3-912903b3db49.png)
![alt](https://user-images.githubusercontent.com/83031380/118248293-58bd5d80-b4ce-11eb-9a9b-e507c91517d9.png)

### Bước 4: Chạy các container qua run.yaml

```

---

- name: run all
  hosts: vm, vm2
  gather_facts: false

  tasks:
  - name: execute
    become: yes
    command: docker ps
    register: result
  - name: print docker data
    debug:
      var: result

```

![alt](https://user-images.githubusercontent.com/83031380/118248447-81ddee00-b4ce-11eb-9934-7eea8ebe1425.png)
![alt](https://user-images.githubusercontent.com/83031380/118248541-991cdb80-b4ce-11eb-9801-8036ef7aa1d0.png)
Kết quả:
![alt](https://user-images.githubusercontent.com/83031380/118248599-af2a9c00-b4ce-11eb-830c-84b3d6d4f140.png)
