# setup vxlan using openvswitch on 2 virtual machines

## setup 2VMs 
ip VM1:enp0s3 192.168.1.12 (bridged) </br >
ip VM2:enp0s3 192.168.1.8 (bridged)

### Topo
````
VM 1                                                           VM 2

+--------------+                                    +--------------+
|      br1     |                                    |      br1     |
|   10.1.2.10  |                                    |   10.1.2.11  |
+--------------+                                    +--------------+
|    vxlan     |                                    |    vxlan     |
+--------------+                                    +--------------+
       |                                                    |
       |                                                    |
       |                                                    |
+---------------+                                   +---------------+
| br0  (enp0s3) |                                   | br0  (enp0s3) |
| 192.168.1.7   |                                   |  192.168.1.14 |
+---------------+                                   +---------------+
        |                                                  |
        ----------------------------------------------------
````


### cài đặt ovs
```
$ sudo apt update
$ sudo apt install openvswitch-switch
```

### check status của ovs
```
$ systemctl status ovs-vswitchd
```

![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/systemctl.png)

## VM1:
### cấu hình br0 làm tunnel endpoint (VTEP)
```
$ sudo ovs-vsctl add-br br0
$ sudo ovs-vsctl add-port br0 enp0s3
$ sudo ifconfig enp0s3 0
$ sudo ifconfig br0 192.168.1.7
```

### cấu hình br1 xvlan tunnel
```
$ sudo ovs-vsctl add-br br1
$ sudo ifconfig br02 10.1.2.10/24
$ sudo ovs-vsctl add-port br1 vxlan -- set interface vxlan type=vxlan options:remote_ip=192.168.1.14
```

```
$ sudo ovs-vsctl show
```
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/show.png)

```
$ ifconfig
```
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/ifconfigVM2.png)


## VM2:

### cấu hình tương tự VM1 br01 làm tunnel endpoint (VTEP)
```
$ sudo ovs-vsctl add-br br0
$ sudo ovs-vsctl add-port br0 enp0s3
$ sudo ifconfig enp0s3 0
$ sudo ifconfig br0 192.168.1.14
```

### cấu hình br1 xvlan tunnel
```
$ sudo ovs-vsctl add-br br1
$ sudo ifconfig br1 10.1.2.11/24
$ sudo ovs-vsctl add-port br1 vxlan -- set interface vxlan type=vxlan options:remote_ip=192.168.1.7
```

```
$ sudo ovs-vsctl show
```
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/show2.png)

## **Kết quả**

### ping từ VM1 tới VM2

```bash
$ ping -I br1 10.1.2.11
```
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/pingbr1.png)

### tcpdump
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/tcpdump.png)

### wireshark
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/wireshark.png)

# Kết luận:
### Những ưu điểm của VXLAN:
- VXLAN sử dụng 24-bit segment ID (VNID) tương đương với 16 triệu VXLAN segment so với 12-bit VNLAN ID truyền thống. Do vậy điều này sẽ cung cấp đủ không gian để triển khai các quy mô mạng trong nhiều năm tói

- VXLAN có thể mở rộng L2 segment trên một hạ tầng mạng dùng chung. Vì thế một thuê bao có thể chia workload ra nhiều server.
- Tính transparent: cung cấp mạng ảo trong suốt với hạ tầng mạng underlay
- Tính isolate: tách biệt các mạng ảo với nhau, giảm BUM traffic
### Nhược điểm của Vxlan
- Gói tin được đóng gói thêm nhiều layer, kích thước tăng lên gây giảm hiệu năng mạng:  tiêu tốn thêm tài nguyên xử lý, giảm băng thông truyền tải
- Cấu hình phức tạp hơn mạng vlan
- Troubleshoot khó hơn do tính transparent
- Khó tích hợp với các thiết bị mạng truyền thống không hỗ trợ vxlan



