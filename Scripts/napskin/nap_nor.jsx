#target photoshop

// === CẤU HÌNH ===
var actionName = "pet";       // Tên action
var actionSet = "phu(laze/pet)";       // Tên action set

// === LẤY FILE PSD ĐANG MỞ ===
var doc = app.activeDocument;

// === CHỌN THƯ MỤC ẢNH ===
var imgFolder = Folder.selectDialog("Chọn thư mục chứa ảnh để thay thế");

if (imgFolder) {
    var images = imgFolder.getFiles(/\.(jpg|jpeg|png)$/i);

    for (var i = 0; i < images.length; i++) {
        var imgFile = images[i];
        var imgName = imgFile.name.replace(/\.[^\.]+$/, "");

        // Duplicate file PSD hiện tại
        var workDoc = doc.duplicate(imgName);

        // === THAY ẢNH TRONG SMART OBJECT 'picture' ===
        replaceSmartObject("picture", imgFile, workDoc);

        // === ĐỔI TEXT TRONG GROUP 'code' ===
        changeTextInGroup("code", imgName, workDoc);

        // === CHẠY ACTION ===
        app.doAction(actionName, actionSet);

        // === (Tuỳ chọn) Lưu hoặc Xuất file ở đây ===
        // var outFile = new File(imgFolder + "/" + imgName + "_out.png");
        // var opts = new PNGSaveOptions();
        // workDoc.saveAs(outFile, opts, true);

        workDoc.close(SaveOptions.DONOTSAVECHANGES);
    }
}

// === HÀM: Thay ảnh trong Smart Object và căn giữa theo toàn bộ layer ===
function replaceSmartObject(layerName, imageFile, docRef) {
    var theLayer = null;

    // Tìm layer có tên chính xác
    for (var i = 0; i < docRef.artLayers.length; i++) {
        if (docRef.artLayers[i].name === layerName) {
            theLayer = docRef.artLayers[i];
            break;
        }
    }

    if (theLayer) {
        app.activeDocument = docRef;
        docRef.activeLayer = theLayer;

        // Mở nội dung Smart Object
        executeAction(stringIDToTypeID("placedLayerEditContents"), undefined, DialogModes.NO);

        var smartDoc = app.activeDocument;

        // Xoá layer ảnh cũ
        smartDoc.artLayers[0].remove();

        // Mở ảnh mới
        var newImage = new File(imageFile);
        var imageDoc = app.open(newImage);

        // Copy ảnh mới
        imageDoc.selection.selectAll();
        imageDoc.selection.copy();
        imageDoc.close(SaveOptions.DONOTSAVECHANGES);

        // Dán vào Smart Object
        smartDoc.paste();

        // Căn giữa layer vừa dán (bỏ qua khoảng trong suốt)
        var pastedLayer = smartDoc.activeLayer;

        // Tính kích thước layer dán
        var layerWidth = pastedLayer.bounds[2].as("px") - pastedLayer.bounds[0].as("px");
        var layerHeight = pastedLayer.bounds[3].as("px") - pastedLayer.bounds[1].as("px");

        // Dịch về góc trái-trên
        pastedLayer.translate(-pastedLayer.bounds[0], -pastedLayer.bounds[1]);

        // Căn giữa layer vào canvas
        var targetX = (smartDoc.width.as("px") - layerWidth) / 2;
        var targetY = (smartDoc.height.as("px") - layerHeight) / 2;
        pastedLayer.translate(targetX, targetY);

        // Lưu và đóng mà không flatten
        smartDoc.save();
        smartDoc.close();
    } else {
        alert("Không tìm thấy layer thông minh có tên '" + layerName + "' trong file PSD.");
    }
}

// === HÀM: Đổi text trong group ===
function changeTextInGroup(groupName, newText, docRef) {
    var group = docRef.layerSets.getByName(groupName);
    for (var i = 0; i < group.artLayers.length; i++) {
        var layer = group.artLayers[i];
        if (layer.kind === LayerKind.TEXT) {
            layer.textItem.contents = newText;
        }
    }
}
