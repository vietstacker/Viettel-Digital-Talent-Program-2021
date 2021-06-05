# Cài đặt OpenStack All In One bằng Kolla-Ansible
- [Cài đặt OpenStack All In One bằng Kolla-Ansible](#cài-đặt-openstack-all-in-one-bằng-kolla-ansible)
  - [I.Yêu cầu](#iyêu-cầu)
    - [1. Kiến thức](#1-kiến-thức)
    - [2. Cấu hình](#2-cấu-hình)
  - [II. Các bước tiến hành](#ii-các-bước-tiến-hành)
    - [1. Chuẩn bị](#1-chuẩn-bị)
    - [2. Cấu hình OpenStack All In One](#2-cấu-hình-openstack-all-in-one)
    - [3. Cài đặt OpenStack All In One](#3-cài-đặt-openstack-all-in-one)
    - [4. Cài đặt OpenstackClient](#4-cài-đặt-openstackclient)
  - [III. Các lỗi gặp phải](#iii-các-lỗi-gặp-phải)
  - [IV. Tài liệu tham khảo](#iv-tài-liệu-tham-khảo)
## I.Yêu cầu

### 1. Kiến thức

- Kiến thức cơ bản về `ansible`( ansible.cfg, inventory, playbook, ...)
- Kiến thức về `docker`( images, containers, volume, ...)
- Có khả năng đoán vấn đề vì nhiều lỗi tra google sẽ chưa có hoặc khó tìm

### 2. Cấu hình

|         | Đề xuất | Cấu hình của mình |
| ------- | ------- | ---------------- |
| CPU     | 4 cores | 2 cores          |
| RAM     | 8 GB    | 4 GB             |
| HDD     | 2 Disks | 2 Disks          |
| Network | 2 NICs  | 2 NICs           |

- CPU 2 cores vì có một số vấn đề liên quan đến mariadb cần nhiều hơn 1 core( mình chưa gặp lỗi này trong quá trình cài đặt)
- Cần thêm 1 Disks phục vụ cho Cinder
- 2 NICs:
  - 1 NIC: sử dụng NAT có ip là 10.0.2.15/24 (Địa chi giao tiếp với OpenStack)
  - 1 NIC: sử dụng host only có ip là 192.168.56.105/24( Dải mạng cung cấp ip cho các VM tạo bởi OpenStack)

## II. Các bước tiến hành

### 1. Chuẩn bị

- Cài đặt các package cần thiết

  ```console
  sudo apt update
  sudo apt install python3-dev libffi-dev gcc libssl-dev lvm2
  ```

- Cài đặt `virtualenv` ( Xem thêm tại: [VirtualEnv là gì ?](https://etuannv.com/huong-dan-su-dung-moi-truong-ao-virtual-environments-trong-python/#:~:text=Virtualenv%20l%C3%A0%20c%C3%B4ng%20c%E1%BB%A5%20cho,l%E1%BA%ADp%20cho%20t%E1%BB%ABng%20d%E1%BB%B1%20%C3%A1n.))

```console
sudo apt install python3-venv
python3 -m venv /path/to/venv
source /path/to/venv/bin/activate
```

---

**Bạn có thể thay đổi `/path/to/venv` thành đường dẫn bạn muốn**

---

- Cài đặt thêm các package cần thiết( Đang ở trong môi trường ảo)

```console
pip install 'ansible==2.9'
pip install kolla-ansible
```

**_NOTE:_** Nếu có lỗi với pip bạn có thể cài đặt theo cách dưới đây

```console
curl https://bootstrap.pypa.io/pip/{version-python-của-bạn}/get-pip.py -o get-pip.py
python3 get-pip.py --force-reinstall
```

- Copy các file đã có cấu hình sẵn của kolla-ansible ra một folder `/etc/kolla`

```console
sudo mkdir -p /etc/kolla
sudo chown $USER:$USER /etc/kolla
cp -r /path/to/venv/share/kolla-ansible/etc_examples/kolla/* /etc/kolla
cp /path/to/venv/share/kolla-ansible/ansible/inventory/* .
```

### 2. Cấu hình OpenStack All In One

- Tạo file chứa mật khẩu

```console
kolla-genpwd
```

- Tạo phân vùng cho Cinder

```console
pvcreate /dev/vdb
vgcreate cinder-volumes /dev/vdb
```

- Thêm các cấu hình vào file `/etc/kolla/globals.yml`

```console
kolla_base_distro: "ubuntu"
kolla_install_type: "source"

network_interface: enp0s3
neutron_external_interface: enp0s8
kolla_internal_vip_address: 10.0.2.15

nova_compute_virt_type: "qemu"

enable_haproxy: "no"

enable_cinder: "yes"
enable_cinder_backup: "no"
enable_cinder_backend_lvm: "yes"

```

---

**NOTE**

- network_interface: interface giữ ip 10.0.2.15 giao tiếp với các thành phần của openstack
- neutron_external_interface: interface cung cấp ip cho các VM được tạo sau này
- kolla_internal_vip_address: địa chỉ ip giao tiếp với các thành phần của openstack, config trường này sẽ giúp tránh khỏi lỗi khi mariadb kết nối với ha proxy
- Xem thêm: `https://github.com/openstack/kolla-ansible/blob/master/etc/kolla/globals.yml`

---

### 3. Cài đặt OpenStack All In One

- Khởi tạo môi trường dành cho Openstack Kolla

```console
kolla-ansible -i all-in-one bootstrap-servers
```

- Kiểm tra thiết lập Kolla Ansible

```console
kolla-ansible -i all-in-one prechecks
```

- Tải các image cần thiết về( Chạy khá lâu do phải tải nhiều images docker về)

```console
kolla-ansible -i all-in-one pull
```

- deploy( chạy lâu hơn cả bước trước do phải chạy nhiều containers, kích hoạt nhiều dịch vụ)

```console
kolla-ansible -i all-in-one deploy
```

- post-deploy

```console
kolla-ansible -i all-in-one post-deploy
```

> Trong quá trình chạy các câu lệnh trên bị lỗi, nếu muốn làm lại thì hãy thay đổi các file cấu hình, xóa volume bằng cách `docker volume rm $(docker volume ls -q) ` và xóa các container bằng cách `docker rm -f $(docker ps -a -q) `

### 4. Cài đặt OpenstackClient

- Cài đặt các package cần thiết

```console
pip install python-openstackclient python-glanceclient python-neutronclient
```

- Chạy script sau để lấy cấu hình:

```console
source /etc/kolla/admin-openrc.sh
```

- Kiểm tra dịch vụ:

```console
openstack token issue
```

Kết quả như hình sau là thành công!
![status](https://user-images.githubusercontent.com/43313369/119268118-b4e55780-bc1b-11eb-9b11-ff6c6ae22d22.PNG)


- Lấy mật khẩu để đăng nhập tài khoản admin:

```console
cat /etc/kolla/passwords.yml | grep keystone_admin
```

> Sau đó bạn có thể dùng tên đăng nhập là `admin`, mật khẩu vừa lấy được vào trang web `http://10.0.2.15/auth/login/?next=/` Hoặc bạn có thể sử dụng port-forwarding sang máy vật lý bạn đang chạy. Bạn có thể làm theo hình dưới, sau đó truy cập `http://localhost:48080/auth/login/?next=/`

![portforwing](https://user-images.githubusercontent.com/43313369/119268129-bca4fc00-bc1b-11eb-99e2-ebebbe7c63d0.PNG)


> Đăng nhập thành công!

![dashboard](https://user-images.githubusercontent.com/43313369/119268135-c0d11980-bc1b-11eb-8c3d-a91a32e31ec3.PNG)

> Tạo một instance sau khi tải image lên và tạo network, tạo flavor public

![image](https://user-images.githubusercontent.com/43313369/119270648-eb28d400-bc27-11eb-91f9-a1016d525820.png)



## III. Các lỗi gặp phải

- Not found pip2

    Lỗi này mình xử lý bằng cách xóa hoàn toàn pip mặc định python2.7 của ubuntu đi bằng cách ```console sudo apt-get --purge autoremove python3-pip``` sau đó ở các playbook nó sẽ tự động cài thêm pip
- Lỗi treo playbook khi đến task haproxy kết nối với mariadb lúc deploy, mặc dù đã config `enable_haproxy: "no"` trong file `/etc/kolla/globals.yml`

    Lỗi này mình xử lý bằng cách thêm `kolla_internal_vip_address: 10.0.2.15` vào `/etc/kolla/globals.yml`

- Sẽ cập nhật thêm khi mình cài lại tiếp ...


## IV. Tài liệu tham khảo

- [Docs kolla-ansible](https://docs.openstack.org/kolla-ansible/latest/user/quickstart.html)
- [Hướng dẫn cài đặt Openstack Train all-in-one bằng Kolla Ansible](https://news.cloud365.vn/openstack-kolla-phan-1-huong-dan-cai-dat-openstack-train-all-in-one-bang-kolla-ansible/)
- [Bài hướng dẫn của meobilivang trên github](https://github.com/meobilivang/Phase-1-Training-VTDT-VTNET/blob/master/Week%203/Openstack/README.md)
