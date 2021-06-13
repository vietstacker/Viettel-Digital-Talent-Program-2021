


#  Bài tập tuần 5: CI/CD với Jenkins và Gitlab

##  Những thứ cần chuẩn bị : 

[Cài đặt Jenkins](https://www.blazemeter.com/blog/how-to-install-jenkins-on-windows)
Repository trên Gitlab:  [quanndhe130577 / TestCICD · GitLab](https://gitlab.com/quanndhe130577/testcicd)

# Practice 
## Phần 1: Cài đặt plugin Gitlab cho Jenkins
### Bước 1: Mở giao diện Manage Plugins
Tại giao diện jenkins chọn `Manage Jenkins` sau đó chọn `Manage Plugins`

 <img src="img/Cai dat gitlab plugin in Jenkins 1.png">
 
### Bước 2: Instal Plugins GitLab và Gitlab Authentication
Tại giao diện `Managem Plugins`, chọn tab `Available`, sau đó tìm kiếm từ khóa "gitlab"
Sau đó, chúng ta tích vào `Gitlab` và `Gitlab Authentication`, cuối cùng là `Install without restart`
 
 <img src="img/Cai dat gitlab plugin in Jenkins 2.png">

### Bước 3: Restart Jenkins sau khi cài đặt thành công

Tích vào ô `Restart Jenkins when installation is complete and no jobs are running`

 <img src="img/Cai dat gitlab plugin in Jenkins 3.png">

### Bước 4: Tạo pipeline item trên Jenkins

Tại giao diện Dashboard, chọn `New item`, sau đó nhập tên item, chọn `Pipeline` và ấn `OK`

 <img src="img/Cai dat gitlab plugin in Jenkins 4.png">

Tại giao diện `Build Triggers` được mở ra, chúng ta có thể kéo xuống và ấn `Save` luôn

 <img src="img/Cai dat gitlab plugin in Jenkins 5.png">

### Bước 5: Lấy Account token Jenkins

Chọn dấu mũi tên bên cạch Tên username, Chọn `Configuration`
Tại giao diện Configuration, bạn chọn `Add new token`, sau đó nhập tên và nhấn `Generate token`. Token sẽ được generate ngay sau đó

<img src="img/Cai dat gitlab plugin in Jenkins 6.png">

> Hãy copy token, chúng ta sẽ dùng nó để setup trên Giblab server

### Bước 6: Cài đặt Webhook trên Gitlab 

Tại giao diện Dashboard của repository Gitlab, chọn `Setting` và chọn `Webhook`
Tại đây hãy nhập địa chỉ URL theo format sau :

https://NguyenDucQuan:11f0c648d916a771c1c0b3a2b7375c927c@403089abaf50.ngrok.io/project/testCICD

    Trong đó : 
   				NguyenDucQuan: username đăng nhập jenkins
   				11f0c648d916a771c1c0b3a2b7375c927c: mã token đã generate
   				403089abaf50.ngrok.io: địa chỉ jenkins
   				testCICD: tên project vừa tạo ở jenkins	
		
    https://<username Jenkins>:<token>@<jenkins Address>/project/<projectName>

<img src="img/Cai dat gitlab plugin in Jenkins 8.png">

### Bước 7: Lưu cấu hình và test 

Nhấn `Add Webhook`, 1 project webhooks sẽ được tạo ra, chúng ta chọn `Test` và chọn `Push event` để kiểm tra kết nối. Nếu thành công, kết quả sẽ được trả về như sau :

<img src="img/Cai dat gitlab plugin in Jenkins 7.png">

### Bước 8: Build now

Trên giao diện chính Dashboard của pipeline, chúng ta chọn `Build Now`. Sau khi chạy thành công sẽ hiển thị ra thêm một dòng ở `Build History`. Nhận chọn để xem logs quá trình build ở mục `Console Output`

<img src="img/Cai dat gitlab plugin in Jenkins 9.png">