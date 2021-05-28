# OpenStack

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
cp -r /path/to/venv/share/kolla-ansible/etc_examples/kolla/* /etc/kolla
```

4. Copy all-in-one and multinode inventory files to the current directory.

```
cp /path/to/venv/share/kolla-ansible/ansible/inventory/* .
```

## Configure Ansible

```
mkdir -p /etc/ansible

config="[defaults]\nhost_key_checking=False\npipelining=True\nforks=100"

echo -e $config >> /etc/ansible/ansible.cfg
```

## Prepare initial configuration

### Inventory
Check whether the configuration of inventory is correct or not

```
ansible -i multinode all -m ping
```

![image](https://user-images.githubusercontent.com/83031380/120012142-54825b80-c009-11eb-99ca-1b29edea3d99.png)


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
kolla_internal_vip_address: "10.10.10.254

network_interface: enp0s3
neutron_external_interface: enp0s8

nova_compute_virt_type: "qemu"

enable_cinder: "yes"
enable_cinder_backend_lvm: "yes"
```

## Deployment

1. Bootstrap servers with kolla deploy dependencies:

```
kolla-ansible -i all-in-one bootstrap-servers
```

![image](https://user-images.githubusercontent.com/83031380/120012221-6c59df80-c009-11eb-93d0-152ab6c6ebeb.png)

![image](https://user-images.githubusercontent.com/83031380/120012240-724fc080-c009-11eb-810a-c0922d310c40.png)


2. Do pre-deployment checks for hosts:

```
kolla-ansible -i all-in-one prechecks
```
![image](https://user-images.githubusercontent.com/83031380/120012352-957a7000-c009-11eb-8787-4f9e8dbd13ec.png)

![image](https://user-images.githubusercontent.com/83031380/120012399-a6c37c80-c009-11eb-833d-88e3356bf3ff.png)

3. Pull Images to VM

```
kolla-ansible -i all-in-one pull
```

![image](https://user-images.githubusercontent.com/83031380/120012559-da060b80-c009-11eb-8706-c5b3dbd5740b.png)

![image](https://user-images.githubusercontent.com/83031380/120012598-e5f1cd80-c009-11eb-9241-24590510fb3d.png)

4. Finally proceed to actual OpenStack deployment:

```
kolla-ansible -i all-in-one deploy
```

![image](https://user-images.githubusercontent.com/83031380/120012655-face6100-c009-11eb-93fa-2230576c93de.png)

![image](https://user-images.githubusercontent.com/83031380/120012693-091c7d00-c00a-11eb-9575-16b9297ea1f0.png)

**Deployment failed here!!!**