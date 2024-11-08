document.addEventListener('DOMContentLoaded', function() {
    fetchProductData();
});

function fetchProductData() {
    fetch('http://localhost/CuaHangDT/api/sanPham/show.php') // Thay bằng đường dẫn chính xác đến file PHP của bạn
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                populateTable(data);
            } else {
                console.error('No products found or error in response');
            }
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
        });
}

function populateTable(products) {
    const productTable = document.getElementById('productTable');
    productTable.innerHTML = ''; // Xóa nội dung bảng cũ nếu có

    products.forEach((product, index) => {
        const row = document.createElement('tr');

        // Cột số thứ tự
        const serialCol = document.createElement('td');
        serialCol.textContent = index + 1;
        row.appendChild(serialCol);

        // Cột tên sản phẩm
        const nameCol = document.createElement('td');
        nameCol.textContent = product.product_name;
        row.appendChild(nameCol);

        // Cột giá
        const priceCol = document.createElement('td');
        priceCol.textContent = product.price;
        row.appendChild(priceCol);

        // Cột số lượng
        const stockCol = document.createElement('td');
        stockCol.textContent = product.stock;
        row.appendChild(stockCol);

        // Cột hình ảnh thumbnail
        const thumbnailCol = document.createElement('td');
        if (product.thumbnail_image && product.thumbnail_image !== 'NULL') {
            const img = document.createElement('img');
            img.src = product.thumbnail_image;
            img.alt = product.product_name;
            img.style.width = '50px';
            thumbnailCol.appendChild(img);
        } else {
            thumbnailCol.textContent = 'No image';
        }
        row.appendChild(thumbnailCol);

        // Cột thao tác: Xem chi tiết, Sửa, Xóa
        const actionCol = document.createElement('td');

        // Nút xem chi tiết
        const detailBtn = document.createElement('button');
        detailBtn.textContent = 'Xem Chi Tiết';
        detailBtn.className = 'button button-detail'; // Thêm lớp cho nút xem chi tiết
        detailBtn.addEventListener('click', () => showProductDetails(product));
        actionCol.appendChild(detailBtn);

        // Nút sửa sản phẩm
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Sửa';
        editBtn.className = 'button button-edit'; // Thêm lớp cho nút sửa
        editBtn.addEventListener('click', () => editProduct(product));
        actionCol.appendChild(editBtn);

        // Nút xóa sản phẩm
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Xóa';
        deleteBtn.className = 'button button-delete'; // Thêm lớp cho nút xóa
        deleteBtn.addEventListener('click', () => deleteProduct(product.product_id));
        actionCol.appendChild(deleteBtn);

        row.appendChild(actionCol);

        // Thêm dòng vào bảng
        productTable.appendChild(row);
    });
}

// Hàm hiển thị chi tiết sản phẩm
function showProductDetails(product) {
    const detailModal = document.getElementById('detailModal');
    detailModal.style.display = 'block'; // Hiển thị modal (hoặc bạn có thể sử dụng cách khác)

    // Cập nhật thông tin chi tiết sản phẩm trong modal
    document.getElementById('detailProductName').textContent = product.product_name;
    document.getElementById('detailDescription').textContent = product.description;
    document.getElementById('detailPrice').textContent = product.price;
    document.getElementById('detailStock').textContent = product.stock;
    document.getElementById('detailCategory').textContent = product.category_id;
    document.getElementById('detailSupplier').textContent = product.supplier_id;
    document.getElementById('detailCreated').textContent = product.created_at;
    document.getElementById('detailUpdated').textContent = product.updated_at;

    // Hiển thị hình ảnh chi tiết nếu có
    const detailImages = [product.detail_image1, product.detail_image2, product.detail_image3];
    detailImages.forEach((imgUrl, index) => {
        const imgElement = document.getElementById(`detailImage${index + 1}`);
        if (imgUrl && imgUrl !== 'NULL') {
            imgElement.src = imgUrl;
            imgElement.style.display = 'block';
        } else {
            imgElement.style.display = 'none';
        }
    });
}

// Hàm sửa sản phẩm
function editProduct(product) {
    // Mở modal hoặc dẫn tới trang sửa sản phẩm
    const editModal = document.getElementById('editModal');
    editModal.style.display = 'block'; // Hiển thị modal sửa sản phẩm

    // Điền thông tin hiện tại của sản phẩm vào các trường input
    document.getElementById('editProductId').value = product.product_id;
    document.getElementById('editProductName').value = product.product_name;
    document.getElementById('editDescription').value = product.description;
    document.getElementById('editPrice').value = product.price;
    document.getElementById('editStock').value = product.stock;
    document.getElementById('editCategory').value = product.category_id;
    document.getElementById('editSupplier').value = product.supplier_id;
}

// Hàm lưu thay đổi sau khi sửa
function saveProductChanges() {
    const productId = document.getElementById('editProductId').value;
    const updatedProduct = {
        product_name: document.getElementById('editProductName').value,
        description: document.getElementById('editDescription').value,
        price: document.getElementById('editPrice').value,
        stock: document.getElementById('editStock').value,
        category_id: document.getElementById('editCategory').value,
        supplier_id: document.getElementById('editSupplier').value
    };

    fetch(`http://localhost/CuaHangDT/api/sanPham/update.php?id=${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Cập nhật sản phẩm thành công!');
                fetchProductData(); // Tải lại danh sách sản phẩm sau khi cập nhật
                document.getElementById('editModal').style.display = 'none'; // Đóng modal sửa
            } else {
                alert('Có lỗi xảy ra khi cập nhật sản phẩm.');
            }
        })
        .catch(error => {
            console.error('Error updating product:', error);
        });
}

function deleteProduct(productId) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
        fetch(`http://localhost/CuaHangDT/api/sanPham/delete.php?id=${productId}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Sản phẩm đã được xóa thành công!');
                    fetchProductData(); // Tải lại danh sách sản phẩm sau khi xóa
                } else {
                    alert('Có lỗi xảy ra khi xóa sản phẩm.');
                }
            })
            .catch(error => {
                console.error('Error deleting product:', error);
            });
    }
}
const detailImages = [product.detail_image1, product.detail_image2, product.detail_image3];
detailImages.forEach((imgUrl, index) => {
    const imgElement = document.getElementById(`detailImage${index + 1}`);
    if (imgUrl && imgUrl !== 'NULL') {
        imgElement.src = imgUrl;
        imgElement.style.display = 'block';
    } else {
        imgElement.style.display = 'none';
    }
});

function saveProductChanges() {
    const productId = document.getElementById('editProductId').value;
    const updatedProduct = {
        product_name: document.getElementById('editProductName').value,
        description: document.getElementById('editDescription').value,
        price: document.getElementById('editPrice').value,
        stock: document.getElementById('editStock').value,
        category_id: document.getElementById('editCategory').value,
        supplier_id: document.getElementById('supplierTable').value
    };

    const formData = new FormData();
    formData.append('product', JSON.stringify(updatedProduct));
    const imageInput = document.getElementById('editImage');
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }

    fetch(`http://localhost/CuaHangDT/api/sanPham/update.php?id=${productId}`, {
            method: 'PUT',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Cập nhật sản phẩm thành công!');
                fetchProductData(); // Tải lại danh sách sản phẩm sau khi cập nhật
                closeModal('editModal'); // Đóng modal sửa
            } else {
                alert('Có lỗi xảy ra khi cập nhật sản phẩm.');
            }
        })
        .catch(error => {
            console.error('Error updating product:', error);
        });
}


function fetchSupplierData() {
    fetch('http://localhost/CuaHangDT/api/nhaCungCap/show.php')
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                populateSupplierTable(data);
            } else {
                console.error('No suppliers found or error in response');
            }
        })
        .catch(error => {
            console.error('Error fetching supplier data:', error);
        });
}

function populateSupplierTable(suppliers) {
    const supplierTable = document.getElementById('supplierTable').getElementsByTagName('tbody')[0];
    supplierTable.innerHTML = '';

    suppliers.forEach((supplier, index) => {
        const row = document.createElement('tr');

        const serialCol = document.createElement('td');
        serialCol.textContent = index + 1;
        row.appendChild(serialCol);

        const nameCol = document.createElement('td');
        nameCol.textContent = supplier.supplier_name; // Thay đổi theo tên trường trong dữ liệu
        row.appendChild(nameCol);

        const contactCol = document.createElement('td');
        contactCol.textContent = supplier.contact_info; // Thay đổi theo tên trường trong dữ liệu
        row.appendChild(contactCol);

        supplierTable.appendChild(row);


    });
}