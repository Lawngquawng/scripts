// Khai báo tài liệu hiện tại
var doc = app.activeDocument;

// Đặt đơn vị là cm để xử lý
app.preferences.rulerUnits = Units.CM;

// Lấy tên file mà không bao gồm phần mở rộng
var imageName = doc.name.replace(/\.[^\.]+$/, '');

// Tạo một layer text mới
var textLayer = doc.artLayers.add();
textLayer.kind = LayerKind.TEXT;

// Gán tên ảnh vào layer text
textLayer.textItem.contents = imageName;

// Đặt font và kích thước của text (tùy chỉnh)
textLayer.textItem.font = "Arial"; // Font chữ
textLayer.textItem.size = 18;      // Kích thước chữ

// Rasterize layer (loại raster hóa cụ thể)
doc.activeLayer = textLayer;
textLayer.rasterize(RasterizeType.ENTIRELAYER);

// Đổi tên layer thành "code"
textLayer.name = "code";
