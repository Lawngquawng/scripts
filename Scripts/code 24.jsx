var doc = app.activeDocument;
var imageName = doc.name.replace(/\.[^\.]+$/, ''); // Lấy tên file mà không bao gồm phần mở rộng

// Tạo một layer text mới
var textLayer = doc.artLayers.add();
textLayer.kind = LayerKind.TEXT;
textLayer.textItem.contents = imageName; // Gán tên ảnh vào layer text

// Đặt font và kích thước của text (tuỳ chỉnh)
textLayer.textItem.font = "Arial";  // Đặt font chữ (tùy chỉnh)
textLayer.textItem.size = 24;  // Đặt kích thước chữ (tùy chỉnh)


