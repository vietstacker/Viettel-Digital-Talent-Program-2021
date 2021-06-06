# Practice: Setup OpenStack AIO inside VM with Kolla

## About OpenStack

- [What is OpenStack?](https://www.openstack.org/software/)

- [Docs OpenStack - QuickStart](https://docs.openstack.org/kolla-ansible/latest/user/quickstart.html)

## Practice

### Host machine configuration

- 2 network interfaces: enp0s3, enp0s8

- 4GB main memory

- 50GB disk space

### Install dependencies

- Install Python build dependencies and virtual environment dependencies

```console
sudo apt update
sudo apt install python3-pip python3-dev libffi-dev gcc libssl-dev python3-venv -y
```

- Create a virtual environment and activate it

```console
python3 -m venv venv
source venv/bin/activate
```

- Ensure the latest version of pip is installed

```console
pip install -U pip
```

- Install Ansible

```console
pip install 'ansible==2.9'
```

- Why 'ansible==2.9' instead of 'ansible<3.0'

![OpenStack (2) ansible-2 9](https://user-images.githubusercontent.com/48465162/119988322-2d6b6000-bff0-11eb-9665-1e18c174e732.png)

### Install Kolla-ansible

- Install kolla-ansible and its dependencies using *pip*

```console
pip install kolla-ansible wheel
```

- Create the `/etc/kolla` directory

```console
sudo mkdir -p /etc/kolla
sudo chown $USER:$USER /etc/kolla
```

- Copy globals.yml and passwords.yml to /etc/kolla directory

```console
cp -r venv/share/kolla-ansible/etc_examples/kolla/* /etc/kolla
```

- Copy all-in-one and multinode inventory files to the current directory

```console
cp venv/share/kolla-ansible/ansible/inventory/* .
```

- Test ping

```console
ansible -i all-in-one all -m ping
```

- Test ping result

```console
localhost | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
```

- Generate password

```console
kolla-genpwd
```

### Configure Ansible

```console
nano /etc/kolla/globals.yml
```

**Note:** If you want to run an All-In-One without haproxy and keepalived, you can set enable_haproxy to no in "OpenStack options" section, and set kolla_internal_vip_address value to the IP of your 'network_interface'

```console
kolla_base_distro: "ubuntu"
kolla_install_type: "source"
kolla_internal_vip_address: "10.0.2.15"
network_interface: "enp0s3"
neutron_external_interface: "enp0s8"
enable_haproxy: "no"
enable_cinder: "yes"
enable_cinder_backup: "no"
enable_cinder_backend_lvm: "yes"
```

### Deployment

- Bootstrap servers with kolla deploy dependencies

```console
kolla-ansible -i ./all-in-one bootstrap-servers
```

![OpenStack (3) bootstrap-servers](https://user-images.githubusercontent.com/48465162/119988362-3b20e580-bff0-11eb-93d8-c13b7639c931.png)

- Do pre-deployment checks for hosts

```console
kolla-ansible -i ./all-in-one prechecks
```

![OpenStack (4) prechecks](https://user-images.githubusercontent.com/48465162/119988385-4411b700-bff0-11eb-979b-d9e29f899cd7.png)

- Pull OpenStack images

```console
kolla-ansible -i ./all-in-one pull
```

![OpenStack (5) pull](https://user-images.githubusercontent.com/48465162/119988408-4a079800-bff0-11eb-9908-522724d91aa9.png)

- Deploy OpenStack

```console
kolla-ansible -i ./all-in-one deploy
```

![OpenStack (6) deploy-success](https://user-images.githubusercontent.com/48465162/120077148-249f8a80-c0d3-11eb-890d-1f41a47fcdd1.png)

### Using OpenStack

- Install the OpenStack CLI client

```console
pip install python3-openstackclient
```

- OpenStack requires an openrc file where credentials for admin user are set. To generate this file run

```console
kolla-ansible post-deploy
. /etc/kolla/admin-openrc.sh
```

- Get keystone_admin_password

```console
cat /etc/kolla/passwords.yml | grep keystone_admin
```

- Access: http://10.0.2.15

![OpenStack (7) web](https://user-images.githubusercontent.com/48465162/120077268-c6bf7280-c0d3-11eb-9f0a-67214294ede6.png)

![OpenStack (7) web-2](https://user-images.githubusercontent.com/48465162/120077271-ccb55380-c0d3-11eb-95c2-5fd2ed9dae77.png)
