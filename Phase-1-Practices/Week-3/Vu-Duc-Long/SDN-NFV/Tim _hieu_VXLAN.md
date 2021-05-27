# Tìm hiểu về VXLAN
## 1. Tổng quan VXLAN
### 1.1 Đặt vấn đề
- Theo mô hình truyền thống, tất cả các trung tâm dữ liệu data center sử dụng VLAN để cô lập mạng layer 2. Do `data center` ngày càng lớn và cần mở rộng mạng layer 2 thông qua `data center` hoặc ra ngoài `data center` nên những hạn chế của VLAN là có.Ví dụ:
  + Trong `data center`, yêu cầu hàng ngàn VLAN để phân tách các dòng lưu lượng môi trường đa thuê bao cùng chia sẻ kiến trúc mạng L2/L3 trong Cloud Service Provider. Mà VLAN hạn chế 4096 là không đủ.
  + Trong mỗi server ảo, mỗi máy ảo VM yêu cầu 1 địa chỉ MAC và 1 IP riêng biệt. Do đó có hàng ngàn `MAC table entries` trên upstream switches. Đặt ra nhu cầu lớn hơn về dung lượng table của thiết bị chuyển mạch.
  + `VLAN` hạn chế trong vấn đề khoảng cách và triển khai. `VTP` (VLAN Trunking protocol) có thể dùng để triển khai VLAN thông qua L2 switch nhưng VTP cũng có hạn chế.

### 1.2 Khái niệm VXLAN
  - **VXLAN(`Virtual eXtensible LANs`)**: Là giao thức `tunneling`, thuộc lớp 2 và lớp 3.
  - **VXLAN** cung cấp các dịch vụ kết nối các Ethernet end Systems và cung cấp phương tiện mở rộng LAN qua Layer 3.
  - **VLAN 802.1q** dành 12 bit để đánh `VLAN-ID`, trong khi đó **VXLAN** sử dụng 24 bit để đánh địa chỉ `VLAN-ID` => Cung cấp hơn 1 triệu ID duy nhất.
  - **VXLAN** sử dụng IP(gồm cả unicast và multicast) là phương tiện truyền.

### 1.3 Các khái niệm trong VXLAN
#### 1.3.1 VNI
- **VXLAN** hoạt động trên cơ sở hạ tầng mạng hiện có và cung cấp 1 phương tiên để mở rộng mạng Layer 2. Tóm lại **VXLAN** là 1 `mạng lớp 2 overlay trên mạng lớp 3`.
- Mỗi lớp mạng như vậy gọi là **VXLAN segment**.
- Chỉ các máy ảo trong cùng 1 **VXLAN Segment** mới có thể giao tiếp được với nhau.
- Mỗi `VXLAN segment` được xác định thông qua ID kích thước 24 bit, gọi là **VXLAN Network Identifier (VNI)** => Cho phép tối đa 16 triệu các `VXLAN segment` cùng tồn tại cùng 1 domain.
- **VNI** xác định phạm vi của `inner MAC frame` sinh ra bởi máy ảo VM. Do đó có thể `overlapping` địa chỉ MAC thông qua Segment nhưng không bị lẫn lưu lượng bởi chúng bị cô lập bởi các VNI khác nhau.
- **VNI** nằm trong header được đóng gói với `inner MAC` sinh ra bởi VM. 

![](https://github.com/hocchudong/thuctap012017/raw/master/TamNT/Virtualization/images/4.1.png)

#### 1.3.2 Encapsulation và VTEP
- **VXLAN** là giao thức **tunneling**, thuộc lớp 2 và lớp 3.
- **VXLAN** là công nghệ `overlay` qua lớp mạng
- **Encapsulate**: Đóng gói những gói tin Ethernet thông thường trong một header mới. VD: trong công nghệ `overlay IPSec VPN`, đóng gói gói tin IP thông thường vào cùng một IP header khác.
- **VTEP**: việc liên lạc được thiết lập giữa 2 đầu tunnel endpoints.
- Khi áp dụng công nghệ `overlay` trong **VXLAN**, **VXLAN** sẽ đóng gói 1 frame MAC thông thường vào 1 `UDP header`. Và tất cả các host tham gia vào **VXLAN** thì hoạt động như 1 `tunnel endpoints` **(gọi là `Virtual Tunnel Endpoints (VTEPs)`)**
- **VTEPs**: là các node mà cung cấp các chức năng `Encapsulation` và `De-encapsulation`

![](https://github.com/hocchudong/thuctap012017/raw/master/XuanSon/Netowork%20Protocol/images/vxlan-gre_1.png)

- **VXLAN** học tất cả các địa chỉ MAC của máy ảo và việc kết nối nó tới **VTEP IP** được thực hiện thông qua sự hỗ trợ của mạng vật lí.
- Giao thức sử dụng ở đây là **IP multicast**. 

```
IP multicast: là công nghệ truyền thông dựa trên nền tảng IP.
Địa chỉ Multicast được gán cho một nhóm các interface(Thường là các node khác nhau). Các gói tin có địa chỉ multicast sẽ được chuyển tới tất cả các interface có gán địa chỉ multicast này
```
- **VXLAN** sử dụng giao thức của IP multicast để cư trú trong bảng forwarding trong VTEP.
- Do **encapsualtion**, **VXLAN** có thể thiết lập đường hầm (`tunneling`) để mở rộng lớp 2 thông qua lớp 3. Điểm cuối các tunnel này(**VTEP**) nằm trên hypervisor trên server máy chủ của cac VM.

## 2. VLAN packet format

![](https://blogs.vmware.com/vsphere/files/2013/04/Packet-Header.jpg)

### 2.1 Cấu trúc gói tin VXLAN Encapsulation
- Frame Ethernet thông thường bao gồm địa chỉ MAC nguồn, MAC đích, Ethernet type và thêm phần VLAN_ID(Nếu có)

![](https://github.com/hocchudong/thuctap012017/raw/master/XuanSon/Netowork%20Protocol/images/vxlan-gre_3.png)

- Khi sử dụng **VXLAN** thêm các header sau:
   + **VXLAN header**: 8byte
      - **Flags**: 8 bit, trong đó bit thứ `5` được thiết lập là 1 để chỉ ra rằng đó là 1 frame có `VNI` có giá trị.
      - **VNI**: 24 bit cung cấp định danh duy nhất cho VXLAN segment. Các VM trong các VXLAN khác nhau không thể giao tiếp với nhau.
- Ngoài `IP header` và `VXLAN header`, **VTEP** cũng chèn thêm `UDP header`.
- **Outer IP header** chứa địa chỉ Source IP của `VTEP` thực hiện việc `encapsulation`. Destination IP là địa chỉ IP remote VTEP hoặc địa chỉ IP multicast group. 

- **Outer UDP header**: Port nguồn của **Outer UDP** được gán tự động và sinh ra bởi **VTEP** và port đích thông thường được sử dụng là port 4789.

- **Outer Ethernet Header**: cung cấp địa chỉ MAC nguồn của **VTEP**. Địa chỉ MAC đích là địa chỉ `next hop` được định tuyến bởi **VTEP**.

![](https://github.com/hocchudong/thuctap012017/raw/master/XuanSon/Netowork%20Protocol/images/vxlan-gre_4.png)

### 2.2 VXLAN Header

![](https://github.com/hocchudong/thuctap012017/raw/master/XuanSon/Netowork%20Protocol/images/vxlan-gre_5.png)

## 3. Cách hoạt động của VXLAN
- **VXLAN** hoạt động dựa trên việc gửi các frame thông qua giao thức **IP multicast**.
- Trong quá trình cấu hình **VXLAN** cần cấp phát địa chỉ `IP multicast` để gán với VXLAN sẽ tạo. Mỗi địa chỉ `IP multicast` sẽ đại diện cho `1 VXLAN`.

![](https://github.com/hocchudong/thuctap012017/raw/master/TamNT/Virtualization/images/4.4.png)

### 3.1 VM gửi request tham gia vào group multicast
![](https://github.com/hocchudong/thuctap012017/raw/master/TamNT/Virtualization/images/4.5.png)

- Mạng vật lí cung cấp 1 `VLAN 2000` để vận chuyển các lưu lượng **VXLAN**. Trong trường hợp này, chỉ `IGMP snooping` và `IGMP querier` được cấu hình trên mạng vật lí. 

```
IGMP(Internet Group Management Protocol): là một giao thức chuẩn sử dụng bộ giao thức TCP/IP khi thực hiện dynamic multicasting, là giao thức cho phép máy chủ thông báo cho các switches và routers các thành viên nhóm multicast của mình.
```

- **IGMP Packet flows**
  + **VM(MAC1)** trên Host 1 được kết nối tới mạng `logical layer 2` mà có **VXLAN 5001**.
  + **VTEP** trên Host 1 gửi bản tin **IGMP** để join vào mạng và join vào nhóm `multicast 239.1.1.100` để kết nối tới VXLAN 5001.
  + Tương tự **VM(MAC2)** trên Host 4 được kết nối vào mạng có **VXLAN 5001**.
  + **VTEP** trên Host 4 gửi bản tin `IGMP` join vào mạng và join nhóm `multicast 239.1.1.100` để kết nối tới **VXLAN 5001**

![](https://github.com/hocchudong/thuctap012017/raw/master/TamNT/Virtualization/images/4.6.png)

- **Multicast Packet Flow**
  + **VM(MAC1)** trên Host 1 sinh ra 1 frame Broadcast.
  + **VTEP** trên Host 1 đóng gói frame Broadcast này vào 1 `UDP header` với IP đích là địa chỉ Multicast 239.1.1.100.
  + Mạng vật lí sẽ chuyển các gói tin này tới **Host 4 VTEP** vì Host 4 đã join vào Multicast group.
  + **VTEP** trên host 4 sẽ đối chiếu các header được đóng gói, nếu 24 bit `VNI` trùng với ID của VXLAN. Nó sẽ `de-capsulated` lớp gói được **VTEP host 1** đóng gói và chuyển tới máy ảo **VM đích (MAC 2)**.

### 3.2 VTEP học và tạo bảng forwarding
- Ban đầu mỗi **VTEP** sau khi đã join vào nhóm IP multicast đều có 1 bảng forwading table

![](https://github.com/hocchudong/thuctap012017/raw/master/TamNT/Virtualization/images/4.7.png)

- Các bước thực hiện để **VTEP** học và ghi vào bảng forwading table:
  + Đầu tiên, 1 bản tin **ARP Request** được gửi từ **VM(MAC1)** để tìm địa chỉ MAC của máy ảo đích nó cần gửi tin đến **VM(MAC2)** trên Host 2. **ARP request** là bản tin `broadcast`.

![](https://github.com/hocchudong/thuctap012017/raw/master/TamNT/Virtualization/images/4.8.png)

- Host 2 VTEP -Forwarding table entry
  + **VM(MAC1)** gửi bản tin `ARP request` với địa chỉ MAC đích là `FFFFFFFFFFFF`.
  + **VTEP** trên Host 1 đóng gói vào frame `Ethernet Broadcast` vào 1 UDP header với địa chỉ IP đích multicast và địa chỉ IP nguồn 10.20.10.10 của `VTEP`.
  + Mạng vật lí sẽ chuyển gói tin multicast tới các host join vào nhóm `IP multicast 239.1.1.10`
  + **VTEP** trên host 2 nhận được gói tin đã đóng gói. Dựa trên `outer` và `inner` header, nó sẽ tạo 1 entry trong bẳng forwarding chỉ ra mapping giữa MAC của máy `VM(MAC1)` ứng với VTEP nguồn và địa chỉ IP của nó. **VTEP** cũng kiểm tra VNI của gói tin để quyết định sẽ chuyển tiếp gói tin vào trong cho máy ảo VM bên trong nó hay không.
  + Gói tin được `de-encapsulated` và chuyển vào tới VM được kết nối tới **VXLAN 5001**.

- **VTEP** tìm kiếm thông tin trong forwarding table để gửi `unicast` trả lời lại từ **VM(VTEP2)**
![](https://github.com/hocchudong/thuctap012017/raw/master/TamNT/Virtualization/images/4.9.png)

- Máy ảo **VM(MAC2)** trên host 2 đáp trả lại bản tin **ARP request** bằng cách gửi **unicast** lại gói tin với địa chỉ MAC đích là địa chỉ MAC1.
- Sau khi nhận được gói tin đó, **VTEP** trên host 2 thực hiện tìm kiếm thông tin trong bảng forwarding table và lấy được thông tin tương ứng với MAC đích là MAC1. **VTEP** biết phải chuyển gói tin tới máy ảo **VM(MAC1)** bằng cách gửi gói tin tới **VTEP** có địa chỉ 10.20.10.10.
- **VTEP** tạo bản tin unicast với địa chỉ là 10.20.10.10 và gửi nó đi.

- Trên Host 1, **VTEP** sẽ nhận được gói tin unicast và cũng học được vị trí của **MAC2** 

![](https://github.com/hocchudong/thuctap012017/raw/master/TamNT/Virtualization/images/4.10.png)

- Gói tin được chuyển tới Host 1
- **VTEP** trên Host 1 nhận được gói tin. Dựa trên `outer` và `inner` header, nó tạo một entry trong bảng forwarding ánh xạ địa chỉ MAC2 và VTEP trên Host 2. 
- **VTEP** check lại VNI và quyết định gửi frame vào các VM bên trong.
- Gói tin được `de-encapsulated` và chuyển tới chính xác VM có MAC đích trùng và nằm trong **VXLAN 5001** 



## *REFERENCE*:
- https://github.com/hocchudong/ghichep-openvswitch/blob/master/3-ovs-gre-vxlan-lab.md

- https://github.com/hocchudong/thuctap012017/blob/master/XuanSon/Netowork%20Protocol/VXLAN-GRE%20Protocol.md
- https://bizflycloud.vn/tin-tuc/igmp-la-gi-20190820093214726.htm
- https://blogs.vmware.com/vsphere/2013/04/vxlan-series-different-components-part-1.html
- https://blogs.vmware.com/vsphere/2013/05/vxlan-series-multicast-basics-part-2.html
- https://blogs.vmware.com/vsphere/2013/05/vxlan-series-multicast-usage-in-vxlan-part-3.html
- https://blogs.vmware.com/vsphere/2013/05/vxlan-series-multiple-logical-networks-mapped-to-one-multicast-group-address-part-4.html
- https://blogs.vmware.com/vsphere/2013/05/vxlan-series-how-vtep-learns-and-creates-forwarding-table-part-5.html
