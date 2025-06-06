// Chức năng đọc dữ liệu từ file size.txt
function readSizeFromFile() {
    var appdata = $.getenv("APPDATA"); // Lấy biến môi trường %APPDATA%
    var sizeFile = new File(appdata + "/LQ_library/size.txt");

    if (sizeFile.exists && sizeFile.open("r")) {
        var content = sizeFile.read();
        sizeFile.close();
        return content.split('\n');
    } else {
        alert("Không thể mở file size.txt trong " + sizeFile.fsName);
        return [];
    }
}

// Hàm tìm kích thước tương ứng với tên ảnh
function findSizeForImage(imageName) {
    var sizeData = readSizeFromFile();
    for (var i = 0; i < sizeData.length; i++) {
        var line = sizeData[i]; // Không thực hiện trim
        var parts = line.split('_');
        if (parts.length === 2 && parts[0] === imageName) {
            return parts[1]; // Trả về kích thước nếu tìm thấy
        }
    }
    return null; // Không tìm thấy kích thước
}

// Hàm chỉnh kích thước ảnh
// Hàm chỉnh kích thước ảnh
function resizeImage(imageName) {
    var size = findSizeForImage(imageName);
    if (size) {
        var sizeParts = size.split('x');
        var height = parseFloat(sizeParts[0]); // Chiều cao (H)
        var width = parseFloat(sizeParts[1]); // Chiều rộng (W)

        // Lấy giá trị lớn nhất giữa H và W
        var maxSize = Math.max(height, width);

        // Lấy tài liệu hiện tại trong Photoshop
        var doc = app.activeDocument;
        var currentWidth = doc.width;
        var currentHeight = doc.height;

        // Tính tỷ lệ để điều chỉnh kích thước ảnh
        var scaleFactor;
        if (currentWidth > currentHeight) {
            scaleFactor = maxSize / currentWidth; // Tỷ lệ theo chiều rộng
        } else {
            scaleFactor = maxSize / currentHeight; // Tỷ lệ theo chiều cao
        }

        // Lưu đơn vị hiện tại của tài liệu và thay đổi sang inch
        var currentRulerUnits = app.preferences.rulerUnits; // Lưu đơn vị hiện tại
        app.preferences.rulerUnits = Units.INCHES; // Đặt đơn vị là inch

        // Thực hiện thay đổi kích thước ảnh
        doc.resizeImage(undefined, undefined, 300, ResampleMethod.NONE); // Giữ độ phân giải ở 300dpi
        if (currentHeight > currentWidth) {
            // Điều chỉnh chiều cao để khớp kích thước lớn nhất
            doc.resizeImage(undefined, maxSize, null, ResampleMethod.BICUBIC);
        } else {
            // Điều chỉnh chiều rộng để khớp kích thước lớn nhất
            doc.resizeImage(maxSize, undefined, null, ResampleMethod.BICUBIC);
        }

        // Khôi phục lại đơn vị cũ sau khi chỉnh sửa
        app.preferences.rulerUnits = currentRulerUnits;
    } else {
        alert("Không tìm thấy kích thước tương ứng cho ảnh: " + imageName);
    }
}



// Lấy tên ảnh của tài liệu đang mở
var docName = app.activeDocument.name.split('.')[0]; // Lấy tên ảnh mà không có phần mở rộng
resizeImage(docName);
