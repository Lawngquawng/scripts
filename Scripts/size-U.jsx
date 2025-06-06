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
function resizeImage(imageName) {
    var size = findSizeForImage(imageName);
    if (size) {
        var sizeParts = size.split('x');
        var width = parseFloat(sizeParts[0]);
        var height = parseFloat(sizeParts[1]);

        // Kiểm tra chiều lớn nhất của ảnh
        var doc = app.activeDocument;
        var currentWidth = doc.width;
        var currentHeight = doc.height;

        var scaleFactor = 1;

        // So sánh chiều rộng và chiều cao để chọn chiều lớn nhất
        if (currentWidth > currentHeight) {
            scaleFactor = width / currentWidth; // Tính tỷ lệ thay đổi theo chiều rộng
        } else {
            scaleFactor = height / currentHeight; // Tính tỷ lệ thay đổi theo chiều cao
        }

        // Lưu đơn vị hiện tại của tài liệu và thay đổi nó sang inch
        var currentRulerUnits = app.preferences.rulerUnits;  // Lưu đơn vị hiện tại
        app.preferences.rulerUnits = Units.INCHES;  // Đặt đơn vị là inch

        // Thực hiện thay đổi kích thước ảnh
            // Giữ độ phân giải ở 300dpi
            doc.resizeImage(undefined, undefined, 300, ResampleMethod.NONE);

            // Chỉ điều chỉnh chiều ngang
            doc.resizeImage(width, undefined, null, ResampleMethod.BICUBIC);

            // Lấy chiều ngang sau khi chỉnh, tính theo inch
            var newWidthInInches = doc.width.as('in');

            // Chuyển đổi chiều ngang sang mm nếu cần
            var targetWidthInMM = null;
            if (Math.abs(newWidthInInches - 4) < 0.1) {
                targetWidthInMM = 98;
            } else if (Math.abs(newWidthInInches - 6) < 0.1) {
                targetWidthInMM = 148;
            } else if (Math.abs(newWidthInInches - 8) < 0.1) {
                targetWidthInMM = 198;
            } else if (Math.abs(newWidthInInches - 10) < 0.1) {
                targetWidthInMM = 248;
            }

            // Nếu cần chỉnh lại kích thước, thực hiện resize lần nữa
            if (targetWidthInMM !== null) {
                doc.resizeImage(UnitValue(targetWidthInMM, 'mm'), undefined, null, ResampleMethod.BICUBIC);
            }


        // Khôi phục lại đơn vị cũ sau khi chỉnh sửa
        app.preferences.rulerUnits = currentRulerUnits;
    } else {
    }
}

// Lấy tên ảnh của tài liệu đang mở
var docName = app.activeDocument.name.split('.')[0]; // Lấy tên ảnh mà không có phần mở rộng
resizeImage(docName);
