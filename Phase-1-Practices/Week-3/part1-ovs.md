# Week 3 - Part 1

## Mục lục

- [Week 3 - Part 1](#week-3---part-1)
  - [Mục lục](#mục-lục)
  - [I. Overview](#i-overview)
    - [1. VxLAN](#1-vxlan)
      - [a) VxLAN là gì?](#a-vxlan-là-gì)
      - [b) Các khái niệm trong VxLAN](#b-các-khái-niệm-trong-vxlan)
      - [c) Ưu điểm của VxLAN](#c-ưu-điểm-của-vxlan)
      - [d) Nhược điểm của VxLAN](#d-nhược-điểm-của-vxlan)
    - [2. OpenvSwitch](#2-openvswitch)
      - [a) OpenvSwitch là gì](#a-openvswitch-là-gì)
      - [b) Các thành phần chính của OpenvSwitch](#b-các-thành-phần-chính-của-openvswitch)
  - [II. Practicing](#ii-practicing)
    - [Prepare](#prepare)
    - [VM1](#vm1)
      - [br0-VM1](#br0-vm1)
      - [br1-VM1](#br1-vm1)
    - [VM2](#vm2)
      - [br0-VM2](#br0-vm2)
      - [br1-VM2](#br1-vm2)
    - [Testing](#testing)
  - [References](#references)

## I. Overview

### 1. VxLAN

#### a) VxLAN là gì?

VxLAN (Virtual Extensible LAN), được định nghĩa trong RFC 7348 là một công nghệ overlay được thiết kế để cung cấp các dịch vụ kết nối Layer 2 và Layer 3 thông qua mạng IP. Mạng IP cung cấp khả năng mở rộng, hiệu suất cân bằng và khả năng phục hồi khi có lỗi xảy ra. VXLAN đạt được điều này bằng cách tạo các Frames Layer 2 bên trong IP Packets. VXLAN chỉ yêu cầu khả năng giao tiếp IP giữa các thiết bị biên trong mô hình VXLAN, được cung cấp bởi các giao thức định tuyến.

#### b) Các khái niệm trong VxLAN

- **VTEP – Virtual Tunnel Endpoint**: là các thiết bị phần cứng hoặc phần mềm, được đặt ở các vùng biên của mạng, chịu trách nhiệm khởi tạo VXLAN Tunnel và thực hiện đóng gói và giải mã VXLAN
- **VNI – Virtual Network Instance**: là 1 mạng logic cung cấp các dịch vụ lớp 2 hoặc lớp 3, và định nghĩa 1 miền quảng bá lớp 2.
- **VNID – Virtual Network Identifier**: VXLAN ID gồm 24 bit cho phép đánh địa chỉ lên tới 16 triệu mạng logic trong cùng một miền quản trị.
- **Bridge Domain**: bao gồm các cổng vật lý hoặc logic có chung miền quảng bá.

#### c) Ưu điểm của VxLAN

- Mở rộng khả năng phân chia mạng, theo đó `VxLAN` sử dụng 24bit cho `VxLAN ID` (với `VLAN` là 12 bit) --> Chúng ta có hơn 16 triệu `VxLAN ID`.
- Giảm độ trễ truyền tải gói tin trong miền `VxLAN`.
- Không sử dụng `STP` và cho phép `enable ECMP` (Equal-Cost MultiPath) --> Cho phép truyền tải gói tin trên nhiều path.
- Tăng tính linh hoạt cho mạng lưới đáp ứng cho sự linh hoạt của Cloud Platform.
- Mở ra khả năng tích hợp SDN (Software Defined Network) --> Cho phép xây dựng hạ tầng mạng ảo hóa linh hoạt nhất.

#### d) Nhược điểm của VxLAN

- Gói tin được đóng gói sẽ tăng thêm 50 bytes vì vậy sẽ tốn thêm băng thông và giảm hiệu suất khi phải xử lý nhiều hơn.

### 2. OpenvSwitch

#### a) OpenvSwitch là gì

OpenvSwitch (OVS) là một dự án về chuyển mạch ảo đa lớp (multilayer). Mục đích chính của OpenvSwitch là cung cấp lớp chuyển mạch cho môi trường ảo hóa phần cứng, trong khi hỗ trợ nhiều giao thức và tiêu chuẩn được sử dụng trong hệ thống chuyển mạch thông thường. OpenvSwitch hỗ trợ nhiều công nghệ ảo hóa dựa trên nền tảng Linux như Xen/XenServer, KVM, và VirtualBox.

#### b) Các thành phần chính của OpenvSwitch

- **ovs-vswitchd**: thực hiện chuyển đổi các luồng chuyển mạch.
- **ovsdb-server**: là một lightweight database server, cho phép ovs-vswitchd thực hiện các truy vấn đến cấu hình.
- **ovs-dpctl**: công cụ để cấu hình các switch kernel module.
- **ovs-vsctl**: tiện ích để truy vấn và cập nhật cấu hình ovs-vswitchd.
- **ovs-appctl**: tiện ích gửi command để chạy OpenvSwitch.

## II. Practicing

### Prepare

Đầu tiên ta sẽ cài ovs trên cả `VM1` và `VM2` có ip lần lượt là `192.168.1.59` và `192.168.1.60`.

```bash
sudo apt update
sudo apt upgrade
sudo apt install openvswitch-switch
```

Kiểm tra status của ovs

```bash
systemctl status ovs-vswitchd
```

Kết quả kiểm tra

```bash
● ovs-vswitchd.service - Open vSwitch Forwarding Unit
     Loaded: loaded (/lib/systemd/system/ovs-vswitchd.service; static; vendor preset: enabled)
     Active: active (running) since Fri 2021-05-21 09:07:54 UTC; 6s ago
   Main PID: 2166 (ovs-vswitchd)
      Tasks: 1 (limit: 1073)
     Memory: 3.0M
     CGroup: /system.slice/ovs-vswitchd.service
             └─2166 ovs-vswitchd unix:/var/run/openvswitch/db.sock -vconsole:emer -vsyslog:err -vfile:info --mlockall --no->

May 21 09:07:53 vm1 systemd[1]: Starting Open vSwitch Forwarding Unit...
May 21 09:07:53 vm1 ovs-ctl[2151]:  * Inserting openvswitch module
May 21 09:07:53 vm1 ovs-ctl[2126]:  * Starting ovs-vswitchd
May 21 09:07:54 vm1 ovs-vsctl[2175]: ovs|00001|vsctl|INFO|Called as ovs-vsctl --no-wait set Open_vSwitch . external-ids:hos>
May 21 09:07:54 vm1 ovs-ctl[2126]:  * Enabling remote OVSDB managers
May 21 09:07:54 vm1 systemd[1]: Started Open vSwitch Forwarding Unit.
```

### VM1

Đầu tiên, ta sẽ tạo 2 bridges lần lượt là `br0` và `br1`:

```bash
sudo ovs-vsctl add-br br0
sudo ovs-vsctl add-br br1
```

Ta sẽ dùng câu lệnh `ifconfig` và nhận được kết quả:

```bash
enp0s3: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.59  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::a00:27ff:fec9:7109  prefixlen 64  scopeid 0x20<link>
        inet6 2402:800:61b1:ef03:a00:27ff:fec9:7109  prefixlen 64  scopeid 0x0<global>
        inet6 2402:800:61b1:ef03::5  prefixlen 128  scopeid 0x0<global>
        ether 08:00:27:c9:71:09  txqueuelen 1000  (Ethernet)
        RX packets 30102  bytes 41078222 (41.0 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 8372  bytes 776297 (776.2 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 138  bytes 11734 (11.7 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 138  bytes 11734 (11.7 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

#### br0-VM1

Trước tiên ta sẽ config cho `br0`. Ta sẽ thêm `enp0s3` vào `br0`

```bash
sudo ovs-vsctl add-port br0 enp0s3
```

Tiếp tục ta sẽ sửa lại ip của `enp0s3` và cấu hình ip của `VM1` cho `br0`.

```bash
sudo ifconfig enp0s3 0
sudo ifconfig br0 192.168.1.59 netmask 255.255.255.0
```

Sau khi hoàn thành ta sẽ active `br0` và kiểm tra nó ở `ifconfig`

```bash
sudo ip link set br0 up
```

Kết quả kiểm tra:

```bash
br0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.59  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::6c9f:a4ff:fea9:ae47  prefixlen 64  scopeid 0x20<link>
        inet6 2402:800:61b1:ef03:a00:27ff:fec9:7109  prefixlen 64  scopeid 0x0<global>
        inet6 2402:800:61b1:ef03:6490:4261:6e67:2d69  prefixlen 64  scopeid 0x0<global>
        ether 08:00:27:c9:71:09  txqueuelen 1000  (Ethernet)
        RX packets 1524  bytes 123744 (123.7 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1293  bytes 158728 (158.7 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

enp0s3: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet6 fe80::a00:27ff:fec9:7109  prefixlen 64  scopeid 0x20<link>
        inet6 2402:800:61b1:ef03:a00:27ff:fec9:7109  prefixlen 64  scopeid 0x0<global>
        inet6 2402:800:61b1:ef03::5  prefixlen 128  scopeid 0x0<global>
        ether 08:00:27:c9:71:09  txqueuelen 1000  (Ethernet)
        RX packets 32873  bytes 41308019 (41.3 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 11805  bytes 1179257 (1.1 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 144  bytes 13006 (13.0 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 144  bytes 13006 (13.0 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

#### br1-VM1

Tiếp tục, cấu hình cho `br1`

```bash
sudo ifconfig br1 10.1.3.10 netmask 255.255.255.0
```

Ở `br1` ta sẽ cấu hình thêm VxLAN Tunel:

```bash
sudo ovs-vsctl add-port br1 vxlan1 -- set interface vxlan1 type=vxlan options:remote_ip=192.168.1.60
```

**Lưu ý**: Remote_ip sẽ là ip của `VM2`
Active `br1`

```bash
sudo ip link set br1 up
```

Kiểm tra bằng `ipconfig`

```bash
br0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.59  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::6c9f:a4ff:fea9:ae47  prefixlen 64  scopeid 0x20<link>
        inet6 2402:800:61b1:ef03:a00:27ff:fec9:7109  prefixlen 64  scopeid 0x0<global>
        inet6 2402:800:61b1:ef03:6490:4261:6e67:2d69  prefixlen 64  scopeid 0x0<global>
        ether 08:00:27:c9:71:09  txqueuelen 1000  (Ethernet)
        RX packets 4467  bytes 323649 (323.6 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 5114  bytes 606270 (606.2 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

br1: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.1.3.10  netmask 255.255.255.0  broadcast 10.1.3.255
        inet6 fe80::3804:94ff:feed:3d40  prefixlen 64  scopeid 0x20<link>
        ether 3a:04:94:ed:3d:40  txqueuelen 1000  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 8  bytes 656 (656.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

enp0s3: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet6 fe80::a00:27ff:fec9:7109  prefixlen 64  scopeid 0x20<link>
        inet6 2402:800:61b1:ef03:a00:27ff:fec9:7109  prefixlen 64  scopeid 0x0<global>
        inet6 2402:800:61b1:ef03::5  prefixlen 128  scopeid 0x0<global>
        ether 08:00:27:c9:71:09  txqueuelen 1000  (Ethernet)
        RX packets 35816  bytes 41549126 (41.5 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 15630  bytes 1627455 (1.6 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 145  bytes 13140 (13.1 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 145  bytes 13140 (13.1 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

vxlan_sys_4789: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 65000
        inet6 fe80::2021:7ff:fe6c:4ef2  prefixlen 64  scopeid 0x20<link>
        ether 22:21:07:6c:4e:f2  txqueuelen 1000  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1  bytes 56 (56.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

Sau khi cầu hình cho cả `br0` và `br1` ta sẽ xem ở trong `configuration` của `ovs`

```bash
sudo ovs-vsctl show
```

Kết quả:

```bash
275335b9-617b-4fed-ad3b-11f13691db90
    Bridge br0
        Port br0
            Interface br0
                type: internal
        Port enp0s3
            Interface enp0s3
    Bridge br1
        Port vxlan1
            Interface vxlan1
                type: vxlan
                options: {remote_ip="192.168.1.60"}
        Port br1
            Interface br1
                type: internal
    ovs_version: "2.13.1"
```

### VM2

#### br0-VM2

`br0` của `VM2` ta sẽ làm tương tự như ở `br0` của `VM1`

#### br1-VM2

Cấu hình cho `br1`

```bash
sudo ifconfig br1 10.1.3.11 netmask 255.255.255.0
```

Cấu hình thêm VxLAN Tunel:

```bash
sudo ovs-vsctl add-port br1 vxlan1 -- set interface vxlan1 type=vxlan options:remote_ip=192.168.1.59
```

**Lưu ý**: Remote_ip sẽ là ip của `VM2`
Active `br1`

```bash
sudo ip link set br1 up
```

Sau khi hoàn thành ta sẽ kiểm tra `configuration`

```bash
sudo ovs-vsctl show
```

Kết quả:

```bash
195ba824-ae0b-415b-8f5f-a2aa52789c58
    Bridge br0
        Port enp0s3
            Interface enp0s3
        Port br0
            Interface br0
                type: internal
    Bridge br1
        Port vxlan1
            Interface vxlan1
                type: vxlan
                options: {remote_ip="192.168.1.59"}
        Port br1
            Interface br1
                type: internal
    ovs_version: "2.13.1"
```

### Testing

Đầu tiên ta sẽ kiểm tra kết nối từ `VM1` sang `VM2`

```bash
ping -I br1 10.1.3.11
```

Kết quả:

```bash
PING 10.1.3.11 (10.1.3.11) from 10.1.3.10 br1: 56(84) bytes of data.
64 bytes from 10.1.3.11: icmp_seq=1 ttl=64 time=1.44 ms
64 bytes from 10.1.3.11: icmp_seq=2 ttl=64 time=1.83 ms
64 bytes from 10.1.3.11: icmp_seq=3 ttl=64 time=1.21 ms
64 bytes from 10.1.3.11: icmp_seq=4 ttl=64 time=1.65 ms
64 bytes from 10.1.3.11: icmp_seq=5 ttl=64 time=1.97 ms
--- 10.1.3.11 ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 4009ms
rtt min/avg/max/mdev = 1.207/1.620/1.969/0.271 ms
```

Tiếp theo kiểm tra kết nối từ `VM2` sang `VM1`

```bash
ping -I br1 10.1.3.10
```

Kết quả:

```bash
PING 10.1.3.10 (10.1.3.10) from 10.1.3.11 br1: 56(84) bytes of data.
64 bytes from 10.1.3.10: icmp_seq=1 ttl=64 time=1.38 ms
64 bytes from 10.1.3.10: icmp_seq=2 ttl=64 time=0.805 ms
64 bytes from 10.1.3.10: icmp_seq=3 ttl=64 time=1.49 ms
64 bytes from 10.1.3.10: icmp_seq=4 ttl=64 time=1.12 ms
64 bytes from 10.1.3.10: icmp_seq=5 ttl=64 time=1.63 ms
--- 10.1.3.10 ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 4008ms
rtt min/avg/max/mdev = 0.805/1.283/1.626/0.290 ms
```

------------

## References

[VxLAN - Công nghệ ảo hóa DC](https://viblo.asia/p/vxlan-cong-nghe-ao-hoa-dc-1Je5EQLL5nL "VxLAN - Công nghệ ảo hóa DC")

[VXLAN là gì?](https://cnttshop.vn/blogs/tin-tuc/vxlan-la-gi "VXLAN là gì?")

[Cơ bản về Open vSwitch](https://github.com/hocchudong/thuctap012017/blob/master/XuanSon/Virtualization/Virtual%20Switch/Open%20vSwitch/OpenvSwitch_basic.md "Cơ bản về Open vSwitch")

[Connecting VMs Using Tunnels (Userspace)](https://docs.openvswitch.org/en/latest/howto/userspace-tunneling/ "Connecting VMs Using Tunnels (Userspace)")
