# Deploy Openstack AIO inside VM with Kolla

## **setup virtual machine:**
CPU: 2 Core <br />
RAM: 4 GB <br />
disk: 40GB <br />
network: 2NICs: <br />
- enp0s3: (host-only)
- enp0s8: 192.168.1.20 (bridged)

## **A. Requirement packets**
1. Install Python:

```bash
$ sudo apt update
$ sudo apt install python3-dev libffi-dev gcc libssl-dev
```

2. Install the virtual environment 
```bash
$ sudo apt install python3-venv
```
Create a virtual environment and activate <br />
```bash
$ python3 -m venv path/to/venv
$ source path/to/venv/bin/activate
```

3. Ensure the latest version of pip is installed:
```bash
$ pip install -U pip
```

4. Install ansible:
```bash
$ pip install 'ansible<3.0'
```

## **B. Install Kolla-ansible**

1. install kolla-ansible using pip
```bash
$ pip install kolla-ansible
```

2. Create the /etc/kolla directory.
```bash
$ sudo mkdir -p /etc/kolla
$ sudo chown $USER:$USER /etc/kolla
```

3. Copy globals.yml and passwords.yml to /etc/kolla directory.
```bash
$ cp -r path/to/venv/share/kolla-ansible/etc_examples/kolla/* /etc/kolla
```

4. Copy all-in-one and multinode inventory files to the current directory
```bash
$ cp /path/to/venv/share/kolla-ansible/ansible/inventory/* .
```

## **C. Configure Ansible**

1. add the following options to the Ansible configuration file /etc/ansible/ansible.cfg:
```
[defaults]
host_key_checking=False
pipelining=True
forks=100
```

2. Check whether the configuration of inventory is correct or not:
```bash
$ ansible -i multinode all -m ping
```
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/ansibleping.png)

3. initialize password for kolla:
```bash
$ kolla-genpwd
```
# this will generate password randomly stored in `/etc/kolla/passwords.yml` file

## **Configure Kolla globals.yml**
*globals.yml* is the main configuration file for Kolla Ansible. There are a few options that are required to deploy Kolla Ansible:

```bash
$ sudo nano /etc/kolla/globals.yml
```
remove comment characters before each command line and change the value to add configuration: <br />

- kolla_base_distro: "ubuntu"
- kolla_install_type: "source"
- kolla_internal_vip_address: "192.168.1.250"
- network_interface: "enp0s8"
- neutron_external_interface: "enp0s3"
- api_interface: "{{ network_interface }}"
- enable_haproxy: "no"
- enable_cinder: "yes"
- enable_cinder_backup: "no"
- nova_compute_virt_type: "qemu"

## **Deployment**
1. Bootstrap servers with kolla:
```bash
$ kolla-ansible -i ./multinode bootstrap-servers
```
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/kolla1.png)

2. Do pre-deployment checks for hosts:
```bash
$ kolla-ansible -i ./multinode prechecks
```
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/kollaprecheck.png)

3. Finally proceed to actual OpenStack deployment:
```bash
$ kolla-ansible -i ./multinode deploy
```
 ![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/kolladeploy2.png)

 4. result:
- run command to get password:
 ```bash
$ cat password.yml | grep keystone_admin
 ```
- access to localhost
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/openstack.png)

![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/openstack2.png)

## debug:
- rabbitmq : "Hostname has to resolve to IP address of api_interface" during the prechecks phase </br >
=> add **api_interface: "{{ network_interface }}"** in /etc/kolla/globals.yml <br />
(special thanks to our KOL Trinh Nguyen)  [his blog](https://www.dangtrinh.com/2017/10/openstack-kolla-ansible-prechecks-error.html) helped me to fix this error.

- Error at TASK [mariadb : Creating haproxy mysql user] while running the command: <br />
`$ kolla-ansible -i ./multinode deploy`
=> add **enable_haproxy: "no"** in /etc/kolla/globals.yml <br />




