# Triển khai thử nghiệm Open vSwitch 
## 1. Chuẩn bị
- 2 VMs chạy Ubuntu sử dụng chế độ bridge network trên virtual box
- Mỗi Vm cài các package sau :  bridge-utils, virtinst, openvswitch-switch, openvswitch-common
- Một Vm cài thêm Wireshark để bắt gói tin trao đổi giữa 2 Vms
## 2. Cấu hình
> Địa chỉ VM1: 192.168.0.110
> Địa chỉ VM2: 192.168.0.111
![image](https://user-images.githubusercontent.com/43313369/118998614-c9271b80-b9b3-11eb-9dde-e68b42f29dc8.png)


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
  
   virsh net-define ovs-vxlan.xml
   virsh net-start ovs-vxl
   virsh net-autostart ovs-vxl


  ```
  - Chạy lệnh ``` virsh net-list --all ``` để xem bridge có tên là ovs-vxl định nghĩa trong file  ovs-vxlan.xml đã lên thành công chưa
   ![image](https://user-images.githubusercontent.com/43313369/118859205-2ebbcf00-b904-11eb-9b6d-0fbcefb8a16b.png)
   
   **Yeah!**
   
  ## 3. Kiểm tra kết nối
   Từ VM1 ping sang VM2 với địa chỉ ip sử dụng ở bridge
   ``` ping 172.16.1.21  ```  
    Xem gói tin bắt được bởi Wireshark: Ta thấy được rằng, gói tin này có sử dụng giao thức VxLan, port gửi đến là 4789 (port tiếp nhận của Open vSwitch)
    
   ![Capture](https://user-images.githubusercontent.com/43313369/118860514-b2c28680-b905-11eb-84e5-26d127a0707e.PNG)
   
   
   ## 4. Ưu và nhược điểm khi triển khai VxLan trong DataCenter
   - Ưu điểm:
      - Tính isolate: tách biệt các mạng ảo với nhau
      - Không gian địa chi VxLan là 24 bit so với 12 bit của VLAN 
   - Nhược điểm:
      -  Header phải thêm 50 byte dữ liệu làm tăng kích thước gói tin -> tốn băng thông
      -  Khó tích hợp với các thiết bị mạng truyền thống không hỗ trợ vxlan
  ## 5. Tài liệu tham khảo 
  -  Giải thích Linux Network Namespaces: https://www.youtube.com/watch?v=_WgUwUf1d34&t=1s
  -  Giải thích về Overlay Network:  https://www.youtube.com/watch?v=Jqm_4TMmQz8
  -  Bài lab của ``` hocchudong ```: https://github.com/hocchudong/ghichep-openvswitch/edit/master/3-ovs-gre-vxlan-lab.md
  -  Trang giải thích quá trình kết nối 2 Vm qua VxLAN: https://www.arista.com/en/solutions/vxlan-cloud-scale-datacenter#:~:text=VXLAN%20is%20a%20powerful%20tool,residing%20on%20foreign%20IP%20subnets.
  

