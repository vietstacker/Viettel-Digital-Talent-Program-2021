# Overlay Network
## 1. Giới thiệu
- Trong những năm trở lại đây, các kĩ thuật ảo hóa và cloud trở nên phổ biến hơn. Trong **Virtualization Data Center**, mỗi máy chủ vật lí có thể chạy 1 hoặc nhiều máy chủ ảo dựa trên **hypervisor**.
- Kiến trúc mạng bây giờ yêu cầu kết nối giữa các VM với nhau. Mỗi VM yêu cầu 1 địa chỉ **MAC duy nhất** và `1 địa chỉ IP`.
- Trong **Virtualization Data Center**, các mạng Layer 2 này cần được cô lập thành các mạng riêng biệt, nếu như với môi trường có số lượng `endpoint` nhỏ, VLAN là giải pháp hoàn hảo.
- Tuy nhiên khi số lượng máy ảo trên các máy vật lí càng ngày càng tăng với số lượng lớn theo thời gian => VLAN ID max=4096 không đáp ứng đủ.
- Mặc khác việc di chuyển các máy VM từ máy chủ vật lí này sang máy chủ vật lí khác phải nhanh chóng thuận lợi.
- Để đáp ứng nhu cầu này, các kĩ thuật **network overlay** được ra đời,
- Các kĩ thuật đấy bao gồm: **VXLAN**, **GRE**, **SPBV**,...
![](https://github.com/thangtq710/GRE-VXLAN-protocol/raw/master/images/overlaynetwork.png)

- **Overlay network**: Là công nghệ cho phép tạo ra các mạng ảo (logic network) trên hệ thống mạng vật lí bên dưới (**underlay network**) mà không ảnh hưởng hoặc ảnh hưởng không đáng kể tới hạ tầng mạng bên dưới.
- Ta có thể tạo ra các mạng ảo `Layer 2` trên hạ tầng `Layer 3`

## 2. Cơ chế hoạt động
![](https://github.com/thangtq710/GRE-VXLAN-protocol/raw/master/images/vm-to-vm.png)

- Khi cấu hình overlay network cho mạng ảo, **GRE/VXLAN** tạo nên các **VTEP(Virtual Tunnel Endpoints)**.
- **VTEP** có 2 interface:
  + 1 interface kết nối với mạng IP
  + 1 interface kết nối với các mạng nội bộ cuả các VM.
- Tư tưởng chung của công nghệ như GRE hay VXLAN là khi một mạng overlay được tạo nên thì sẽ có 1 ID duy nhất để định danh cho mạng đó đồng thời được sử dụng để đóng gói lưu lượng (`traffic encapsulation`).
- Mỗi gói tin giữa các VM trên các host vật lí khác nhau được đóng gói trên một host và gửi tới các host khác thông qua **point-to-point GRE** hoặc **VXLAN tunnel**. Khi gói tin tới host đích, các tunnel header sẽ bị loại bỏ (tại tunnel endpoint) và gói tin sẽ được chuyển tiếp tới **bridge** kết nối với VM.

![](https://github.com/thangtq710/GRE-VXLAN-protocol/raw/master/images/image1.png)

- Địa chỉ nguồn và địa chỉ đích trong **Outer IP header** sẽ định danh cho **endpoint(các host tham gia vào VXLAN/GRE)** của tunnel.
- Các địa chỉ IP nguồn và IP đích trong **Inner IP Header** định danh cho các VM gửi và nhận.

## REFERENCE
- https://github.com/thangtq710/GRE-VXLAN-protocol
- 