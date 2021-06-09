## Setup OpenStack AIO inside VM with Kolla ##  

*Môi trường*  
*1. Hệ điều hành: Ubuntu 18.04, Ram: 4G,SSD CPU:02*  
*Network*
* NAT: enp0s3 10.0.2.15
* Bridgr Adapter: enp0s8 : 192.168.0.114
* Host-only Adapter: enp0s9: 192.168.56.101

**Step 1: Cài đặt các gói yêu cầu bắt buộc trên ubuntu 18.04**    

1. Cập nhật và nâng cấp các gói  
```sudo apt update``` 
```sudo apt upgrade```  
2. Cài đặt gói yêu cầu  
```sudo apt install python3-dev python3-venv libffi-dev gcc libssl-dev git```  
3. Cài đặt môi trường ảo để triển khai Kolla-ansible. Để tránh xung đột giữa các gói hệ thống và các gói Kolla-ansible  
```python3 -m venv $ HOME / kolla-openstack```  
Kích hoạt môi trường  
```source $HOME/kolla-openstack/bin/activate```  
4. Nâng cấp pip  
```pip install -U pip```  

**Step 2: Cài đặt Ansible trên Ubuntu 18.04**  
1. cài đặt Ansible. Kolla yêu cầu ít nhất Ansible 2.8 trở lên đến 2.9  
```pip install 'ansible<2.10'```  
2. Tạo một tệp cấu hình có thể nghe được trên thư mục chính của bạn với các tùy chọn sau  
```vim $HOME/ansible.cfg```  
Nội dung của file ansible.cfg  
```[defaults]
host_key_checking=False
pipelining=True
forks=100
```  

**Step 3: Cài đặt Kolla-ansible trên Ubuntu 18.04**  

1. Cài đặt Kolla-ansible trên Ubuntu 18.04 bằng cách sử dụng pip từ môi trường ảo ở trên  
2. Tiến hành cài đặt  
```pip install kolla-ansible```  

**Step 4: Định cấu hình Kolla-ansible cho Triển khai OpenStack**  

1. Tạo thư mục cấu hình Kolla  
```sudo mkdir etc/kolla```  
2. Cấp quyền sở hữu thư mục cấu hình Kolla cho người dùng mà bạn đã kích hoạt môi trường ảo triển khai Koll-ansible  
```sudo chown $USER:$USER /etc/kolla```  
3. Sao chép perfals.yml và mật khẩu.yml vào thư mục / etc / kolla  
```cp -r venv/share/kolla-ansible/etc_examples/kolla/* /etc/kolla```  
4. Sao chépall-in-one vào thư mục hiện tại  
```cp venv/share/kolla-ansible/ansible/inventory/* .```  
5. Cấu hình mạng  
```nano /etc/kolla/globals.yml``` 
Trong file globals.yml  
```kolla_base_distro: "ubuntu"
kolla_install_type: "source"
kolla_internal_vip_address: "10.0.2.15"
network_interface: "enp0s3"
neutron_external_interface: "enp0s8"
nova_compute_virt_type: "qemu"
enable_haproxy: "no"
enable_cinder: "yes"
enable_cinder_backup: "no"
enable_cinder_backend_lvm: "yes"
```  
6. Tạo mật khẩu Kolla  
passwords.yml Tệp cấu hình Kolla lưu trữ các mật khẩu dịch vụ OpenStack khác nhau. Bạn có thể tự động tạo mật khẩu bằng cách sử dụng Kolla-ansible kolla-genpwdtrong môi trường ảo của mình.  
```kolla-genpwd```  
Tất cả các mật khẩu đã tạo sẽ được điền vào /etc/kolla/passwords.yml  

**Step 5: Triển khai OpenStack tất cả trong một với Kolla-Ansible trên Ubuntu 18.04**  

1. Khởi động cấu hình localhost của bạn trước khi triển khai vùng chứa bằng bootstrap-serverslệnh con  
```kolla-ansible -i all-in-one bootstrap-servers```  
![image](https://user-images.githubusercontent.com/46991949/120992840-30fba580-c7ad-11eb-927c-f502e7855c0c.png)  
2. Thực hiện kiểm tra trước khi triển khai cho các máy chủ  
```kolla-ansible -i all-in-one prechecks```  
![image](https://user-images.githubusercontent.com/46991949/120998267-2099f980-c7b2-11eb-9fbb-e422f28a30a5.png)

3. Kéo hình ảnh vào máy ảo  
```kolla-ansible -i all-in-one pull```    
![image](https://user-images.githubusercontent.com/46991949/120998415-46270300-c7b2-11eb-8a96-4d396df9c84f.png)  
4. Cuối cùng tiến hành triển khai OpenStack thực tế  
```kolla-ansible -i all-in-one deploy```  
![image](https://user-images.githubusercontent.com/46991949/120998530-6060e100-c7b2-11eb-8050-6671c62344ba.png)
5. Tạo tài khoản người dùng  
Tài khoản:
Người dùng: admin
Mật khẩu:
Chạy:
```cat /etc/kolla/passwords.yml | grep -i keystone_admin_password```  
![image](https://user-images.githubusercontent.com/46991949/121219015-7acbb500-c8ad-11eb-962a-5dc90e3d4b14.png)
![image](https://user-images.githubusercontent.com/46991949/121219070-84551d00-c8ad-11eb-8e7a-6b532152d202.png)

