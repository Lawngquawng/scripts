// Chọn folder chứa ảnh
var selectedFolder = Folder.selectDialog("Chọn folder chứa ảnh");

if (selectedFolder != null) {
    // Lấy tất cả các file ảnh trong thư mục đã chọn
    var files = selectedFolder.getFiles(function(file) {
        return file instanceof File && (file.name.match(/\.(jpg|jpeg|png|bmp)$/i));
    });

    if (files.length > 0) {
        // Duyệt qua từng file ảnh trong thư mục đã chọn
        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            // Kiểm tra xem file có phải là file hợp lệ không
            if (file.exists) {
                // Mở ảnh trong Photoshop
                var doc = open(file);

                // Kiểm tra chiều rộng và chiều cao của ảnh
                var width = doc.width;
                var height = doc.height;

                // Nếu chiều cao lớn hơn chiều rộng, chạy action 1
                if (height > width) {
                    app.doAction("3 layer doc", "shape wood");
                }
                // Nếu chiều rộng lớn hơn chiều cao, chạy action 2
                else if (width > height) {
                    app.doAction("go ngang", "shape wood");
                }
            }
        }
        alert("Đã xử lý xong tất cả ảnh!");
    } else {
        alert("Không tìm thấy ảnh nào trong thư mục.");
    }
} else {
    alert("Bạn chưa chọn thư mục.");
}
