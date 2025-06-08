export const Message = {
    ERROR_INVALID_FILE_IMAGE: 'File không hợp lệ',
    ERROR_OVER_SZIE_FILE_IMAGE: 'Kích thước ảnh vượt qua 2MB',
    ERROR_FROM_CLOUNDARY: 'Không thể lưu ảnh! Lỗi từ Cloundary!',
    ERROR_INVALID_USER: 'User không hợp lệ',
    ERROR_SERVER: 'Lỗi máy chủ! Thử lại sau!',
    ERROR_INSUFFICIENT_STOCK: 'Số lượng hàng tồn kho không đủ',
    ERROR_QUANTITY_MUST_BE_GREATER_THAN_ZERO: 'Vui lòng chọn số lượng lớn hơn 0 trước khi thêm vào giỏ hàng',
    ERROR_SAVE_ORDER_AFTER_SUCCESS_PAYMENT: 'Lỗi tạo hóa đơn sau khi thanh toán thành công! Vui lòng liên hệ chủ cửa hàng!',

    SUCCESS_UPDATE_AVATAR: 'Cập nhật avatar thành công',
    SUCCESS_ADD_TO_CART: 'Đã thêm vào giỏ hàng',
    SUCCESS_ADD_NEW_COLOR: 'Thêm màu mới thành công',
    SUCCESS_CUSTOM_INFOR_FOR_ORDER: 'Cập nhật thông tin hóa đơn thành công',
    SUCCESS_CANCEL_FOR_ORDER: 'Hủy đơn hàng thành công',
    SUCCESS_RETURNING_FOR_ORDER: 'Đã gửi yêu cầu hoàn hàng',
    SUCCESS_DELETED_PRODUCT: 'Đã được chuyển vào thùng rác! Sản phẩm sẽ tự xóa vĩnh viễn sau 90 ngày hoặc không ràng buộc bởi hóa đơn nào!',

    FAIL_UPDATE_AVATAR: 'Cập nhật avatar thất bại',

    MISSING_CATEGORY_NAME: 'Vui lòng nhập tên thể loại',
    MISSING_BRAND_NAME: 'Vui lòng nhập tên thương hiệu',
    MISSING_COLOR_SELECTION_TO_PAY: 'Vui lòng chọn màu sản phẩm trước khi thanh toán',
    MISSING_COLOR_SELECTION_TO_ADD_CART: 'Vui lòng chọn màu sản phẩm trước khi thêm vào giỏ hàng',
    MISSING_ADDRESS: 'Vui lòng nhập địa chỉ chính xác trước khi đặt hàng',
    MISSING_INFOR_FOR_ORDER: 'Vui lòng nhập thông tin đầy đủ trước khi lưu',
    MISSING_OF_ADDRESS: 'Vui lòng nhập đầy đủ thông tin chi tiết địa chỉ cần giao hàng!',
    MISSING_CATEGORY_NAME_WHEN_CREATE: 'Vui lòng chọn tên thể loại',
    MISSING_BRAND_NAME_WHEN_CREATE: 'Vui lòng chọn tên thương hiệu',
    MISSING_SKU_WHEN_CREATE: 'Vui lòng nhập mã sản phẩm',
    MISSING_PRODUCT_NAME_WHEN_CREATE: 'Vui lòng nhập tên sản phẩm',
    MISSING_IMAGES_WHEN_CREATE: 'Vui lòng chọn ít nhất 1 ảnh',
    MISSING_MAIN_IMAGE_WHEN_CREATE: 'Vui lòng chọn ảnh đại diện cho sản phẩm',
    MISSING_COLORS_WHEN_CREATE: 'Vui lòng chọn 1 nhất 1 màu cho sản phẩm',
    MISSING_NUMBER_STARS: 'Vui lòng chọn số sao để đánh giá sản phẩm',

    INVALID_SKU: 'Mã sản phẩm không được chứa dấu cách',
    INVALID_QUANTITY: 'Số lượng không hợp lệ',
    INVALID_PHONE_NUMBER: 'Số điện thoại không hợp lệ',
    INVALID_QUANTITY_OF_PRODUCT: (productName: string) =>
        `Số lượng sản phẩm của ${productName} không phù hợp`,

    EXIST_COLOR: 'Màu đã tồn tại',

    PLEASE_LOGIN_TO_ADD_TO_CART: 'Vui lòng đăng nhập để thêm vào giỏ hàng',
    PLEASE_LOGIN_TO_ADD_TO_BUY: 'Vui lòng đăng nhập để mua sản phẩm',

    THANK_YOU_FOR_PURCHASE: 'Cảm ơn bạn đã mua hàng!',
    THANK_YOU_FOR_REVIEW: 'Cảm ơn bạn đã đánh giá sản phẩm!',

    MAX_FILES_LENGTH: 'Tối đa 6 ảnh',
}