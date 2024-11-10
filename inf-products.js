document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    fetch(`http://localhost/CuaHangDT/api/sanpham/show.php?id=${productId}`)
        .then(response => response.json())
        .then(data => {
            const productDetail = document.getElementById('product-detail');
            const product = data;

            productDetail.innerHTML = `
                <div class="product-image">
                    <img src="${product.thumbnail_image}" alt="${product.product_name}">
                    <div class="thumbnail-images">
                        <img src="${product.detail_image1}" alt="Thumbnail 1" onclick="changeImage('img/iPhone 16 ProMax 256GB/1.png')">
                        <img src="${product.detail_image1}" alt="Thumbnail 2" onclick="changeImage('img/iPhone 16 ProMax 256GB/1.png')">
                        <img src="${product.detail_image1}" alt="Thumbnail 3" onclick="changeImage('img/iPhone 16 Pro Max 256GB/3.png')">
                        <img src="${product.detail_image1}" alt="Thumbnail 4" onclick="changeImage('img/iPhone 16 Pro Max 256GB/4.png')">
                        <img src="${product.detail_image1}" alt="Thumbnail 5" onclick="changeImage('img/iPhone 16 Pro Max 256GB/5.png')">
                    </div>
                </div>
                <div class="product-info">
                    <h2>${product.product_name}</h2>
                    <p><b>Thông tin:</b> <br/> ${product.description}</p> <br/>
                    <p>Giá: <strong>${Number(product.price).toLocaleString()}</strong> <del>34.990.000VND</del></p>
                    <button>Thêm vào giỏ hàng</button>
                </div>
            `;
        })
        .catch(error => console.error('Error fetching product detail:', error));
});