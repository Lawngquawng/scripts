// Kiểm tra xem có tài liệu đang mở không
if (app.documents.length > 0) {
    var doc = app.activeDocument;

    // Đảm bảo tài liệu có ít nhất 2 layer
    if (doc.layers.length >= 2) {
        var layer1 = doc.layers[0];
        var layer2 = doc.layers[1];

        // Hàm lấy kích thước layer (width và height tính bằng px)
        function getLayerSize(layer) {
            var bounds = layer.bounds;
            var width = bounds[2].as("px") - bounds[0].as("px");
            var height = bounds[3].as("px") - bounds[1].as("px");
            return { width: width, height: height, area: width * height };
        }

        // Lấy kích thước hai layer
        var size1 = getLayerSize(layer1);
        var size2 = getLayerSize(layer2);

        // Xác định layer lớn và nhỏ dựa vào diện tích
        var largerLayer, smallerLayer;
        var largerSize, smallerSize;

        if (size1.area >= size2.area) {
            largerLayer = layer1;
            largerSize = size1;
            smallerLayer = layer2;
            smallerSize = size2;
        } else {
            largerLayer = layer2;
            largerSize = size2;
            smallerLayer = layer1;
            smallerSize = size1;
        }

        // Tính tỉ lệ resize riêng biệt theo X và Y
        var scaleX = (largerSize.width / smallerSize.width) * 100;
        var scaleY = (largerSize.height / smallerSize.height) * 100;

        // Kiểm tra độ chênh lệch trong phạm vi 10%
        var widthDiff = Math.abs(largerSize.width - smallerSize.width) / largerSize.width;
        var heightDiff = Math.abs(largerSize.height - smallerSize.height) / largerSize.height;

        if (widthDiff <= 0.1 && heightDiff <= 0.1) {
            // Đặt layer nhỏ hơn làm active và resize nó
            doc.activeLayer = smallerLayer;
            smallerLayer.resize(scaleX, scaleY);
        }
    }
}

