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

        // === LƯU FILE PNG ĐÃ THAY ẢNH ===
        var outFile = new File(imgFolder + "/" + imgName + ".png");
        var pngOpts = new PNGSaveOptions();
        workDoc.saveAs(outFile, pngOpts, true, Extension.LOWERCASE);

        workDoc.close(SaveOptions.DONOTSAVECHANGES);
    }
}

// === HÀM: Thay ảnh trong Smart Object ===
function replaceSmartObject(layerName, imageFile, docRef) {
    var theLayer = null;

    // Tìm layer smart object theo tên
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

        // Xoá layer cũ
        smartDoc.artLayers[0].remove();

        // Mở ảnh mới
        var newImage = app.open(new File(imageFile));
        newImage.selection.selectAll();
        newImage.selection.copy();
        newImage.close(SaveOptions.DONOTSAVECHANGES);

        // Dán ảnh vào smartDoc
        smartDoc.paste();

        // Lưu thay đổi vào Smart Object
        smartDoc.save();
        smartDoc.close(SaveOptions.DONOTSAVECHANGES);
    } else {
        alert("Không tìm thấy layer thông minh '" + layerName + "'");
    }
}
