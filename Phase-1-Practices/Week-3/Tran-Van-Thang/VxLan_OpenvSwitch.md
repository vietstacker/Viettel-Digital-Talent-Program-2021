# Triển khai thử nghiệm Open vSwitch 
## 1. Chuẩn bị
- 2 VMs chạy Ubuntu sử dụng chế độ bridge network trên virtual box
- Mỗi Vm cài các package sau : qemu-kvm, libvirt-bin, bridge-utils, virtinst, openvswitch-switch, openvswitch-common
- Một Vm cài thêm Wireshark để bắt gói tin trao đổi giữa 2 Vms
## 2. Cấu hình
> Địa chỉ VM1: 192.168.0.110
> Địa chỉ VM2: 192.168.0.111
 - Sau khi cài qemu-kvm và libvirt-bin ta gán quyền:
 ``` 
 sudo adduser `id -un` libvirtd
 sudo adduser `id -un` kvm
```
 - Thiết lập ip_forward trên cả 2 VMs:
 ```
 systemctl net.ipv4.ip_forward=1
 ```
 - Cấu hình 2 bridge br1, br-vxl trên VM1 (enp0s3 là card bridge network ra internet)
  ```
  
# cau hinh br1 lam tunnel endpoint
sudo ovs-vsctl add-br br1
sudo ovs-vsctl add-port br1 enp0s3
sudo ifconfig enp0s3 0
sudo ifconfig br1 192.168.0.110/24

# cau hinh br-vxl tao duong ham ket noi theo giao thuc vxlan
ovs-vsctl add-br br-vxl
ifconfig br-vxl 172.16.1.20/24
ovs-vsctl add-port br-vxl vxl0 -- set interface vxl0 type=vxlan options:remote_ip=192.168.0.111
  ```
  - Tương tự: Cấu hình 2 bridge  br1, br-vxl trên VM2 (enp0s3 là card bridge network ra internet)
 ```
 # cau hinh br1 lam tunnel endpoint
sudo ovs-vsctl add-br br1
sudo ovs-vsctl add-port br1 enp0s3
sudo ifconfig enp0s3 0
sudo ifconfig br1 192.168.0.111/24

# cau hinh br-vxl tao duong ham ket noi theo giao thuc vxlan
ovs-vsctl add-br br-vxl
ifconfig br-vxl 172.16.1.21/24
ovs-vsctl add-port br-vxl vxl0 -- set interface vxl0 type=vxlan options:remote_ip=192.168.0.110
 ```
 
 - Tạo ovs-vxlan.xml trên cả 2 VMs với nội dung như sau:
  ```
    <network>
    <name>ovs-vxl</name>
    <forward mode='bridge'/>
    <bridge name='br-vxl'/>
    <virtualport type='openvswitch'/>
  </network>
  ```
  - Chạy lệnh sau trên cả 2 Vms để tạo network cho bridge:
  ```
   virsh net-define ovsnet.xml
   virsh net-start br0
   virsh net-autostart br0

  ```
  - Chạy lệnh ``` virsh net-list --all ``` để xem bridge có tên là ovs-vxl định nghĩa trong file  ovs-vxlan.xml đã lên thành công chưa
   ![image](https://user-images.githubusercontent.com/43313369/118859205-2ebbcf00-b904-11eb-9b6d-0fbcefb8a16b.png)
   
   **Yeah!**
   
  ## 3. Kiểm tra kết nối
   Từ VM1 ping sang VM2 với địa chỉ ip sử dụng ở bridge
   ``` ping 172.16.1.21  ```  
    Xem gói tin bắt được bởi Wireshark: Ta thấy được rằng, gói tin này có sử dụng giao thức VxLan, port gửi đến là 4789 (port tiếp nhận của Open vSwitch)
    
   ![Capture](https://user-images.githubusercontent.com/43313369/118860514-b2c28680-b905-11eb-84e5-26d127a0707e.PNG)
   
   
   ## 4. Cài đặt máy ảo bên trong VM1 và VM2 để kiểm tra(Đang phát triển ...)

