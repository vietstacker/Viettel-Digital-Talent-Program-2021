# WEEK 3: SDN-NFV

## Practice: Setup VXLAN network between 2 VMs and test

### Prepare:

- 2 VMs Ubuntu:

My VM1's ip: `192.168.1.109`

My VM2's ip: `192.168.1.110`

- Tool ifconfig:

> $ sudo apt install net-tools

- Wireshark on VM1:

```
$ sudo apt update
$ sudo apt upgrade
$ sudo apt install wireshark
$ sudo usermod -aG wireshark $(whoami)
$ sudo reboot
```
### Step 1: Configurate OpenvSwitch on 2 VMs

> $ sudo apt install openvswitch-switch

#### Result 

![Screenshot_4.png](https://github.com/dobuithanhnam/Viettel-Digital-Talent-2021/blob/main/Week3/pic/Screenshot_4.png)

### Step 2: Create Bridge on 2 VMs

- VM1

```
$ sudo ovs-vsctl add-br sw1
$ sudo ovs-vsctl add-br sw2

$ sudo ifconfig sw1 10.0.0.10/24
$ sudo ifconfig sw2 192.168.1.109/24

$ sudo ip link set sw1 up
$ sudo ip link set sw2 up

$ sudo ovs-vsctl add-port sw2 ens33 
```

- VM2

```
$ sudo ovs-vsctl add-br sw1
$ sudo ovs-vsctl add-br sw2

$ sudo ifconfig sw2 10.0.0.20/24
$ sudo ifconfig sw1 192.168.1.110/24

$ sudo ip link set sw1 up
$ sudo ip link set sw2 up

$ sudo ovs-vsctl add-port sw1 ens33 
```

### Step 3: Create Tunnels VXLAN

- VM1

> $ sudo ovs-vsctl add-port sw1 tun0 -- set interface tun0 type=vxlan options:remote_ip=192.168.1.110 options:key=1

#### Result 

![Screenshot_9.png](https://github.com/dobuithanhnam/Viettel-Digital-Talent-2021/blob/main/Week3/pic/Screenshot_9.png)

- VM2

> $ sudo ovs-vsctl add-port sw2 tun0 -- set interface tun0 type=vxlan options:remote_ip=192.168.1.109 options:key=1

#### Result 

![Screenshot_10.png](https://github.com/dobuithanhnam/Viettel-Digital-Talent-2021/blob/main/Week3/pic/Screenshot_10.png)

### Step 4: Test ping Vxlan network

> ping `10.0.0.20`

#### Result 

![Screenshot_12.png](https://github.com/dobuithanhnam/Viettel-Digital-Talent-2021/blob/main/Week3/pic/Screenshot_12.png)

### Step 5: Use Wireshark to capture traffic between 2 virtual machines

#### Result 

![Screenshot_14.png](https://github.com/dobuithanhnam/Viettel-Digital-Talent-2021/blob/main/Week3/pic/Screenshot_14.png)

## Advantages and Disadvantages of using Vxlan network in datacenter

### 1. Advantages:

- Expand the ability to divide the network, whereby VxLAN uses 24bit for VxLAN ID (with VLAN is 12 bits) --> We have more than 16 million VxLAN IDs. 
- Do not use STP and enable ECMP (Equal-Cost MultiPath) -> Allow packet transmission on multiple paths. 
- Ability to integrate SDN (Software Defined Network) -> Allows building the most flexible virtualized network infrastructure. 
- VXLAN is a technology that allows you to extend your L2 network over any L3 network.

### 2. Disadvantages:

- Increase in Packet Size & Performance Reduction
- Management & Configuration Complexity

