# setup vxlan using openvswitch on 2 virtual machines

## setup 2VMs 
ip VM1:enp0s3 192.168.1.12 (bridged) </br >
ip VM2:enp0s3 192.168.1.8 (bridged)

### cài đặt ovs
```
$ sudo apt update
$ sudo apt install openvswitch-switch
```

### check status của ovs
```
$ systemctl status ovs-vswitchd
```

![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/Screenshot%202021-05-21%20223726.png)

## VM1:
### cấu hình br01 làm tunnel endpoint (VTEP)
```
$ sudo ovs-vsctl add-br br01
$ sudo ovs-vsctl add-port br01 enp0s3
$ sudo ifconfig enp0s3 0
$ sudo ifconfig br01 192.168.1.12
```

### cấu hình br02 xvlan tunnel
```
$ sudo ovs-vsctl add-br br02
$ sudo ifconfig br02 172.16.10.1/24
$ sudo ovs-vsctl add-port br02 vxlan -- set interface vxlan type=vxlan options:remote_ip=192.168.1.8
```

```
$ sudo ovs-vsctl show
```
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/Screenshot%202021-05-21%20225823.png)

```
$ ifconfig
```
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/ifconfigVM1.png)


## VM2:

### cấu hình tương tự VM1 br01 làm tunnel endpoint (VTEP)
```
$ sudo ovs-vsctl add-br br01
$ sudo ovs-vsctl add-port br01 enp0s3
$ sudo ifconfig enp0s3 0
$ sudo ifconfig br01 192.168.1.8
```

### cấu hình br02 xvlan tunnel
```
$ sudo ovs-vsctl add-br br02
$ sudo ifconfig br02 172.16.10.2/24
$ sudo ovs-vsctl add-port br02 vxlan -- set interface vxlan type=vxlan options:remote_ip=192.168.1.12
```

```
$ sudo ovs-vsctl show
```
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/ovsshowVM2.png)

```
$ ifconfig
```
![](https://raw.githubusercontent.com/toanduc0671/NguyenDucToan_week3/main/image/ifconfigVM2.png)

### ping từ VM1 tới VM2

```
ping -I br02 172.16.10.2
```
# Kết luận:
### Những ưu điểm của VXLAN:
- VXLAN sử dụng 24-bit segment ID (VNID) tương đương với 16 triệu VXLAN segment so với 12-bit VNLAN ID truyền thống. Do vậy điều này sẽ cung cấp đủ không gian để triển khai các quy mô mạng trong nhiều năm tói

- VXLAN có thể mở rộng L2 segment trên một hạ tầng mạng dùng chung. Vì thế một thuê bao có thể chia workload ra nhiều server.




