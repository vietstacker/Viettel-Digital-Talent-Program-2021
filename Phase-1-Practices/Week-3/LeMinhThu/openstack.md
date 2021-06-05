# OpenStack

## Prepare

1. Disks
    * sda: 100GB
    * sdb: 50GB
    > Need add sdb in storage of vm to use lvm 
    ![image](https://user-images.githubusercontent.com/83031380/120114799-06a55900-c1ab-11eb-8011-ddfbb8b22b15.png)

2. Network
    * NAT: enps3
    * Bridgr Adapter: enps8 : 192.168.0. 116
    * Host-only Adapter: enp0s9: 192.168.56.116

## Install dependencies

1. Update **apt**

```
sudo apt update
```

2. Install Python build dependencies

```
sudo apt install python3-dev libffi-dev gcc libssl-dev
```

## Install dependencies using a virtual environment

1. Install the virtual environment dependencies

```
sudo apt install python3-venv
```

2. Create a virtual environment and activate it

```
python3 -m venv path/to/venv
source path/to/venv/bin/activate
```

3. Ensure the latest version of pip is installed

```
pip install -U pip
```

4. Install Ansible

```
pip install 'ansible==2.9'
```

## Install Kolla-ansible for deployment or evaluation

1. Install kolla-ansible and its dependencies using pip.

```
pip install kolla-ansible
```

2. Create the /etc/kolla directory.

```
sudo mkdir -p /etc/kolla
sudo chown $USER:$USER /etc/kolla
```

3. Copy globals.yml and passwords.yml to /etc/kolla directory.

```
cp -r path/to/venv/share/kolla-ansible/etc_examples/kolla/* /etc/kolla
```

4. Copy all-in-one and multinode inventory files to the current directory.

```
cp path/to/venv/share/kolla-ansible/ansible/inventory/* .
```

5. Install Openstack CLI (recommend)

> there's a high chance it's you can not install Openstack CLI after deploying Openstack 

```
pip install python-openstackclient python-glanceclient python-neutronclient
```

## Configure Ansible

```
mkdir -p etc/ansible

config="[defaults]\nhost_key_checking=False\npipelining=True\nforks=100"

echo -e $config >> etc/ansible/ansible.cfg
```

## Prepare initial configuration

### Inventory

Check whether the configuration of inventory is correct or not

```
ansible -i multinode all -m ping
```

![image](https://user-images.githubusercontent.com/83031380/120115050-2db05a80-c1ac-11eb-818b-26753d537872.png)



### Kolla passwords

```
kolla-genpwd
```

### Create diskspace partition for Cinder

```
sudo bash
pvcreate /dev/sdb
vgcreate cinder-volumes /dev/sdb
```

### Kolla globals.yml

```
kolla_base_distro: "ubuntu"
kolla_install_type: "source"

network_interface: enp0s8
neutron_external_interface: enp0s3
kolla_internal_vip_address: 192.168.0.116

nova_compute_virt_type: "qemu"

enable_haproxy: "no"

enable_cinder: "yes"
enable_cinder_backup: "no"
enable_cinder_backend_lvm: "yes"

```
>If you want to run an All-In-One without haproxy and keepalived, you can set enable_haproxy to no in "OpenStack options" section, and set this value to the IP of your 'network_interface' as set in the Networking section below.

## Deployment

1. Bootstrap servers with kolla deploy dependencies:

```
kolla-ansible -i all-in-one bootstrap-servers
```

![image](https://user-images.githubusercontent.com/83031380/120115204-ce9f1580-c1ac-11eb-82cd-f5f8971dbaf0.png)

![image](https://user-images.githubusercontent.com/83031380/120115210-d3fc6000-c1ac-11eb-9539-8829ede30fb2.png)

2. Do pre-deployment checks for hosts:

```
kolla-ansible -i all-in-one prechecks
```
![image](https://user-images.githubusercontent.com/83031380/120115264-1aea5580-c1ad-11eb-92b4-407570a9d8b9.png)

![image](https://user-images.githubusercontent.com/83031380/120115271-2178cd00-c1ad-11eb-9e17-cf1484bce7a9.png)


3. Pull Images to VM

```
kolla-ansible -i all-in-one pull
```
![image](https://user-images.githubusercontent.com/83031380/120115305-59801000-c1ad-11eb-966a-de1badeaa3b5.png)

![image](https://user-images.githubusercontent.com/83031380/120115320-67359580-c1ad-11eb-93d7-96900b30e5cc.png)

4. Finally proceed to actual OpenStack deployment:

```
kolla-ansible -i all-in-one deploy
```

![image](https://user-images.githubusercontent.com/83031380/120115402-aa900400-c1ad-11eb-88ce-11ef691a1a58.png)

![image](https://user-images.githubusercontent.com/83031380/120115406-af54b800-c1ad-11eb-9045-691dc2d4f963.png)

5. Post-deploy

```
kolla-ansible -i all-in-one deploy
```
![image](https://user-images.githubusercontent.com/83031380/120115486-11152200-c1ae-11eb-9567-81fb923d1939.png)

## Dashboard

*  Account:
    * User: admin 
    * Password: 
    > Run:
    ```
    cat /etc/kolla/passwords.yml | grep -i keystone_admin_password
    ```
    
![image](https://user-images.githubusercontent.com/83031380/120115672-f7280f00-c1ae-11eb-94f3-b1670220552f.png)

![image](https://user-images.githubusercontent.com/83031380/120115689-145cdd80-c1af-11eb-8270-5f30747caa6d.png)

## Error

![image](https://user-images.githubusercontent.com/83031380/120115998-33a83a80-c1b0-11eb-80e8-ebb3ec9e06ef.png)

=> need add hard disk sdb

![image](https://user-images.githubusercontent.com/83031380/120115851-d7ddb180-c1af-11eb-817a-b5f383d3d4a3.png)
=> in ansible.cfg: ask_sudo_password=False

![image](https://user-images.githubusercontent.com/83031380/120115967-09567d00-c1b0-11eb-9523-352ef4ddd8b1.png)
=> in globals.yml: Enable_cinder_backend_lvm=true

## References

<https://docs.openstack.org/kolla-ansible/latest/user/quickstart.html>

<https://bugs.launchpad.net/kolla/+bugs>

github repo
