
# Practice 1: Using Ansible to deploy Wordpress (docker) on Ubuntu VM  

**Step 1: Setup Ansible on Controller machine**  

1. Update the APT package repository cache with the following command  
```sudo apt-add-repository ppa:ansible/ansible```  
```sudo apt update```  
2. install Ansible with the following command  
```sudo apt install ansible```  
3. Run the following command to check if ansible is working correctly  
```ansible --version```   
*Output*  
![image](https://user-images.githubusercontent.com/46991949/117783891-29f47c80-b26d-11eb-8355-9c4abc0248fa.png)

4. Generating SSH Key
```ssh-keygen```  
*Output*  
![image](https://user-images.githubusercontent.com/46991949/117784349-adae6900-b26d-11eb-90f4-06f2dca41519.png)

**Step 2: Configuring Ubuntu Hosts for Ansible Automation**

1. Update the APT package repository cache with the following command  
```sudo apt update```  
2. Install OpenSSH server with the following command  
```sudo apt install openssh-server -y```  
*Output*  
![image](https://user-images.githubusercontent.com/46991949/117784792-1e558580-b26e-11eb-9c26-3ada9eb0b576.png)
3. Check if the sshd service is running with the following command  
```sudo systemctl status sshd```  
*Output*  
![image](https://user-images.githubusercontent.com/46991949/117784969-4e9d2400-b26e-11eb-801b-50acd10ba7ad.png)
4. Configuring the Ansible Control Node  
* As root, add an administrator-level user for the control node. Use the adduser command  
```sudo adduser [username]```  
*Output*  
![image](https://user-images.githubusercontent.com/46991949/117825259-61791e00-b299-11eb-9fe8-a7e262c4bede.png)
*Note: Username: user01, pass: 123456*  
* The new account is ready. Now, assign administrative access to the account. The following command assigns superuser privileges, allowing the account to use the sudo command  
```sudo usermod -aG sudo [username]```  
* Setting Up a Basic Firewal  
![image](https://user-images.githubusercontent.com/46991949/118068418-8c17c380-b3cc-11eb-9d31-c78a15d2119c.png)
5. Configuring an Ansible Host  
* The easiest method of setting up an SSH public key is to copy it using the ssh-copy-id command  
```ssh-copy-id username@remote_host```  
*Output*  
![image](https://user-images.githubusercontent.com/46991949/117826714-933eb480-b29a-11eb-8b58-97261d4cbb0d.png)

**Step 3: Setting up the Inventory File**  

1. To access the inventory file, use the following command in the control node’s terminal  
```sudo nano /etc/ansible/hosts```  
![image](https://user-images.githubusercontent.com/46991949/117827787-7d7dbf00-b29b-11eb-9ab6-a0e624af7114.png)
2.  Once you are done adding items to Ansible’s inventory, hit Ctrl+X and then press Y to save the inventory file  
3.  After you’ve set up the inventory file, you can always check it again by using  
```ansible-inventory --list -y```  
*Output*  
![image](https://user-images.githubusercontent.com/46991949/117828046-b0c04e00-b29b-11eb-937b-c5014439e134.png)
4. Testing the Connection  
* To test the connection with the hosts, use the following command in the terminal on your control node  
```ansible all -m ping```  
*Output*  
![image](https://user-images.githubusercontent.com/46991949/117828830-67243300-b29c-11eb-98ff-a8812de212da.png)

**Step 4: Make your first profect in folder named "ansible-playbooks"**    

1. Create create files "ansible.cfg"  
```[defaults]
host_key_checking = False
remote_user = controller
```    
2. Create create files "inventory.ini"
```[server]
192.168.0.115
[server:vars]
ansible_become_pass1
ansible_ssh_pass=1
ansible_user=myhanh
```  
3. Create create folder "roles", Create create files "roles/install_docker-playbook.yaml"
```---
- name: Install MariaDb
  hosts: server
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
 4. Run playbook ```ansible-playbook -i inventory.ini roles/install_docker-playbook.yaml -k -K```  
 *Output*  
 ![image](https://user-images.githubusercontent.com/46991949/118071722-84f3b400-b3d2-11eb-8e2d-8539a49c6f17.png)  
 
 Now access your application on managed node at https://localhost:80 or https://localhost:443  
 ![image](https://user-images.githubusercontent.com/46991949/118071862-d603a800-b3d2-11eb-87d2-dd9400630e63.png)

# Practice 2: Using Ansible to set up docker on VMs and deploy Wordpress on VM1, MariaDB on VM2

*Note*  
*1. VM1: 192.168.0.109 ---> Mariadb*  
*2. VM2: 192.16.0.115  --->Wordpress*  
*3. Controller node: 192.168.0.114*  
*On machines VM1, VM2 install :```sudo apt-get install -y sshpass```*  

**Step 1. Create create files "ansible.cfg"**    
```[default]
host_key_checking = False
remote_user = vm1
```    
**Step 2. Create create files "inventory.ini"**  
```[server1]
192.168.0.109
[server2]
192.168.0.115
[server1:vars]
ansible_user=myhanh
ansible_ssh_user=myhanh
ansible_ssh_pass=1
ansible_ssh_pass=1
[server2:vars]
ansible_user=myhanh
ansible_ssh_user=myhanh
ansible_ssh_pass=1
ansible_ssh_pass=1
ansible_python_interpreter=/usr/bin/python3
```  
**Step 3. Configure and run ansible playbook to install docker on managed machine**  

Create file /roles/docker_playbook.yaml
```- name: set up docker
  hosts: all
  gather_facts: false
  tasks:
    - name: Ping
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
 Run: ```ansible_playbooks$ ansible-playbook -i inventory.ini roles/docker_playbooks.yaml -k -K```  
 ![image](https://user-images.githubusercontent.com/46991949/118128820-9ca85800-b425-11eb-9da2-e4f4ee7ea033.png)  
 
 **Step 4: Create file /roles/mariadb.yaml**
 
 ```name: deploy mariadb
  hosts: server1
  gather_facts: false
  tasks:
    - name: Ensure docker service is running
      become: yes
      service:
        name: docker
        state: started
    - name: Create a volume for MariaDB
      become: yes
      command: docker volume create --name mariadb_data
    - name: Create a MariaDB container
      become: yes
$wordpress --env MARIADB_PASSWORD=abitnami --env MARIADB_DATABASE=bitnami_awordpress --network host --volu$
```  
Run: ```ansible_playbooks$ ansible-playbook -i inventory.ini roles/mariadb.yaml -k -K```  

![image](https://user-images.githubusercontent.com/46991949/118129774-cb72fe00-b426-11eb-9000-3b035a47f54d.png)  

**Step 5: Create file /roles/worpress.yaml**  

```- name: deploy wordpress
  hosts: server2
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
      command: docker run -d --name wordpress -p 8080:8080 -p 8443:8443 --env ALLOW_EMPTY_PASSWORD=yes --env WORDPRESS_DATABASE_USER=bn_wordpress --env WORDPRESS_DATABASE_PASSWORD=bitnami --env WORDPRESS_DATABASE_NAME=bitnami_wordpress --network host --add-host mariadb:192.168.0.109 --volume wordpress_data:/bitnami/wordpress bitnami/wordpress:latest
```  
Run: ```ansible_playbooks$ ansible-playbook -i inventory.ini roles/worpress.yaml -k -K```  
![image](https://user-images.githubusercontent.com/46991949/118130961-23f6cb00-b428-11eb-8025-98015ef224f8.png)


*Output*  
![image](https://user-images.githubusercontent.com/46991949/118132289-b9df2580-b429-11eb-8b10-7a9b254d5cde.png)



 

