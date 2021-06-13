## Practice Jenkins CI example and Write CD Pipeline  

## 1. Máy chủ Web server    
**1. Tổng quan**  
* Web server là một máy tính lưu trữ những nội dung web.*  
* Một máy chủ web dùng để phục vụ các trang web trên mạng internet hoặc mạng nội bộ.*  
* Nó lưu trữ các pages, scripts, progarms hay các files multimedia và sử dụng giao thức HTTP để gửi các tệp đến trình duyệt web.*  

**2. Cách thức hoạt động**  
![image](https://user-images.githubusercontent.com/46991949/121111392-fb9c9980-c838-11eb-8832-6daa20d082f1.png)
* Ví dụ người dùng muốn xem một trang web như www.google.com, người dụng nhập url vào trình duyệt web với điều kiện người dùng cần kết nối Internet. Khi đó bộ giao thức TCP/IP được sử dụng để thiết lập kết nối.*  
* Khi kết nối được thiết lập, máy khách sẽ gửi một yêu cầu thông qua HTTP và chờ phản hồi từ máy chủ. Phía bên kia máy chủ nhận được yêu cầu, xử lý yêu cầu, gửi lại phản hồi cho máy khách.*  

## 2. CI/CI  
**CI/CD là gì**  
CI/CD là một bộ đôi công việc, bao gồm CI (Continuous Integration) và CD (Continuous Delivery), ý nói là quá trình tích hợp (integration) thường xuyên, nhanh chóng hơn khi code cũng như thường xuyên cập nhật phiên bản mới (delivery).  

**Quy trình CI/CD tham khảo**  
![image](https://user-images.githubusercontent.com/46991949/121673654-50f7d580-cadb-11eb-92c5-fae1a63f3f06.png)

Dưới đây là các bước thông thường của quá trình release tính năng trong một dự án    
* Bước 1: Khởi tạo repository và có branch default là master và dev    
* Bước 2: Trừ owner ra, thì các coder sẽ push code tính năng lên branch dev    
* Bước 3: [Auto] Hệ thống tự động thực hiện test source code, nếu PASS thì sẽ deploy tự động (rsync) code lên server beta.  
* Bước 4: Tester/QA sẽ vào hệ thống beta để làm UAT (User Acceptance Testing) và confirm là mọi thứ OK.  
* Bước 5: Coder hoặc owner sẽ vào tạo Merge Request, và merge từ branch dev sang branch master.  
* Bước 6: Owner sẽ accept merge request.  
* Bước 7: [Auto] Hệ thống sẽ tự động thực hiện test source code, nếu PASS sẽ enable tính năng cho phép deploy lên production server.  
* Bước 8: Owner review là merge request OK, test OK. Tiến hành nhấn nút để deploy các thay đổi lên môi trường production.  
* Bước 9: Tester/QA sẽ vào hệ thống production để làm UAT và confirm mọi thứ OK. Nếu không OK, Owner có thể nhấn nút Deploy phiên bản master trước đó để rollback hệ thống về trạng thái stable trước đó.      

## 3. Chuẩn bị  
**Cài đặt docker**  
**Cài đặt docker-Compose**  

## 4. Triển khai CI/CD với Jenkins  

**Step 1: Setup Server**  
Tạo file docker-compose.yaml trong thư mục ~/app với nội dung như sau:  
```version: "3"
services:
  frontend:
    image: ${FRONTEND_IMAGE}
    ports:
      - 80:80
  ```  
  
**Step 2: Install Jenkins**  
  Chạy command sau để install trên local  
  ```docker run \
  -u root \
  --rm \
  -d \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins-data:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkinsci/blueocean
  ```  
  Sau đó bạn truy cập Jenkins qua url http://localhost:8080/ và làm theo hướng dẫn https://jenkins.io/doc/book/installing/#setup-wizard để hoàn thành quá trình setup    
  **Lưu ý ở đây, để có thể lấy được initialAdminPassword bạn có thể làm như sau**    
  Lấy CONTAINER ID bằng cách ```docker ps -a```    
  Sau đó dùng lệnh ```docker container exec -it CONTAINER ID bash```  
  Cuối cùng ```cat /var/jenkins_home/secrets/initialAdminPassword```    
  Và copy đoạn mã doán vào đây:  
  ![image](https://user-images.githubusercontent.com/46991949/121709738-0e49f380-cb03-11eb-945a-a06874980118.png)  
  
  Sau khi đã tạo tài khoản người dùng đầu tiên, đăng nhập, giao diện Jenkins lúc này sẽ là  
  ![image](https://user-images.githubusercontent.com/46991949/121710839-2c642380-cb04-11eb-8d6d-c6c492ce5427.png)  
  
**Step 3: Tạo Jenkins Pipeline**  
Tại main menu của Jenkins bạn click New Item, khai báo job name và chọn type là Pipeline và click OK.  
Tại page config của job bạn chọn tab Pipeline và khai báo như hình:  
![image](https://user-images.githubusercontent.com/46991949/121712222-b2cd3500-cb05-11eb-93a3-a92b886c9cbf.png)
Sau khi hoàn tất thì click save để lưu thông tin job   

**Step 4: Setup Jenkins Pipeline**  
Thông tin pipeline được lưu trong file Jenkinsfile ở repository tutorial-jenkins-pipeline. Pipeline của chúng ta sẽ được chia thành 3 stage:  
1. Build Code (checkout source code về và build code js)  
2. Build Image (build image mới và push lên Docker Hub)  
3. Deploy (deploy image mới lên server)  

Trong file Jenkinsfile chỉnh sửa
```environment {
 FRONTEND_GIT = 'https://github.com/Hanh09031998/tutorial-jenkins-frontend.git'
 FRONTEND_BRANCH = 'master'
 FRONTEND_IMAGE = 'Hanh09031998/tutorial-jenkins-frontend'
 FRONTEND_SERVER = '1.2.3.4'
}
```  
Trong đó:   
* FRONTEND_GIT: URL của git lưu source code react  
* FRONTEND_BRANCH: Tên branch của source code muốn build  
* FRONTEND_IMAGE: Tên image tương ứng với repository mà bạn đã tạo trên Docker Hub  
* FRONTEND_SERVER: IP của server sẽ dùng để deploy app  
* Bạn khai báo các thông tin này theo thông tin tương ứng của bạn.   

Để có thể ssh vào server thông qua jenkins thì bạn cần install plugin SSH Pipeline Steps và tạo 1 credential với kind là SSH Username with private key và ID là ssh  
![image](https://user-images.githubusercontent.com/46991949/121718022-06428180-cb0c-11eb-92fb-e62d30ae4722.png)  

Tiếp theo mình sẽ mở giao diện blue ocean
![image](https://user-images.githubusercontent.com/46991949/121718272-56b9df00-cb0c-11eb-9335-b38e6db3eb54.png)  

![image](https://user-images.githubusercontent.com/46991949/121718463-8bc63180-cb0c-11eb-8186-887e36f77a96.png)




 







  
  
  

