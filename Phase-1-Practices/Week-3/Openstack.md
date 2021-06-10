# Openstack
## Assignment
### Cài đặt openstack trong VM với Kolla

Openstack Kolla là Project hay công cụ sử dụng để triển khai, vận hành Openstack. Kolla được phát hành từ phiên bản Kilo và chính thức trở thành Project Openstack tại phiên bản Liberty.

Với ý tưởng của Project Kolla là triển khai Openstack trong môi trường Container, tự động triển khai Openstack bằng Kolla Ansible

## Chuẩn bị
Chuẩn bị máy ảo với hệ điều hành ubuntu 20.04 với cấu hình:

CPU: 2 Core
RAM: 8 GB
Disk: 2 ổ
ROM: 30Gb

Đối với Debian hoặc Ubuntu, hãy cập nhật chỉ mục gói.

`sudo apt update`

Cài đặt các phụ thuộc xây dựng Python:

Đối với Debian hoặc Ubuntu:

`sudo apt install python3-dev libffi-dev gcc libssl-dev`

# Cài đặt các phụ thuộc không sử dụng môi trường ảo

 Đối với Debian hoặc Ubuntu, hãy chạy:

`sudo apt install python3-pip`

![188953577_2965512200388825_6395705550299506536_n](https://user-images.githubusercontent.com/83824403/119860334-69df8300-bf40-11eb-8f6b-a65b0cfd9ede.png)


 Đảm bảo phiên bản mới nhất của pip được cài đặt:

`sudo pip3 install -U pip`

![186570748_475764706993033_3484475883689029825_n](https://user-images.githubusercontent.com/83824403/119860173-43b9e300-bf40-11eb-96dd-418b3205aec4.png)


##### Cài đặt Ansible . Kolla Ansible yêu cầu ít nhất Ansible 2.9và hỗ trợ tối đa 2.10.

`sudo apt install ansible`

## Cài đặt Kolla-ansible 

`sudo pip3 install kolla-ansible`

`sudo mkdir -p /etc/kolla`

`sudo chown $USER:$USER /etc/kolla` 

 Sao chép globals.ymlvà passwords.ymlvào /etc/kollathư mục

`cp -r /usr/local/share/kolla-ansible/etc_examples/kolla/* /etc/kolla`

 Sao chép all-in-onevà multinodekiểm kê tệp vào thư mục hiện tại.

`cp /usr/local/share/kolla-ansible/ansible/inventory/* .`


Sao chép kolla và kolla-ansible

`git clone https://github.com/openstack/kolla`

`git clone https://github.com/openstack/kolla-ansible`

`sudo pip3 install ./kolla`

`sudo pip3 install ./kolla-ansible`

![189206422_1008754846324674_6066017709538070172_n](https://user-images.githubusercontent.com/83824403/119860053-2a189b80-bf40-11eb-8db6-c7713316c433.png)


Tạo /etc/kollathư mục.

`sudo mkdir -p /etc/kolla`

`sudo chown $USER:$USER /etc/kolla`


## Cài đặt Openstack Train bằng Kolla Ansible

Kiểm tra xem cấu hình có đúng hay không

`ansible -i multinode all -m ping`

![187807086_228193868728789_7811915297871413168_n](https://user-images.githubusercontent.com/83824403/119859943-0bb2a000-bf40-11eb-95f1-028788812bad.png)


Tạo File chứa mật khẩu mặc định

`kolla-genpwd`

Để build

`cd kolla-ansible/tools
./generate_passwords.py` 


 Khởi tạo môi trường dành cho Openstack Kolla

``
kolla-ansible -i all-in-one bootstrap-servers
``

Kiểm tra thiết lập Kolla Ansible

`
kolla-ansible -i all-in-one prechecks
`

`
kolla-ansible -i all-in-one pull
`

`
kolla-ansible -i all-in-one deploy
`

Đến đoạn này thì em đang gặp lỗi, em đang cố gắng fix ạ :<< 
