# 1. Overview about OpenvSwitch (OVS)

## 1.1. OpenvSwitch là gì?
-  Open vSwitch là phần mềm switch mã nguồn mở hỗ trợ giao thức OpenFlow
- Open vSwitch được sử dụng với các hypervisors để kết nối giữa các máy ảo trên một host vật lý và các máy ảo giữa các host vật lý khác nhau qua mạng.
- Open vSwitch cũng được sử dụng trên một số thiết bị chuyển mạch vật lý (Ví dụ: switch Pica8)
- Open vSwitch là một trong những thành phần quan trọng hỗ trợ SDN (Software Defined Networking - Công nghệ mạng điều khiển bằng phần mềm)
## 1.2 Tính năng:

- Hỗ trợ VLAN tagging và chuẩn 802.1q trunking
- Hỗ trợ STP (spanning tree protocol 802.1D)
- Hỗ trợ LACP (Link Aggregation Control Protocol)
- Hỗ trợ port mirroring (SPAN/RSPAN)
- Hỗ trợ Flow export (sử dụng các giao thức sflow, netflow)
- Hỗ trợ các giao thức đường hầm (GRE, VXLAN, IPSEC tunneling)
- Hỗ trợ kiểm soát QoS
- Cấu hình cơ sở dữ liệu với C và Python.

# 2. Cấu hình OvS.

