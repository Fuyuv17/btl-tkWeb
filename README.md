[README.md](https://github.com/user-attachments/files/33004012/README.md)
# Bài tập lớn Thiết Kế Web

🔴***TUYỆT ĐỐI KHÔNG ĐƯỢC PUSH THẲNG VÀO MAIN MÀ PHẢI TẠO NHÁNH PUSH LÊN NHÁNH RỒI TẠO PULL REQUEST***🔴


Lưu ý: tất cả các ảnh đều dùng dạng \*.webp hãy dùng công cụ nào đấy để convert sang, chúc may mắn

**LINK HƯỚNG DẪN COMMIT CHUẨN** --- [Tài liệu](https://devops.vn/posts/cach-viet-git-commit-convention-chuan-chinh-lam-code-sach-doi-lam-drama/#:~:text=%C4%90%C3%A2y%20l%C3%A0%20b%E1%BB%99%20quy%20t%E1%BA%AFc%20chu%E1%BA%A9n%20h%C3%B3a%20c%C3%A1ch,CI%2FCD%2C%20changelog%20generator%20ho%E1%BA%A1t%20%C4%91%E1%BB%99ng%20m%C6%B0%E1%BB%A3t%20m%C3%A0%20h%C6%A1n.)

**HƯỚNG DẪN SỬ DỤNG GIT** --- [Link Github](https://gist.github.com/antruongnguyen/6bb4ebbcb8ad3608eeddff97ca615c47)


**LINK TRA CỨU CSS**  ----   [W3schools](https://www.w3schools.com/css/default.asp)
## Hướng dẫn đóng góp dự án

1. **Clone repository**: Clone dự án từ repository bằng lệnh:

   ```bash
   git clone <repository-url>
   ```

2. **Tạo nhánh mới**: Tạo một nhánh mới để làm việc, **khi có bất kì tính năng nào mới thì tạo nhanh mới và nhớ pull lại code**:

   ```bash
   git checkout -b <branch-name>
   ```

3. **Thêm code**: Thực hiện các thay đổi cần thiết trong mã nguồn.

   Code vào cái phần đã comment trong code, ngoài ra đối với file css và js thì mỗi phần một file riêng và cách đặt tên classname, id thì đã phổ biến như hôm bữa, còn tên file thì chính là tên của phần mình làm.

4. **Chạy**: Test thử trên localhost xem chạy được ổn vấn đề gì không để fix

5. **Commit thay đổi**: Lưu các thay đổi vào Git:

   ```bash
   git add .
   git commit -m "Mô tả thay đổi"
   ```

6. **Push lên repository**: Đẩy nhánh mới lên repository:

   ```bash
   git push origin <branch-name>
   ```

7. **Tạo Pull Request**: Truy cập repository trên GitHub/GitLab và tạo một Pull Request để yêu cầu review code.

## Cấu trúc thư mục
``` python
src
|- assets\          # chứa font, ảnh
|      |
|      |-images\    # chứa ảnh
|      |     |-<HoVaTen_MSV>
|      |             # tạo folder chứa ảnh là tên của mình kèm msv
|      |
|      |-fonts\     # chứa fonts
|
|- styles\          # chứa các file css
|
|
|- js\              # chứa các file scripts
|
|
|- pages\            # nơi chứa các page chính
|
|- index.html       # trang chính
|- .gitignore       # file .gitignore và README không đụng vào  
|- README.md 
```

## ***Cấu trúc folder***

- Tạo folder thì nhớ tạo theo kiểu **HoVaTen_msv** để dễ quản lí

- Đặt tên ID hoặc class thì nhớ đặt theo cấu trúc

<br>



