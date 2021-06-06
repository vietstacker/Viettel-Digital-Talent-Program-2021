# Practice: SDN with Open vSwitch & VXLAN

## Table of contents

- [I. Related knowledge](#I-Related-knowledge)

- [II. Practice](#II-Practice)

  - [Part 1: Install OpenvSwitch on VM](#Part-1-Create-2-Linux-virtual-machines-and-install-openvswitch)

  - [Part 2: Setup VXLAN on 2 VMs](#Part-2-Use-openvswitch-to-setup-Vxlan-network-between-2-virtual-machines)

  - [Part 3: Test ping VXLAN & capture traffic](#Part-3-Test-ping-Vxlan-network-use-Tcpdump-or-Wireshark-to-capture-traffic-between-2-virtual-machines)

  - [Part 4: Pros & cons of VXLAN in datacenter](#Part-4-Point-out-the-advantages-and-disadvantages-of-using-Vxlan-network-in-datacenter)

## I. Related knowledge

I'm not going to rewrite everything about SDN or Open vSwitch or VXLAN here as we can refer to docs and articles from experts. Head on over to these links below:

- [SDN technology & OpenFlow protocol - github.com/hocchudong](https://github.com/hocchudong/thuctap012017/blob/master/TamNT/TimHieuSDN/docs/1.Gioi_thieu_SDN-OpenFlow.md)

- [OpenvSwitch basic - github.com/hocchudong](https://github.com/hocchudong/thuctap012017/blob/master/XuanSon/Virtualization/Virtual%20Switch/Open%20vSwitch/OpenvSwitch_basic.md)

- [VXLAN & GRE Tunneling protocol - github.com/hocchudong](https://github.com/hocchudong/thuctap012017/blob/master/XuanSon/Netowork%20Protocol/VXLAN-GRE%20Protocol.md) (Practice follows this link)

- [VXLAN - Huawei](https://support.huawei.com/enterprise/en/doc/EDOC1100086966) for more specific information

## II. Practice

VM1: 192.168.1.90
VM2: 192.168.1.91

### Part 1: Create 2 Linux virtual machines and install openvswitch

Update `apt` and install `openvswitch-switch`, `net-tools` on both VMs

```console
sudo apt update
sudo apt upgrade -y
sudo apt install net-tools
sudo apt install openvswitch-switch -y
```

Ensure `ovs-vswitchd` is active

```console
systemctl status ovs-vswitchd
```

![SDN (1)](https://user-images.githubusercontent.com/48465162/119224339-2217c080-bb28-11eb-809e-6e973113999c.png)

### Part 2: Use openvswitch to setup Vxlan network between 2 virtual machines

#### Step 1: Add vswitch for both VMs

```console
sudo ovs-vsctl add-br br0
sudo ovs-vsctl add-br br1
```

#### Step 2: Add port to vswitch `br0` for both VMs (`enp0s3` stands for *ethernet network peripheral # serial #*)

```console
sudo ovs-vsctl add-port br0 enp0s3
```

#### Step 3: Config ip for `br0`

- VM1:

```console
sudo ip a flush enp0s3
sudo ifconfig br0 192.168.1.90/24
```

- VM2:

```console
sudo ip a flush enp0s3
sudo ifconfig br0 192.168.1.91/24
```

#### Step 4: Config ip for `br1`

- VM1:

```console
sudo ifconfig br1 10.1.1.10/24
```

- VM2:

```console
sudo ifconfig br1 10.1.1.11/24
```

#### Step 5: Config VXLAN for `br1`

- VM1:

```console
sudo ovs-vsctl add-port br1 vxlan1 -- set interface vxlan1 type=vxlan options:remote_ip=192.168.1.91
```

- VM2:

```console
sudo ovs-vsctl add-port br1 vxlan1 -- set interface vxlan1 type=vxlan options:remote_ip=192.168.1.90
```

#### Step 6: Check result

![SDN (2)](https://user-images.githubusercontent.com/48465162/119224567-2bedf380-bb29-11eb-97e7-fefbf73a9e36.png)

![SDN (3)](https://user-images.githubusercontent.com/48465162/119224569-2db7b700-bb29-11eb-8769-3ba8f0208509.png)

### Part 3: Test ping Vxlan network, use Tcpdump or Wireshark to capture traffic between 2 virtual machines

- From VM1 to VM2:

```console
ping -I br1 10.1.1.11
```

![SDN (4)](https://user-images.githubusercontent.com/48465162/119224662-b0407680-bb29-11eb-8efe-400298b8afa1.png)

- From VM2 to VM1:

```console
ping -I br1 10.1.1.10
```

![SDN (5)](https://user-images.githubusercontent.com/48465162/119224663-b171a380-bb29-11eb-94bc-427741b05cd8.png)

- Use Wireshark to capture traffic

**Note:** [Tcpdump Cheat Sheet](https://gist.github.com/jforge/27962c52223ea9b8003b22b8189d93fb)

- Capture traffic and write data to `vxlan.pcap`

```console
sudo tcpdump -i any -c 10 -nn -s 0 -w vxlan.pcap
```

- Wireshark will automatically open after command, open file `vxlan.pcap` to view data

```console
wireshark
```

![SDN (6)](https://user-images.githubusercontent.com/48465162/120905378-d0208000-c67b-11eb-86d9-d9142276d253.png)

### Part 4: Point out the advantages and disadvantages of using Vxlan network in datacenter

- Advantages

  - Expanding the ability to divide the network, `VxLAN` using 24bit for `VxLAN ID` (with `VLAN` 12 bits) --> We have more than 16 million `VxLAN ID`.

  - Have no use of `STP` and allow `enable` ECMP (Equal-Cost MultiPath) -> Allow packet transmission on multiple `path`.

  - Increased network flexibility meets Cloud Platform flexibility.

  - Opens up the ability to integrate SDN -> Allows building the most flexible virtualized network infrastructure.

- Disadvantages

  - The additional header of VXLAN, UDP, IP, MAC is 50 bytes.

References:

- [VxLAN - Công nghệ ảo hóa DC](https://viblo.asia/p/vxlan-cong-nghe-ao-hoa-dc-1Je5EQLL5nL)

- [Sự tiến hóa của kiến trúc mạng doanh nghiệp & Datacenter (Phần 2)](https://academy.vnnic.vn/blog/su-tien-hoa-cua-kien-truc-mang-doanh-nghiep-datacenter-phan-2)
