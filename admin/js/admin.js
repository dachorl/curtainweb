// 로그인 처리
document.getElementById('adminLoginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('adminId').value;
    const pw = document.getElementById('adminPw').value;
    
    // 실제 구현시에는 서버와 통신하여 인증
    if(id === 'admin' && pw === '1234') {
        localStorage.setItem('adminLoggedIn', 'true');
        window.location.href = 'dashboard.html';
    } else {
        alert('아이디 또는 비밀번호가 잘못되었습니다.');
    }
});

// 로그인 체크
function checkLogin() {
    if(!localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'login.html';
    }
}

// 제품 관리
class ProductManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('products')) || [];
        this.bindEvents();
        this.renderProducts();
    }

    bindEvents() {
        document.getElementById('addProductBtn')?.addEventListener('click', () => {
            this.openModal();
        });

        document.getElementById('productForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct(e.target);
        });
    }

    openModal(product = null) {
        const modal = document.getElementById('productModal');
        modal.style.display = 'block';
        
        if(product) {
            // 수정 모드
            document.querySelector('[name="name"]').value = product.name;
            document.querySelector('[name="category"]').value = product.category;
            document.querySelector('[name="price"]').value = product.price;
        }
    }

    closeModal() {
        const modal = document.getElementById('productModal');
        modal.style.display = 'none';
    }

    saveProduct(form) {
        const formData = new FormData(form);
        const product = {
            id: Date.now(),
            name: formData.get('name'),
            category: formData.get('category'),
            price: formData.get('price'),
            description: formData.get('description')
        };

        // 이미지 처리
        const imageFile = formData.get('image');
        if(imageFile.size > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                product.image = e.target.result;
                this.products.push(product);
                this.saveToStorage();
                this.renderProducts();
                this.closeModal();
            };
            reader.readAsDataURL(imageFile);
        }
    }

    saveToStorage() {
        localStorage.setItem('products', JSON.stringify(this.products));
    }

    renderProducts() {
        const tbody = document.getElementById('productList');
        if(!tbody) return;

        tbody.innerHTML = this.products.map(product => `
            <tr>
                <td><img src="${product.image}" alt="${product.name}" width="50"></td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price}원</td>
                <td>판매중</td>
                <td>
                    <button onclick="productManager.editProduct(${product.id})">수정</button>
                    <button onclick="productManager.deleteProduct(${product.id})">삭제</button>
                </td>
            </tr>
        `).join('');
    }
} 