#target photoshop
app.displayDialogs = DialogModes.NO;

// Kích thước cố định (đổi nếu cần)
var fixedWidth = 1536;
var fixedHeight = 1536;

// Chọn thư mục chứa ảnh
var inputFolder = Folder.selectDialog("Chọn thư mục chứa các ảnh cần resize");

if (inputFolder != null) {
    // Lấy danh sách file ảnh trong thư mục
    var files = inputFolder.getFiles(/\.(jpg|jpeg|png|tif|tiff|bmp)$/i);

    if (files.length === 0) {
        alert("Không tìm thấy ảnh hợp lệ trong thư mục.");
    } else {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            if (file instanceof File) {
                var doc = open(file);

                // Resize ảnh
                doc.resizeImage(
                    UnitValue(fixedWidth, "px"),
                    UnitValue(fixedHeight, "px"),
                    null,
                    ResampleMethod.BICUBIC
                );

                // Lưu lại và đóng
                doc.save();
                doc.close(SaveOptions.SAVECHANGES);
            }
        }

    }
} else {
    alert("Bạn chưa chọn thư mục.");
}
