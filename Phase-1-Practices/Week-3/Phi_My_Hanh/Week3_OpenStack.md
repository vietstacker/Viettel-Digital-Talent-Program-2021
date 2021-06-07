Setup OpenStack AIO inside VM with Kolla
Môi trường
1. Hệ điều hành: Ubuntu 18.04, Ram: 4G,SSD CPU:02
Network

NAT: enp0s3 10.0.2.15
Bridgr Adapter: enp0s8 : 192.168.0.110
Host-only Adapter: enp0s9: 192.168.56.101
**Step 1: Cài đặt các gói yêu cầu bắt buộc trên ubuntu 18.04

Cập nhật và nâng cấp các gói
sudo apt update sudo apt upgrade
Cài đặt gói yêu cầu
sudo apt install python3-dev python3-venv libffi-dev gcc libssl-dev git
Cài đặt môi trường ảo để triển khai Kolla-ansible. Để tránh xung đột giữa các gói hệ thống và các gói Kolla-ansible
python3 -m venv $ HOME / kolla-openstack
Kích hoạt môi trường
source $HOME/kolla-openstack/bin/activate
Nâng cấp pip
pip install -U pip
Step 2: Cài đặt Ansible trên Ubuntu 18.04

cài đặt Ansible. Kolla yêu cầu ít nhất Ansible 2.8 trở lên đến 2.9
pip install 'ansible<2.10'
Tạo một tệp cấu hình có thể nghe được trên thư mục chính của bạn với các tùy chọn sau
vim $HOME/ansible.cfg
Nội dung của file ansible.cfg
host_key_checking=False
pipelining=True
forks=100
Step 3: Cài đặt Kolla-ansible trên Ubuntu 18.04

Cài đặt Kolla-ansible trên Ubuntu 18.04 bằng cách sử dụng pip từ môi trường ảo ở trên
Tiến hành cài đặt
pip install kolla-ansible
Step 4: Định cấu hình Kolla-ansible cho Triển khai OpenStack

Tạo thư mục cấu hình Kolla
sudo mkdir etc/kolla
Cấp quyền sở hữu thư mục cấu hình Kolla cho người dùng mà bạn đã kích hoạt môi trường ảo triển khai Koll-ansible
sudo chown $USER:$USER /etc/kolla
Sao chép tệp cấu hình Kolla chính globals.ymlvà tệp mật khẩu dịch vụ OpenStack passwords.ymlvào thư mục cấu hình Kolla ở trên từ môi trường ảo
sudo cp $HOME/kolla-openstack/share/kolla-ansible/etc_examples/kolla/* /etc/kolla/
Cấu hình mạng
nano /etc/kolla/globals.yml Trong file globals.yml
kolla_install_type: "source"

network_interface: enp0s8
neutron_external_interface: enp0s3
kolla_internal_vip_address: 192.168.0.110

nova_compute_virt_type: "qemu"

enable_haproxy: "no"

enable_cinder: "yes"
enable_cinder_backup: "no"
enable_cinder_backend_lvm: "yes"
Tạo mật khẩu Kolla
passwords.yml Tệp cấu hình Kolla lưu trữ các mật khẩu dịch vụ OpenStack khác nhau. Bạn có thể tự động tạo mật khẩu bằng cách sử dụng Kolla-ansible kolla-genpwdtrong môi trường ảo của mình.
kolla-genpwd
Tất cả các mật khẩu đã tạo sẽ được điền vào /etc/kolla/passwords.yml
Step 5: Triển khai OpenStack tất cả trong một với Kolla-Ansible trên Ubuntu 18.04

Khởi động cấu hình localhost của bạn trước khi triển khai vùng chứa bằng bootstrap-serverslệnh con
kolla-ansible -i all-in-one bootstrap-servers
image

Thực hiện kiểm tra trước khi triển khai cho các máy chủ
kolla-ansible -i all-in-one prechecks
image

Kéo hình ảnh vào máy ảo
kolla-ansible -i all-in-one pull
image

Cuối cùng tiến hành triển khai OpenStack thực tế
kolla-ansible -i all-in-one deploy
image

Tạo tài khoản người dùng
Tài khoản: Người dùng: admin Mật khẩu: Chạy: cat /etc/kolla/passwords.yml | grep -i keystone_admin_password
image