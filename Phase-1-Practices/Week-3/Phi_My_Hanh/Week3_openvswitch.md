Use openvswitch to setup Vxlan network between 2 virtual machines
Giới thiệu chung về VXLAN

Virtual Extensible LAN (VXLAN) là giao thức tunneling, thuộc giữa lớp 2 và lớp 3.

VXLAN là giao thức sử dụng UDP (cổng 4789) để truyền thông và một segment ID độ dài 24 bit còn gọi là VXLAN network identifier (VNID). Chỉ các máy ảo trong cùng VXLAN segment mới có thể giao tiếp với nhau..

VXLAN ID (VXLAN Network Identifier hoặc VNI) là 1 chuỗi 24-bits so với 12 bits của của VLAN ID. Do đó cung cấp hơn 16 triệu ID duy nhất ( giá trị này của VLAN: 4096 ).

VXLAN frame format:

image

Frame Ethernet thông thường bao gồm địa chỉ MAC nguồn, MAC đích, Ethernet type và thêm phần VLAN_ID (802.1q) nếu có. Đây là frame được đóng gói sử dụng VXLAN, thêm các header sau:

VXLAN header: 8 byte bao gồm các trường quan trọng sau:

Flags: 8 but, trong đó bit thứ 5 (I flag) được thiết lập là 1 để chỉ ra rằng đó là một frame có VNI có giá trị. 7 bit còn lại dùng dữ trữ được thiết lập là 0 hết.

VNI: 24 bit cung cấp định danh duy nhất cho VXLAN segment. Các VM trong các VXLAN khác nhau không thể giao tiếp với nhau. 24 bit VNI cung cấp lên tới hơn 16 triệu VXLAN segment trong một vùng quản trị mạng.

Outer UDP Header: port nguồn của Outer UDP được gán tự động và sinh ra bởi VTEP và port đích thông thường được sử dụng là port 4789 hay được sử dụng (có thể chọn port khác).

Outer IP Header: Cung cấp địa chỉ IP nguồn của VTEP nguồn kết nối với VM bên trong. Địa chỉ IP outer đích là địa chỉ IP của VTEP nhận frame.

Outer Ethernet Header: cung cấp địa chỉ MAC nguồn của VTEP có khung frame ban đầu. Địa chỉ MAC đích là địa chỉ của hop tiếp theo được định tuyến bởi VTEP.

Chuẩn bị
image

Topology:
Host 1: 192.168.1.2
vswitch br1: 10.0.1.10
vswitch br0: 192.168.1.2 enp0s3

Host 2: 192.168.1.227
vswitch br1: 10.0.1.11
vswitch br0: 192.168.1.227 enp0s3 image

Mô tả:
Dưới đây mình sẽ thực hiện 1 bài lab sử dụng vmware để chạy 2 máy ảo host1, host2 đóng vai trò như các node vật lí trong thực tế.
Trên 2 host này, sẽ được cài hệ điều hành Ubuntu Destop 18.04, cài sẵn các phần mềm Open vSwitch, KVM với QEMU, libvirt-bin để tạo các vm. 2 host này đều sủ dụng card mạng ens33 ( coi như là card mạng vật lý).
Dùng wireshark để bắt và phân tích gói tin VXLAN
Cấu hình:
Tạo 2 vSwitch br0 và br1 trên cả 2 host.
Cấu hình chế độ mạng bridge cho vSwitch br1 và card mạng ens33 trên cả 2 host.
Trên HOST 1, tạo VM1(cirros1) kết nối với vSwitch br0. Trên HOST 2 tạo VM2(cirros2) kết nối với vSwitch br0.
Step 1. Open vSwitch và KVM trên cả 2 Host

sudo apt-get install qemu-kvm libvirt-bin ubuntu-vm-builder bridge-utils
sudo apt install net-tools
sudo apt-get install openvswitch-switch -y
libvirtd --version
image
Step 2. Tạo 2 vswitch br0 và br1 trên cả 2 Host
sudo ovs-vsctl add-br br0
sudo ovs-vsctl add-br br1

Step 3. Bật 2 vswitch trên cả 2 Host
sudo ip link set dev br0 up
sudo ip link set dev br1 up

Step 4. Trên host1 tạo chế độ mạng bridge cho vswitch br0 và card mạng enp0s3 image

sudo ovs-vsctl add-port br0 enp0s3
sudo ifconfig enp0s3 0 && sudo ifconfig br0 192.168.1.2/24
Note: Nếu muốn xóa một cổng để khôi phục lại có thể dùng: sudo ovs-vsctl del-port br1 enp0s3

Step 5. Trên host2 tạo chế độ mạng bridge cho vswitch br0 và card mạng enp0s3
sudo ovs-vsctl add-port br0 enp0s3
sudo ip a flush enp0s3 && sudo ifconfig br0 192.168.1.2/24

Step 6. Cấu hình IP cho br1 trên Host

Trên host1 sudo ifconfig br1 10.1.1.10/24
Trên host2 sudo ifconfig br1 10.1.1.11/24
Step 8. Cấu hình VXLAN tunnel cho vswitch br0 trên host

Trên host1 sudo ovs-vsctl add-port br1 vxlan1 -- set interface vxlan1 type=vxlan option:remote_ip=192.168.1.227
image
Cấu hính mạng lúc này
image

Trên host2
sudo ovs-vsctl add-port br1 vxlan1 -- set interface vxlan1 type=vxlan option:remote_ip=192.168.1.2
image
Cấu hình mạng lúc này
image

Step 9. Check connection to other node via VXLAN with Ping

Từ host1. Sử dụng câu lệnh ping -I br1 10.1.1.11 để ping sang host2
image image

Ưu nhược điểm của việc sử dụng mạng Vxlan trong trung tâm dữ liệu

Ưu điểm:
Tăng khả năng mở rộng: Trên thực tế, VLAN chỉ cung cấp tối đa 4095 phân đoạn khả thi nhưng VXLAN có thể đạt tới 16 triệu với VNI 24bit.
Tăng khả năng di chuyển: Các máy đó có thể được di chuyển từ một mạng con trên một máy chủ sang một máy chủ khác có mạng con khác trong khi IP của nó vẫn không thay đổi.
Đáp ứng được nhu cầu xử lý lưu lương dữ liệu lớn trong môi trường Datacenter/Cloud mà vẫn giữ được đăc tính của VLAN truyền thống.
Tận dụng tốt hơn các kết nối mạng khả dụng trong cơ sở hạ tầng bên dưới: Các gói tin VXLAN được truyền qua các lớp mạng dựa vào thông tin trong Header cùng giao thức định tuyến của Lớp 3 để sử dụng tất cả các kết nối sẵn có.
Giảm độ trễ truyền tải gói tin trong miền VxLAN.
Nhược điểm
Phức tạp về việc cấu hình và quản lý.
Gói tin được đóng gói thêm nhiều layer, kích thước tăng lên gây giảm hiệu năng mạng: tiêu tốn thêm tài nguyên xử lý, giảm băng thông truyền tải
Cấu hình phức tạp hơn mạng vlan
Troubleshoot khó hơn do tính transparent
Khó tích hợp với các thiết bị mạng truyền thống không hỗ trợ vxlan