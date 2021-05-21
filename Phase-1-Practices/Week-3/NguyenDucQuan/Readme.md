
#  Bài tập tuần 3: Openvswitch

##  Những thứ cần chuẩn bị trước : 
### 1. 2 Ubuntu Virtual Machine ( máy chủ ảo Ubuntu ):
1. Ubuntu1
2. Ubuntu2
### 3. Cài đặt các gói cần thiết :
```
 $ sudo apt install qemu qemu-kvm libvirt-clients libvirt-daemon-system virtinst bridge-utils 
```
### 4. Cài đặt wireshark lên máy chủ Ubuntu1

    $ sudo apt-get install wireshark

# Practice 
## Bước 1: Cài đặt Openswitch lên 2 máy chủ
```
$ sudo apt install openvswitch-switch
```
Sau khi cài đặt trong, chúng ta kiểm tra lại bằng câu lệnh :
```
$ systemctl status ovs-vswitchd
```
### Bước 2: Tạo 2 bridge lên mỗi máy chủ
```
$ sudo ovs-vsctl add-br br1
$ sudo ovs-vsctl add-br br-vxl
```
### Bước 3: Add port cho bridge br1 cho mỗi máy chủ
Chúng ta sử dụng port "*enp0s3*" cho cẩ 2 máy chủ
#### Với máy chủ Ubuntu1
```
$ sudo ovs-vsctl add-port br1 enp0s3
$ sudo ifconfig br1 192.168.1.3
```
#### Với máy chủ Ubuntu2
```
$ sudo ovs-vsctl add-port br1 enp0s3
$ sudo ifconfig br1 192.168.1.4
```

> Note: IP set cho 2 bridge phải trên cùng 1 dải mạng

### Bước 4: Add port và tạo interface cho bridge br-vxl cho mỗi máy chủ
#### Với máy chủ Ubuntu1
```
$ sudo ifconfig br-vxl 10.1.3.10
$ sudo ovs-vsctl add-port br-vxl vxlan0 -- set interface vxlan0 type=vxlan options:remote_ip=192.168.1.4
```

> Note: remote_ip là địa chị IP đã set cho br1 của máy chủ Ubuntu2
#### Với máy chủ Ubuntu2
```
$ sudo ifconfig br-vxl 10.1.3.12
$ sudo ovs-vsctl add-port br-vxl vxlan0 -- set interface vxlan0 type=vxlan options:remote_ip=192.168.1.3
```
> Note: remote_ip là địa chị IP đã set cho br1 của máy chủ Ubuntu1
### Bước 5: Kiểm tra Bridge:
Dùng câu lệnh sau để kiểm tra
```
$ sudo ovs-vsctl show
```
Ta sẽ có kết quả thành công như sau :
<img src="./img/kiemTraBridge.png">
### Bước 6: Ping để chuyền dữ liệu từ Ubuntu1 đến Ubuntu2 
```
  $ ping -I br1 10.1.3.12
```
> Note: Địa chỉ IP ở đây là địa chỉ IP đã set cho Bridge br-vxl của máy chủ 2
Ta cùng có thể ping ngược lại từ Ubuntu2 đến Ubuntu 1 bằng cách thay địa chỉ IP br-vxl của máy chủ 1
### Bước 7: Dùng wireshark để bắt gói dữ liệu
Mở phần mềm wireshark, và chọn bridge *"br-vxl*"
<img src="./img/chonBridgeTrongWS.png">
Sau đó chúng ta sẽ thấy được các gói tin được chuyền từ IP 10.1.3.10 đến 10.1.3.12 và ngược lại
Kết quả nhận được như sau:
<img src="./img/resultWS.png">

## Mô hình đã sử dụng : 

## Ưu nhược điểm của việc sử dụng mạng Vxlan trong trung tâm dữ liệu

### 1. Ưu điểm:

* Mở rộng khả năng phân chia mạng: Vxlan sử dụng 24-bit cho Vxlan ID ( với VLAN là 12-bit) => có hơn 16 triệu VxLan ID

* Không sử dụng STP và kích hoạt ECMP  -> cho phép truyền gói tin trên nhiều đường dẫn

* Khả năng tích hợp SDN -> Cho phép xây dựng hạ tầng mạng ảo hóa linh hoạt

* VXLAN cho phép mở rộng mạng L2 qua bất lỳ mạng L3 nào

* VXLAN sử dụng IP như phương tiện truyền. Sự phổ biến của mạng IP và các thiết bị đầu cuối sẽ cho phép khả năng mở rộng vượt trội hơn nhiều so với VLAN.

### 2. Nhược điểm

* Phức tạp về việc cấu hình và quản lý.
* Tăng kích thước gói và giảm hiệu suất.