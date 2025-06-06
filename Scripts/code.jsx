// Khai báo tài liệu hiện tại
var doc = app.activeDocument;

// Chiều cao bổ sung, tính bằng cm
var additionalHeight = 2;

// Đặt đơn vị là cm để xử lý
app.preferences.rulerUnits = Units.CM;

// Tính chiều cao mới cho canvas
var newCanvasHeight = doc.height + additionalHeight;

// Mở rộng canvas, giữ gốc là trung tâm bên dưới
doc.resizeCanvas(doc.width, newCanvasHeight, AnchorPosition.BOTTOMCENTER);

// Lấy tên file mà không bao gồm phần mở rộng
var imageName = doc.name.replace(/\.[^\.]+$/, '');

// Tạo một layer text mới
var textLayer = doc.artLayers.add();
textLayer.kind = LayerKind.TEXT;

// Gán tên ảnh vào layer text
textLayer.textItem.contents = imageName;

// Đặt font và kích thước của text (tùy chỉnh)
textLayer.textItem.font = "Arial"; // Font chữ
textLayer.textItem.size = 24;      // Kích thước chữ

// Rasterize layer (loại raster hóa cụ thể)
doc.activeLayer = textLayer;
textLayer.rasterize(RasterizeType.ENTIRELAYER);

// Đổi tên layer thành "code"
textLayer.name = "code";
