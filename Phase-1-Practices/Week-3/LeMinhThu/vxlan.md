# Openvswitch and VXLAN

## Practice 1&2

#### Network Topology Diagram

![image](https://user-images.githubusercontent.com/83031380/119137379-f4207680-ba6a-11eb-8936-b41f5aab8aba.png)

1. Update *apt*

```
sudo apt update
sudo apt upgrade
```

2. Install *net-tools*, *wireshark*, *tcpdump*

```
sudo apt install net-tools
sudo apt install tcpdump
sudo apt install wireshark
```

3. Install *openvswitch*

```
sudo apt install openvswitch-switch
```

4. Check status of openvswitch

```
systemctl status ovs-vswitchd
```
![image](https://user-images.githubusercontent.com/83031380/119126205-ecf26c00-ba5c-11eb-9a54-c399f3bd13fb.png)

![image](https://user-images.githubusercontent.com/83031380/119126230-f67bd400-ba5c-11eb-9e68-329546d2cb4c.png)
5. Configuration for Host 1

* Add 2 new bridges: br0 and br1

```
$sudo ovs-vsctl add-br br0
$sudo ovs-vsctl add-br br1
```

* Enclose enp0s3 to br0

```
$sudo ovs-vsctl add-port br0 enp0s3
```

* Disable enp0s3

```
$sudo ifconfig enp0s3 0
```

* Use ifconfig to configure IP for br0

```
$sudo ifconfig br0 192.168.56.102 netmask 255.255.255.0
```

* Modify default gateway

```
$sudo route add default gw 192.168.56.1 br0
```

* Use ifconfig to configure IP for br1

```
$sudo ifconfig br1 10.1.2.10 netmask 255.255.255.0
```

* Configure VXLAN tunnel for br1

```
$sudo ovs-vsctl add-port br1 gre1 -- set interface gre1 type=gre options:remote_ip=192.168.56.103
``` 

![image](https://user-images.githubusercontent.com/83031380/119128026-4cea1200-ba5f-11eb-93f1-58c8d5a244e8.png)

6. Configuration for Host 2 (sinmilar to host 1)

```
$sudo ovs-vsctl add-br br0
$sudo ovs-vsctl add-br br1
$sudo ovs-vsctl add-port br0 enp0s3
$sudo ifconfig enp0s3 0 
$sudo ifconfig br0 192.168.56.103 netmask 255.255.255.0
$route add default gw 192.168.56.1 br0
$ifconfig br1 10.1.2.11 netmask 255.255.255.0
$ovs-vsctl add-port br1 gre1 -- set interface gre1 type=gre options:remote_ip=192.168.56.102
```
![image](https://user-images.githubusercontent.com/83031380/119128919-76576d80-ba60-11eb-9f0a-ec5507c65ca9.png)

## Practice 3

* On host 2: ping to host 1

```
ping -I br1 10.1.2.10
```

* On host 1 : Captures & write data packets to vxlan.pcap

```
$ sudo tcpdump -i any -c 10 -nn -s 0 -w vxlan.pcap
```
**-i**: choose interface

**-c**: to limit the number of packets captured and stop *tcpdump*

**-nn**: disable name resolution by using the option and port resolution

**-s**: limit snaplen

**-w**: write to file

![image](https://user-images.githubusercontent.com/83031380/119129678-6b510d00-ba61-11eb-98f5-043772f59eb0.png)

* Open wireshark to view vxlan.pcap

```
$wireshark
```

* Open vxlan.pcap

![image](https://user-images.githubusercontent.com/83031380/119130054-e61a2800-ba61-11eb-9329-1e8b534820a9.png)

### Practice 4

#### Advantages

* **VLAN flexibility in multitenant segments**: It provides a solution to extend Layer 2 segments over the underlying network infrastructure so that tenant workload can be placed across physical pods in the data center.

* **Higher scalability**: VXLAN uses a 24-bit segment ID known as the VXLAN network identifier (VNID), which enables up to 16 million VXLAN segments to coexist in the same administrative domain.

* **Improved network utilization**: VXLAN solved Layer 2 STP limitations. VXLAN packets are transferred through the underlying network based on its Layer 3 header and can take complete advantage of Layer 3 routing, equal-cost multipath (ECMP) routing, and link aggregation protocols to use all available paths.

* **Mobility**: Allow VM mobility, independent of the physical network configuration. 

#### Disadvantages

* **Complexity**: Virtual and physical networks are separate entities, possibly with separate service assurance solutions, policy management, provisioning, and control points

* **Performance reduction**: The protocol adds an additional layer of packet processing, which requires adding and then removing protocol headers, so that’s some extra work for the CPU

## References

<https://www.enterprisenetworkingplanet.com/standards-protocols/vxlan-beyond-the-hype/>

<https://www.ciscopress.com/articles/article.asp?p=2999385&seqNum=3>

<http://networkstatic.net/configuring-vxlan-and-gre-tunnels-on-openvswitch/>

<https://opensource.com/article/18/10/introduction-tcpdump>

Github