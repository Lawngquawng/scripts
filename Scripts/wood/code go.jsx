// Lưu lại cài đặt đơn vị ban đầu
var originalUnits = app.preferences.rulerUnits;

try {
    app.preferences.rulerUnits = Units.PIXELS;

    var doc = app.activeDocument;
    var imageName = doc.name.replace(/\.[^\.]+$/, '');

    // Lấy chiều lớn nhất để xác định font size
    var maxDimension = Math.max(doc.width.value, doc.height.value);
    var fontSize;
    if (maxDimension <= 1000) fontSize = 20;
    else if (maxDimension <= 1500) fontSize = 30;
    else if (maxDimension <= 2000) fontSize = 35;
    else if (maxDimension <= 3000) fontSize = 45;
    else if (maxDimension <= 4000) fontSize = 60;
    else if (maxDimension <= 5000) fontSize = 75;
    else fontSize = 80;

    // Tạo text layer
    var textLayer = doc.artLayers.add();
    textLayer.kind = LayerKind.TEXT;
    textLayer.textItem.contents = imageName;
    textLayer.textItem.font = "Arial";
    textLayer.textItem.size = fontSize;
    textLayer.name = "code";

    // Đặt màu text là trắng
    var white = new SolidColor();
    white.rgb.red = 255;
    white.rgb.green = 255;
    white.rgb.blue = 255;
    textLayer.textItem.color = white;

    // Tạm thời đặt ở (0,0) để lấy bounds
    textLayer.textItem.position = [0, 0];

    // Lấy kích thước text
    var textBounds = textLayer.bounds; // [left, top, right, bottom]
    var textWidth = textBounds[2].value - textBounds[0].value;
    var textHeight = textBounds[3].value - textBounds[1].value;

    // Tính vị trí căn giữa
    var xPos = (doc.width.value - textWidth) / 2 - textBounds[0].value;
    var yPos = (doc.height.value - textHeight) / 2 + textHeight;

    // Đặt lại vị trí để text nằm giữa
    textLayer.textItem.position = [xPos, yPos];

    // Cập nhật lại bounds sau khi reposition
    textBounds = textLayer.bounds;

    // Tạo layer cho khung
    var rectLayer = doc.artLayers.add();
    rectLayer.name = "khung";

    // Đặt màu foreground là đỏ
    var red = new SolidColor();
    red.rgb.red = 255;
    red.rgb.green = 0;
    red.rgb.blue = 0;
    app.foregroundColor = red;

    // Tính padding khung
    var padding = Math.max(20, fontSize / 2);

    // Vẽ vùng chọn khung quanh text với padding
    doc.selection.select([
        [textBounds[0].value - padding, textBounds[1].value - padding],
        [textBounds[2].value + padding, textBounds[1].value - padding],
        [textBounds[2].value + padding, textBounds[3].value + padding],
        [textBounds[0].value - padding, textBounds[3].value + padding]
    ]);

    // Tô màu khung
    doc.selection.fill(app.foregroundColor);
    doc.selection.deselect();

    // Di chuyển khung xuống dưới text
    rectLayer.move(textLayer, ElementPlacement.PLACEAFTER);

    // Gộp text và khung thành 1 layer
    textLayer.selected = true;
    rectLayer.selected = true;
    doc.activeLayer = textLayer;
    doc.activeLayer.merge();
    doc.activeLayer.name = "code";
// ===== Di chuyển layer đến góc trên trái cách lề 3cm =====

    // Giả sử DPI mặc định là 300 (nếu khác bạn có thể lấy từ doc.resolution)
    var dpi = doc.resolution; // Độ phân giải ảnh hiện tại
    var offset = 1 * (dpi / 2.54); // 3 cm tính ra pixel

    // Lấy lại bounds của layer sau khi merge
    var b = doc.activeLayer.bounds; // [left, top, right, bottom]
    var currentX = b[0].value;
    var currentY = b[1].value;

    // Tính khoảng cách cần di chuyển
    var dx = offset - currentX;
    var dy = offset - currentY;

    // Di chuyển layer
    doc.activeLayer.translate(dx, dy);

} catch (e) {
    alert("Lỗi: " + e.message);
} finally {
    app.preferences.rulerUnits = originalUnits;
}
